import { useProjectStore } from '../../store/useProjectStore';
import { ColorPicker } from '../ui/ColorPicker';
import { Slider } from '../ui/Slider';

export function MapStyleControls() {
  const { mapStyle, setMapStyle } = useProjectStore();

  return (
    <div className="space-y-4">
      <ColorPicker
        label="Land Color"
        value={mapStyle.landColor}
        onChange={(landColor) => setMapStyle({ landColor })}
      />

      <ColorPicker
        label="Sea Color"
        value={mapStyle.seaColor}
        onChange={(seaColor) => setMapStyle({ seaColor })}
      />

      <ColorPicker
        label="Border Color"
        value={mapStyle.borderColor}
        onChange={(borderColor) => setMapStyle({ borderColor })}
      />

      <Slider
        label="Border Width"
        value={mapStyle.borderWidth}
        onChange={(borderWidth) => setMapStyle({ borderWidth })}
        min={0}
        max={2}
        step={0.1}
        unit="px"
      />

      <div className="pt-2 border-t border-gray-100">
        <ColorPicker
          label="Highlight Color"
          value={mapStyle.highlightColor}
          onChange={(highlightColor) => setMapStyle({ highlightColor })}
        />
      </div>
    </div>
  );
}
