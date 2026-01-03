// App.tsx
import { useState } from 'react';
import './App.css';
import Interface from './components/Interface/Interface.tsx';
import Menu from './components/layout/Menu/Menu.tsx';
import DragResizer from './components/uiPrimitive/DragResizer/DragResizer.tsx';

function App() {
  // state для активной вкладки
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');

  return (
    <div data-grid-container className='container app grid-container'>
      <div className="menuCont appSubContainer">
        {/* передаем функцию изменения вкладки в Menu */}
        <Menu activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="separator">
        <DragResizer />
      </div>

      <div className="interfaceCont appSubContainer">
        {/* передаем текущую вкладку в Interface */}
        <Interface activeTab={activeTab} />
      </div>
    </div>
  );
}

export default App;
