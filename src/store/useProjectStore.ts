import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import type { 
  ProjectState, 
  CityMarker, 
  Point, 
  LineStyle, 
  MapStyle, 
  DotStyle, 
  LabelStyle, 
  BadgeStyle,
  MapIcon,
  IconType
} from '../types';
import { latLngToSvg } from '../utils/coordinates';

const defaultLineStyle: LineStyle = {
  color: '#3b82f6',
  width: 3,
  opacity: 0.8,
  smoothness: 0.5,
  dashPattern: 'solid',
  showArrows: true,
  arrowSpacing: 50,
  arrowSize: 10,
};

const defaultMapStyle: MapStyle = {
  landColor: '#f8fafc',
  seaColor: '#e0f2fe',
  borderColor: '#cbd5e1',
  borderWidth: 0.5,
  highlightColor: '#dbeafe',
  highlightedCountries: [],
  countryColors: {},
};

const defaultDotStyle: DotStyle = {
  size: 8,
  color: '#3b82f6',
  outlineWidth: 2,
  outlineColor: '#ffffff',
};

const defaultLabelStyle: LabelStyle = {
  fontSize: 12,
  fontColor: '#1e293b',
  fontWeight: '600',
  fontStyle: 'normal',
  placement: 'top',
  offset: 12,
  textTransform: 'none',
};

const defaultBadgeStyle: BadgeStyle = {
  backgroundColor: '#e63946',
  textColor: '#ffffff',
  paddingX: 12,
  paddingY: 6,
  borderRadius: 16,
  iconType: 'pin',
  iconPosition: 'left',
  iconSize: 14,
  iconPadding: 6,
  layout: 'horizontal',
};

