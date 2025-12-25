import React, { useState, useEffect, useRef } from "react";
import './Button.css';

const Button = ({ t, c, v }) => {
	// For regular buttons
	return (
		<button 
			className={`btn ${t}`}
			disabled={t === 'deactivated'}
		>
			<span>{c}</span>
		</button>
	);
};

export default Button;