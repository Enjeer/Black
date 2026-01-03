import React, { useEffect, useRef, useState } from 'react' 
import './AccountInfo.css' 
import settingsImage from '../../../assets/img/settings.svg' 
import profileImage from '../../../assets/img/profile_picture.png' 

type AccountInfoProps = {
    id: number;
    onOpenSettings: () => void; // новая пропса
};

const AccountInfo = ({ id, onOpenSettings}: AccountInfoProps) => { 

    return ( 
    <div className="container account"> 
        <div className="profile_container"> 
            <div className="profile"> 
                <img src={profileImage} alt="" /> 
                <div className="profile_info"> 
                    <span className="name">First Last</span> 
                    <span className="status">.Gay</span> 
                </div> 
            </div> 
            <div className="settings"> 
                <button type="button" onClick={onOpenSettings}> 
                    <img src={settingsImage} alt="" /> 
                </button> 
            </div> 
        </div> 
        <hr /> 
    </div> 
); }; 

export default AccountInfo