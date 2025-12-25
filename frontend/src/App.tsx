import './App.css';
import Interface from './components/Interface/Interface.jsx';
import Menu from './components/layout/Menu/Menu.jsx';
import DragResizer from './components/uiPrimitive/DragResizer/DragResizer.js'
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
