import React, { useEffect, useRef, useState } from 'react' 
import './pageRouter.css' 

type ChatPageProps= {
    activeTab: boolean;
    onPress: () => void;
    header: string;
    description: string;
    image: any
};

const PageRouter = ({activeTab, onPress, header, description, image}: ChatPageProps) => { 

    return ( 
    <div className="container pageButton"> 
        <div onClick={onPress} className="pageContainer"> 
            <img src={image} alt="" />
            <div className="page_info"> 
                <span className="header">{header}</span>
                <span className="description">{description}</span> 
            </div> 
        </div> 
    </div> 
); }; 

export default PageRouter