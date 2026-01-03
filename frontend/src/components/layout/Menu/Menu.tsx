// Menu.tsx
import React from 'react';
import './Menu.css';
import AccountInfo from '../AccountInfo/AccountInfo.tsx';
import PageRouter from '../PageRouter/PageRouter.tsx';
import ChatPageImage from '../../../assets/img/textInput_idle.svg' 
import NotePageImage from '../../../assets/img/notes.svg' 
import AutimatizationImage from '../../../assets/img/automatization_idle.svg'

type MenuProps = {
    activeTab: 'chat' | 'settings';
    onTabChange: (tab: 'chat' | 'settings') => void;
};

const Menu = ({ activeTab, onTabChange }: MenuProps) => {
    return (
        <div className="container menu">
            <AccountInfo id={12} onOpenSettings={() => onTabChange('settings')} />
            <div className="TasksContainer">
                <PageRouter 
                    activeTab={activeTab === 'chat'? true : false} 
                    onPress={() => onTabChange('chat')}
                    header='Чат'
                    description='Ваш ассистент'
                    image={ChatPageImage} 
                />
                <PageRouter 
                    activeTab={activeTab === 'chat'? true : false} 
                    onPress={() => onTabChange('chat')}
                    header='Заметки'
                    description='AI система ведения заметок' 
                    image={NotePageImage} 
                />
                <PageRouter
                    activeTab={activeTab === 'chat'? true : false} 
                    onPress={() => onTabChange('chat')}
                    header='Автоматизация'
                    description='Упрощение рутинных действий' 
                    image={AutimatizationImage} 
                />
                <PageRouter 
                    activeTab={activeTab === 'chat'? true : false} 
                    onPress={() => onTabChange('chat')}
                    header='Задачи'
                    description='Решение сложных задач в фоновом режиме' 
                    image={NotePageImage} 
                />
                <PageRouter 
                    activeTab={activeTab === 'chat'? true : false} 
                    onPress={() => onTabChange('chat')}
                    header='Заметки'
                    description='AI система ведения заметок' 
                    image={NotePageImage} 
                />
                <PageRouter
                    activeTab={activeTab === 'chat'? true : false} 
                    onPress={() => onTabChange('chat')}
                    header='Заметки'
                    description='AI система ведения заметок' 
                    image={NotePageImage} 
                />
            </div>
        </div>
    );
};

export default Menu;
