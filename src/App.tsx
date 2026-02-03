import { MapCanvas } from './components/layout/MapCanvas';
import { LeftPanel } from './components/layout/LeftPanel';
import { BottomBar } from './components/layout/BottomBar';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <MapCanvas />
      </div>
      <BottomBar />
    </div>
  );
}

export default App;
