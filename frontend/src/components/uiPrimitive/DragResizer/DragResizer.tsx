import React, { useState, useEffect, useRef } from "react";
import "./DragResizer.css";

type DragInfo = {
  gridContainer: HTMLElement;
  startX: number;
  containerWidth: number;
  startLeftPercent: number;
  separatorWidthPx: number;
};

	const DragResizer = () => {
		const separatorRef = useRef<HTMLDivElement | null>(null);
		const [isDragging, setIsDragging] = useState(false);
		const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);

		const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault();

			const gridContainer = e.currentTarget.closest<HTMLElement>(
			"[data-grid-container]"
		);

		if (!gridContainer) return;

		const rect = gridContainer.getBoundingClientRect();
		const containerWidth = rect.width;

		const gridStyle = window.getComputedStyle(gridContainer);
		const columns = gridStyle.gridTemplateColumns.split(" ");

		const leftPx = parseFloat(columns[0]);
		const separatorPx = parseFloat(columns[1]);

		const startLeftPercent = (leftPx / containerWidth) * 100;

		setDragInfo({
		gridContainer,
		startX: e.clientX,
		containerWidth,
		startLeftPercent,
		separatorWidthPx: separatorPx,
		});

		setIsDragging(true);

		document.body.style.userSelect = "none";
		document.body.style.cursor = "col-resize";
	};

	useEffect(() => {
		if (!isDragging || !dragInfo) return;

		const handleMouseMove = (e: MouseEvent) => {
		const deltaX = e.clientX - dragInfo.startX;
		const deltaPercent = (deltaX / dragInfo.containerWidth) * 100;

		let newLeftPercent = dragInfo.startLeftPercent + deltaPercent;

		const MIN_PERCENT = (60/dragInfo.containerWidth) * 100;
		const MAX_PERCENT = 40;

		newLeftPercent = Math.max(
			MIN_PERCENT,
			Math.min(newLeftPercent, MAX_PERCENT)
		);

		const rightPercent = 100 - newLeftPercent;

		dragInfo.gridContainer.style.gridTemplateColumns = `
			${newLeftPercent}% 
			${dragInfo.separatorWidthPx}px 
			${rightPercent}%
		`;

		if (separatorRef.current) {
			separatorRef.current.setAttribute(
			"data-width",
			`${Math.round(newLeftPercent)}%`
			);
		}
		};

		const handleMouseUp = () => {
		setIsDragging(false);
		setDragInfo(null);

		document.body.style.userSelect = "";
		document.body.style.cursor = "";

		if (separatorRef.current) {
			separatorRef.current.removeAttribute("data-width");
		}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragInfo]);

	return (
		<div
			ref={separatorRef}
			className={`separator ${isDragging ? "dragging" : ""}`}
			onMouseDown={handleMouseDown}
		>
		<div className="separator-handle" />
		</div>
	);
};

export default DragResizer;
