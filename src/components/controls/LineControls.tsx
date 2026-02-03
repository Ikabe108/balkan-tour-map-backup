import { useProjectStore } from '../../store/useProjectStore';
import { Slider } from '../ui/Slider';
import { ColorPicker } from '../ui/ColorPicker';
import type { DashPattern } from '../../types';

export function LineControls() {
  const { lineStyle, setLineStyle } = useProjectStore();

  return (
    <div className="space-y-4">
      <ColorPicker
        label="Line Color"
        value={lineStyle.color}
        onChange={(color) => setLineStyle({ color })}
      />

      <Slider
        label="Width"
        value={lineStyle.width}
        onChange={(width) => setLineStyle({ width })}
        min={1}
        max={10}
        unit="px"
      />

      <Slider
        label="Opacity"
        value={lineStyle.opacity}
        onChange={(opacity) => setLineStyle({ opacity })}
        min={0.1}
        max={1}
        step={0.1}
      />

      <Slider
        label="Smoothness"
        value={lineStyle.smoothness}
        onChange={(smoothness) => setLineStyle({ smoothness })}
        min={0}
        max={1}
        step={0.1}
      />

      <div className="space-y-2">
        <label className="text-sm text-gray-600">Dash Pattern</label>
        <div className="flex p-1 bg-gray-100 rounded-lg gap-1">
          {(['solid', 'dashed', 'dotted'] as DashPattern[]).map((pattern) => (
            <button
              key={pattern}
              onClick={() => setLineStyle({ dashPattern: pattern })}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                lineStyle.dashPattern === pattern
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-gray-600 font-medium">Arrows</label>
          <input
            type="checkbox"
            checked={lineStyle.showArrows}
            onChange={(e) => setLineStyle({ showArrows: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {lineStyle.showArrows && (
          <div className="space-y-3">
            <Slider
              label="Arrow Spacing"
              value={lineStyle.arrowSpacing}
              onChange={(arrowSpacing) => setLineStyle({ arrowSpacing })}
              min={20}
              max={200}
              unit="px"
            />
            <Slider
              label="Arrow Size"
              value={lineStyle.arrowSize}
              onChange={(arrowSize) => setLineStyle({ arrowSize })}
              min={5}
              max={20}
              unit="px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
