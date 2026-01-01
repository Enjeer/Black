import './App.css';
import Interface from './components/Interface/Interface.tsx';
import Menu from './components/layout/Menu/Menu.tsx';
import DragResizer from './components/uiPrimitive/DragResizer/DragResizer.tsx'
import Button from './components/uiPrimitive/Button/Button.js';

function App() {
  return (
    <>
      <div data-grid-container className='container app grid-container'>
        <div className="menuCont appSubContainer">
          <Menu/> 
        </div>
        <div className="separator">
          <DragResizer/>
        </div>
        <div className="interfaceCont appSubContainer">
          <Interface/>
        </div>
      </div>
    </>
  )
} 

export default App
