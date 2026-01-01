import React from 'react'
import './Menu.css'
import AccountInfo from '../AccountInfo/AccountInfo.tsx'

const Menu = () => {
    return(
        <div className="container menu">
            <AccountInfo id={12}/>
            <div className="TasksContainer">
                {/* <CurrentTasks/> */}
                {/* <History/> */}
            </div>
        </div>
    )
}

export default Menu