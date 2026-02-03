export interface Point {
  x: number;
  y: number;
}

export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export interface CityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  aliases?: string[];
}

export type CityType = 'start' | 'route' | 'end' | 'extra';

export interface DotStyle {
  size: number;
  color: string;
  outlineWidth: number;
  outlineColor: string;
}

export interface LabelStyle {
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'custom';
  offset: number;
  customOffset?: Point;
  textTransform: 'none' | 'uppercase' | 'lowercase';
}

export interface BadgeStyle {
  backgroundColor: string;
  textColor: string;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  iconType?: string;
  iconPosition: 'left' | 'right' | 'none';
  iconSize: number;
  iconPadding: number;
  layout: 'horizontal' | 'icon-above';
}

export interface CityMarker {
  id: string;
  name: string;
  type: CityType;
  visible: boolean;
  cityData: CityData;
  dot: DotStyle;
  label: LabelStyle;
  badge?: BadgeStyle;
}

export type DashPattern = 'solid' | 'dashed' | 'dotted' | 'custom';

export interface LineStyle {
  color: string;
  width: number;
  opacity: number;
  smoothness: number;
  dashPattern: DashPattern;
  customDash?: string;
  showArrows: boolean;
  arrowSpacing: number;
  arrowSize: number;
}

export interface MapStyle {
  landColor: string;
  seaColor: string;
  borderColor: string;
  borderWidth: number;
  highlightColor: string;
  highlightedCountries: string[];
  countryColors: { [key: string]: string };
}

export type IconType = 
  | 'plane' | 'boat' | 'sailboat' | 'ferry' | 'train' | 'bus' | 'car'
  | 'camera' | 'restaurant' | 'hotel' | 'beach' | 'mountain' | 'castle'
  | 'pin' | 'flag' | 'star' | 'heart' | 'anchor' | 'compass';

export interface MapIcon {
  id: string;
  type: IconType;
  coords: Point;
  size: number;
  color: string;
  rotation: number;
  showBackground: boolean;
  backgroundColor: string;
  backgroundPadding: number;
  backgroundShape: 'circle' | 'square' | 'rectangle';
}

export interface ProjectState {
  name: string;
  cities: CityMarker[];
  routeOrder: string[];
  controlPoints: { [key: string]: Point };
  icons: MapIcon[];
  lineStyle: LineStyle;
  mapStyle: MapStyle;
  
  // Defaults for new items
  defaultDotStyle: DotStyle;
  defaultLabelStyle: LabelStyle;
  defaultBadgeStyle: BadgeStyle;
  
  // UI State
  selectedCityId: string | null;
  selectedIconId: string | null;
  isDragging: boolean;
  
  // Actions
  setProjectName: (name: string) => void;
  addCity: (city: CityData) => void;
  removeCity: (id: string) => void;
  updateCity: (id: string, updates: Partial<CityMarker>) => void;
  updateCityLabelOffset: (id: string, offset: Point) => void;
  setCityType: (id: string, type: CityType) => void;
  reorderCities: (newOrder: string[]) => void;
  
  addIcon: (type: IconType, coords: Point) => void;
  removeIcon: (id: string) => void;
  updateIcon: (id: string, updates: Partial<MapIcon>) => void;
  
  setLineStyle: (style: Partial<LineStyle>) => void;
  setMapStyle: (style: Partial<MapStyle>) => void;
  updateCountryHighlight: (countryId: string, highlighted: boolean) => void;
  setCountryColor: (countryId: string, color: string) => void;
  
  selectCity: (id: string | null) => void;
  selectIcon: (id: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  
  setControlPoint: (segmentKey: string, point: Point) => void;
  resetControlPoints: () => void;
  
  saveProject: () => string;
  loadProject: (json: string) => void;
  resetProject: () => void;
  
  getRoutePoints: () => Point[];
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg';
  scale: number;
  quality?: number;
}