export const useProjectStore = create<ProjectState>()(
  persist(
    temporal(
      (set, get) => ({
        // Initial state
        name: 'Untitled Tour',
        cities: [],
        routeOrder: [],
        controlPoints: {},
        icons: [],
        lineStyle: defaultLineStyle,
        mapStyle: defaultMapStyle,
        defaultDotStyle: defaultDotStyle,
        defaultLabelStyle: defaultLabelStyle,
        defaultBadgeStyle: defaultBadgeStyle,
        selectedCityId: null,
        selectedIconId: null,
        isDragging: false,

        // Project name
        setProjectName: (name) => set({ name }),

        // City management
        addCity: (cityData) => {
          const id = crypto.randomUUID();
          const isFirst = get().cities.length === 0;
          
          const newCity: CityMarker = {
            id,
            name: cityData.name,
            type: isFirst ? 'start' : 'route',
            visible: true,
            cityData,
            dot: { ...get().defaultDotStyle },
            label: { ...get().defaultLabelStyle },
            badge: isFirst ? { ...get().defaultBadgeStyle } : undefined,
          };

          set((state) => ({
            cities: [...state.cities, newCity],
            routeOrder: [...state.routeOrder, id],
            selectedCityId: id,
            selectedIconId: null,
          }));
        },

        removeCity: (id) =>
          set((state) => ({
            cities: state.cities.filter((c) => c.id !== id),
            routeOrder: state.routeOrder.filter((cityId) => cityId !== id),
            selectedCityId: state.selectedCityId === id ? null : state.selectedCityId,
          })),

        updateCity: (id, updates) =>
          set((state) => ({
            cities: state.cities.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          })),

        updateCityLabelOffset: (id, offset) =>
          set((state) => ({
            cities: state.cities.map((c) =>
              c.id === id
                ? {
                    ...c,
                    label: {
                      ...c.label,
                      placement: 'custom',
                      customOffset: offset,
                    },
                  }
                : c
            ),
          })),

        setCityType: (id, type) =>
          set((state) => {
            const newType = type;
            const shouldHaveBadge = newType === 'start' || newType === 'end';
            
            return {
              cities: state.cities.map((city) => {
                if (city.id !== id) return city;
                return {
                  ...city,
                  type: newType,
                  badge: shouldHaveBadge ? { ...state.defaultBadgeStyle, ...city.badge } : undefined,
                };
              }),
            };
          }),

        reorderCities: (newOrder) => set({ routeOrder: newOrder }),

        // Icon management
        addIcon: (type, coords) => {
          const id = crypto.randomUUID();
          const newIcon: MapIcon = {
            id,
            type,
            coords,
            size: 24,
            color: '#1e293b',
            rotation: 0,
            showBackground: false,
            backgroundColor: '#ffffff',
            backgroundPadding: 4,
            backgroundShape: 'circle',
          };
          set((state) => ({
            icons: [...state.icons, newIcon],
            selectedIconId: id,
            selectedCityId: null,
          }));
        },

        removeIcon: (id) =>
          set((state) => ({
            icons: state.icons.filter((i) => i.id !== id),
            selectedIconId: state.selectedIconId === id ? null : state.selectedIconId,
          })),

        updateIcon: (id, updates) =>
          set((state) => ({
            icons: state.icons.map((i) => (i.id === id ? { ...i, ...updates } : i)),
          })),

        // Style management
        setLineStyle: (style) =>
          set((state) => ({ lineStyle: { ...state.lineStyle, ...style } })),

        setMapStyle: (style) =>
          set((state) => ({ mapStyle: { ...state.mapStyle, ...style } })),

        updateCountryHighlight: (countryId, highlighted) =>
          set((state) => {
            const list = state.mapStyle.highlightedCountries;
            const newList = highlighted
              ? [...list, countryId]
              : list.filter((id) => id !== countryId);
            return {
              mapStyle: { ...state.mapStyle, highlightedCountries: newList },
            };
          }),

        setCountryColor: (countryId, color) =>
          set((state) => ({
            mapStyle: {
              ...state.mapStyle,
              countryColors: { ...state.mapStyle.countryColors, [countryId]: color },
            },
          })),

        // UI state
        selectCity: (id) => set({ selectedCityId: id, selectedIconId: null }),
        selectIcon: (id) => set({ selectedIconId: id, selectedCityId: null }),
        setIsDragging: (isDragging) => set({ isDragging }),

        // Path adjustment
        setControlPoint: (segmentKey, point) =>
          set((state) => ({
            controlPoints: { ...state.controlPoints, [segmentKey]: point },
          })),

        resetControlPoints: () => set({ controlPoints: {} }),

        // Project actions
        saveProject: () => JSON.stringify(get()),
        loadProject: (json) => {
          try {
            const data = JSON.parse(json);
            // Ensure city names aren't duplicated for start/end points on load
            if (data.cities) {
              data.cities = data.cities.map((city: CityMarker) => {
                const type = city.type;
                if (type === 'start' || type === 'end') {
                  return {
                    ...city,
                    type,
                    badge: { ...get().defaultBadgeStyle, ...city.badge },
                  };
                }
                return city;
              });
            }
            set(data);
          } catch (error) {
            console.error('Failed to load project:', error);
          }
        },
        resetProject: () =>
          set({
            name: 'Untitled Tour',
            cities: [],
            routeOrder: [],
            controlPoints: {},
            icons: [],
            lineStyle: defaultLineStyle,
            mapStyle: defaultMapStyle,
            selectedCityId: null,
            selectedIconId: null,
          }),

        // Helpers
        getRoutePoints: () => {
          const state = get();
          return state.routeOrder
            .map((id) => {
              const city = state.cities.find((c) => c.id === id);
              return city ? latLngToSvg(city.cityData.lat, city.cityData.lng) : undefined;
            })
            .filter((c): c is Point => c !== undefined);
        },
      }),
      {
        limit: 50,
        partialize: (state) => {
          // Don't track UI selection/dragging in undo history
          const { selectedCityId, selectedIconId, isDragging, ...rest } = state;
          return rest;
        },
      }
    ),
    {
      name: 'balkan-tour-map-project',
      partialize: (state) => ({
        name: state.name,
        cities: state.cities,
        routeOrder: state.routeOrder,
        controlPoints: state.controlPoints,
        icons: state.icons,
        lineStyle: state.lineStyle,
        mapStyle: state.mapStyle,
        defaultDotStyle: state.defaultDotStyle,
        defaultLabelStyle: state.defaultLabelStyle,
        defaultBadgeStyle: state.defaultBadgeStyle,
      }),
    }
  )
);

// Export the temporal store for easy access in components
export const useTemporalStore = (useProjectStore as any).temporal;
