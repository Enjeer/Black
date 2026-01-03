// Interface.tsx
import React from 'react';
import './Interface.css';
import Chat from './Chat/Chat.tsx';
import Settings from './Settings/Settings.tsx';

type InterfaceProps = {
    activeTab: 'chat' | 'settings';
};

const Interface = ({ activeTab }: InterfaceProps) => {
    // можно использовать switch или объект
    const renderTab = () => {
        switch (activeTab) {
        case 'chat':
            return <Chat />;
        case 'settings':
            return <Settings />;
        default:
            return null;
        }
    };

    return <div className="interfaceContainer">{renderTab()}</div>;
};

export default Interface;
