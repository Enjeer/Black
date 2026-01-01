import React from 'react'
import './AccountInfo.css'

type AccountInfoProps = {
    id: number;
};

const AccountInfo = ({ id }: AccountInfoProps) => {
    return (
        <div className="container account">
            <div className="profile_container">
                <div className="profile">
                    <img src={'profile_pic_' + id} alt="" />
                    <div className="name">
                        <p className="name"></p>
                        <p className="status"></p>
                    </div>
                </div>
                <div className="settings">
                    <button type="button">
                        <img src="" alt="" />
                    </button>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default AccountInfo