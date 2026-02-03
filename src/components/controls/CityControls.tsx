import { Trash2, MoveUp, MoveDown, MapPin, Settings2 } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { Slider } from '../ui/Slider';
import { ColorPicker, ColorPresets } from '../ui/ColorPicker';
import type { CityType } from '../../types';

export function CityControls() {
  const {
    cities,
    routeOrder,
    removeCity,
    updateCity,
    setCityType,
    reorderCities,
    selectedCityId,
    selectCity,
  } = useProjectStore();

  const sortedCities = routeOrder
    .map((id) => cities.find((c) => c.id === id))
    .filter((c) => c !== undefined);

  const selectedCity = selectedCityId ? cities.find((c) => c.id === selectedCityId) : null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...routeOrder];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;

    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(newIndex, 0, removed);
    reorderCities(newOrder);
  };

  return (
    <div className="space-y-6">
      {/* Route List */}
      <div className="space-y-2">
        {sortedCities.map((city, idx) => (
          <div
            key={city.id}
            onClick={() => selectCity(city.id)}
            className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
              selectedCityId === city.id
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <button
                disabled={idx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(idx, 'up');
                }}
                className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
              >
                <MoveUp className="w-3 h-3" />
              </button>
              <button
                disabled={idx === sortedCities.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(idx, 'down');
                }}
                className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
              >
                <MoveDown className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 w-4">{idx + 1}.</span>
                <span className="font-medium text-sm truncate">{city.name}</span>
              </div>
              <div className="flex gap-1 mt-1">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                    city.type === 'start'
                      ? 'bg-green-100 text-green-700'
                      : city.type === 'end'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {city.type}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeCity(city.id);
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {cities.length === 0 && (
          <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No cities added yet</p>
          </div>
        )}
      </div>

      {/* Selected City Editor */}
      {selectedCity && (
        <div className="pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Edit {selectedCity.name}</h3>
          </div>

          <div className="space-y-4">
            {/* Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Marker Type
              </label>
              <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
                {(['start', 'route', 'end', 'extra'] as CityType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCityType(selectedCity.id, type)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      selectedCity.type === type
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Label Styling */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Label Style
              </label>
              <Slider
                label="Font Size"
                value={selectedCity.label.fontSize}
                onChange={(fontSize) =>
                  updateCity(selectedCity.id, {
                    label: { ...selectedCity.label, fontSize },
                  })
                }
                min={2}
                max={24}
                unit="px"
              />
              <ColorPicker
                label="Font Color"
                value={selectedCity.label.fontColor}
                onChange={(fontColor) =>
                  updateCity(selectedCity.id, {
                    label: { ...selectedCity.label, fontColor },
                  })
                }
              />
              <div className="flex gap-2 items-center">
                <label className="text-sm text-gray-600">Transform</label>
                <select
                  value={selectedCity.label.textTransform}
                  onChange={(e) =>
                    updateCity(selectedCity.id, {
                      label: {
                        ...selectedCity.label,
                        textTransform: e.target.value as any,
                      },
                    })
                  }
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                </select>
              </div>
            </div>

            {/* Badge Styling (only for start/end) */}
            {selectedCity.badge && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Badge Style
                </label>
                <ColorPicker
                  label="Bg Color"
                  value={selectedCity.badge.backgroundColor}
                  onChange={(backgroundColor) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, backgroundColor },
                    })
                  }
                />
                <ColorPicker
                  label="Text Color"
                  value={selectedCity.badge.textColor}
                  onChange={(textColor) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, textColor },
                    })
                  }
                />
                <Slider
                  label="Border Radius"
                  value={selectedCity.badge.borderRadius}
                  onChange={(borderRadius) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, borderRadius },
                    })
                  }
                  min={0}
                  max={24}
                  unit="px"
                />
                <Slider
                  label="Padding X"
                  value={selectedCity.badge.paddingX}
                  onChange={(paddingX) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, paddingX },
                    })
                  }
                  min={0}
                  max={40}
                  unit="px"
                />
                <Slider
                  label="Padding Y"
                  value={selectedCity.badge.paddingY}
                  onChange={(paddingY) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, paddingY },
                    })
                  }
                  min={0}
                  max={30}
                  unit="px"
                />
                <Slider
                  label="Icon Size"
                  value={selectedCity.badge.iconSize}
                  onChange={(iconSize) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, iconSize },
                    })
                  }
                  min={2}
                  max={32}
                  unit="px"
                />
                <Slider
                  label="Icon Spacing"
                  value={selectedCity.badge.iconPadding}
                  onChange={(iconPadding) =>
                    updateCity(selectedCity.id, {
                      badge: { ...selectedCity.badge!, iconPadding },
                    })
                  }
                  min={0}
                  max={20}
                  unit="px"
                />
                <div className="flex gap-2 items-center">
                  <label className="text-sm text-gray-600">Layout</label>
                  <select
                    value={selectedCity.badge.layout}
                    onChange={(e) =>
                      updateCity(selectedCity.id, {
                        badge: {
                          ...selectedCity.badge!,
                          layout: e.target.value as 'horizontal' | 'icon-above',
                        },
                      })
                    }
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="icon-above">Icon Above (Circular)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
