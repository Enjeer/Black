import './App.css';
import Interface from './components/Interface/Interface.jsx';
import Menu from './components/Menu/Menu.jsx';
import Button from './components/Button/Button.jsx'

function App() {

  return (
    <>
      <div className='appContainer'>
        <div className="menuCont">
          <Menu/>
        </div>
        <div className="separator">
          <Button t={'separator'}/>
        </div>
        <div className="interfaceCont">
          <Interface/>
        </div>
      </div>
    </>
  )
} 

export default App
