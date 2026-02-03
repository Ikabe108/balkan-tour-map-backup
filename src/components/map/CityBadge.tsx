import { useRef } from 'react';
import { Plane, Flag } from 'lucide-react';
import type { CityMarker, Point } from '../../types';
import { useProjectStore } from '../../store/useProjectStore';
import { latLngToSvg } from '../../utils/coordinates';

interface CityBadgeProps {
  city: CityMarker;
}

export function CityBadge({ city }: CityBadgeProps) {
  const { selectedCityId, selectCity, updateCityLabelOffset, setIsDragging } = useProjectStore();
  const isSelected = selectedCityId === city.id;
  const dragStartPos = useRef<Point | null>(null);
  const labelStartOffset = useRef<Point | null>(null);

  if (!city.visible || !city.badge) return null;
  if (city.type !== 'start' && city.type !== 'end') return null;

  const { badge, name, label, cityData } = city;
  
  // Calculate coordinates dynamically from lat/lng to ensure they are always in sync with the map
  const coords = latLngToSvg(cityData.lat, cityData.lng);

  // Badge dimensions
  const iconSize = badge.iconSize || 14;
  const textSize = label.fontSize || 12;
  const iconPadding = badge.iconPadding !== undefined ? badge.iconPadding : 6;
  const isIconAbove = badge.layout === 'icon-above';
  
  const displayName = label.textTransform === 'uppercase' ? name.toUpperCase() : name;

  // Estimate text width (rough approximation)
  const textWidth = displayName.length * textSize * 0.6;
  
  // Calculate width/height based on layout
  let badgeWidth: number;
  let badgeHeight: number;
  let circularIconY = 0;
  
  if (isIconAbove) {
    badgeWidth = badge.paddingX * 2 + textWidth;
    badgeHeight = badge.paddingY * 2 + textSize;
    // Circular icon is above the badge
    circularIconY = -badgeHeight / 2 - iconSize / 2 - iconPadding;
  } else {
    badgeWidth = badge.paddingX * 2 + textWidth + (badge.iconPosition !== 'none' ? iconSize + iconPadding : 0);
    badgeHeight = badge.paddingY * 2 + Math.max(iconSize, textSize);
  }

  // Position badge
  const getBadgePosition = () => {
    const safeBadgeHeight = badgeHeight || 24;
    const safeOffset = label.offset || 12;
    const totalHeight = isIconAbove ? safeBadgeHeight + iconSize + iconPadding : safeBadgeHeight;

    if (label.placement === 'custom' && label.customOffset) {
      return {
        x: coords.x + label.customOffset.x,
        y: coords.y + label.customOffset.y
      };
    }
    // Default: above the city
    return {
      x: coords.x,
      y: coords.y - safeOffset - totalHeight / 2
    };
  };

  const badgePos = getBadgePosition();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCity(city.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const svg = (e.currentTarget as SVGElement).ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    dragStartPos.current = { x: cursor.x, y: cursor.y };
    
    if (label.placement === 'custom' && label.customOffset) {
      labelStartOffset.current = { ...label.customOffset };
    } else {
      labelStartOffset.current = { 
        x: badgePos.x - coords.x, 
        y: badgePos.y - coords.y 
      };
    }

    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartPos.current || !labelStartOffset.current) return;

      const mpt = svg.createSVGPoint();
      mpt.x = moveEvent.clientX;
      mpt.y = moveEvent.clientY;
      const mCursor = mpt.matrixTransform(svg.getScreenCTM()?.inverse());

      const dx = mCursor.x - dragStartPos.current.x;
      const dy = mCursor.y - dragStartPos.current.y;

      updateCityLabelOffset(city.id, {
        x: labelStartOffset.current.x + dx,
        y: labelStartOffset.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartPos.current = null;
      labelStartOffset.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Select icon based on city type
  const IconComponent = city.type === 'start' ? Plane : Flag;

  return (
    <g 
      className="city-badge cursor-move drag-handle" 
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {/* Selection highlight */}
      {isSelected && (
        <rect
          x={badgePos.x - badgeWidth / 2 - 3}
          y={badgePos.y - (isIconAbove ? badgeHeight / 2 + iconSize + iconPadding : badgeHeight / 2) - 3}
          width={badgeWidth + 6}
          height={(isIconAbove ? badgeHeight + iconSize + iconPadding : badgeHeight) + 6}
          rx={badge.borderRadius + 3}
          ry={badge.borderRadius + 3}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      )}

      {/* Circular Icon Badge (for icon-above layout) */}
      {isIconAbove && (
        <g transform={`translate(${badgePos.x}, ${badgePos.y + circularIconY})`}>
          <circle
            r={iconSize / 2 + 4}
            fill={badge.backgroundColor}
            className="drag-handle"
          />
          <g transform={`translate(${-iconSize / 2}, ${-iconSize / 2})`}>
            <IconComponent
              size={iconSize}
              color={badge.textColor}
            />
          </g>
        </g>
      )}

      {/* Badge background */}
      <rect
        x={badgePos.x - badgeWidth / 2}
        y={badgePos.y - badgeHeight / 2}
        width={badgeWidth}
        height={badgeHeight}
        rx={badge.borderRadius}
        ry={badge.borderRadius}
        fill={badge.backgroundColor}
        className="drag-handle"
      />

      {/* Badge content */}
      <g className="drag-handle">
        {!isIconAbove && badge.iconPosition === 'left' && (
          <g
            transform={`translate(${badgePos.x - badgeWidth / 2 + badge.paddingX}, ${badgePos.y - iconSize / 2})`}
          >
            <IconComponent
              size={iconSize}
              color={badge.textColor}
            />
          </g>
        )}

        <text
          x={
            isIconAbove 
              ? badgePos.x - textWidth / 2
              : badge.iconPosition === 'left'
              ? badgePos.x - badgeWidth / 2 + badge.paddingX + iconSize + iconPadding
              : badge.iconPosition === 'right'
              ? badgePos.x - badgeWidth / 2 + badge.paddingX
              : badgePos.x - textWidth / 2
          }
          y={badgePos.y}
          dominantBaseline="middle"
          fontSize={textSize}
          fill={badge.textColor}
          fontWeight={label.fontWeight}
          fontStyle={label.fontStyle}
          className="select-none pointer-events-none"
        >
          {displayName}
        </text>

        {!isIconAbove && badge.iconPosition === 'right' && (
          <g
            transform={`translate(${badgePos.x + badgeWidth / 2 - badge.paddingX - iconSize}, ${badgePos.y - iconSize / 2})`}
          >
            <IconComponent
              size={iconSize}
              color={badge.textColor}
            />
          </g>
        )}
      </g>

      {/* Connector line to city dot */}
      <line
        x1={badgePos.x}
        y1={badgePos.y + badgeHeight / 2}
        x2={coords.x}
        y2={coords.y - city.dot.size / 2 - city.dot.outlineWidth}
        stroke={badge.backgroundColor}
        strokeWidth={2}
      />
    </g>
  );
}
