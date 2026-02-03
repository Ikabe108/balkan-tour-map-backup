# Balkan Tour Map

A specialized map tool for planning tours and creating beautiful route visualizations of the Balkan region.

## Changes in Version 0.1

### Bug Fixes
- Resolved `TypeError` with `temporal` store access in `BottomBar.tsx` and `useProjectStore.ts`.
- Fixed a `NaN` calculation bug in `CityBadge.tsx` that caused massive/displaced icons for Start/End cities.
- Resolved map panning conflict when dragging icons or city labels by using the `drag-handle` exclusion class.

### UI/UX Improvements
- Removed "Quick start" section from the sidebar.
- Implemented auto-opening of sidebar sections ("Cities" or "Icons") when an element is selected on the map.
- Hid standard city name labels for Start/End cities to avoid duplication with their stylized badges.

### New Features
- **Icon Interaction**: Icons are now selectable and draggable on the map.
- **Advanced Icon Styling**: Added controls for icon size, color, rotation, and background (Circle, Square, Rectangle) with custom padding and color.
- **Enhanced City Badges**:
    - Added separate controls for Start/End city badge padding, icon size, and icon spacing.
    - Lowered minimum font size for city names to 2px.
    - Lowered minimum icon size for city badges to 2px.
    - Implemented "Icon Above (Circular)" layout option for Start/End city badges.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Tech Stack
- React + Vite
- D3.js (Map rendering)
- Zustand (State management with Undo/Redo)
- Tailwind CSS (Styling)
- Lucide React (Icons)
