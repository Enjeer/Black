import React from "react";
import './Button.css';

// list of available button types:
//  - separator     : thin line in separator blocks, supposedly used to detect drag for block resize
//  - primary       : solid color, no border
//  - secondary     : no bg, solid border same color with font
//  - deactivated   : not active, no hover, dimmed colors

const Button = ({t, c}) => {

    return(
        <button className={`${t}`}>
                <span>{c}</span>
        </button>
    )
}

export default Button