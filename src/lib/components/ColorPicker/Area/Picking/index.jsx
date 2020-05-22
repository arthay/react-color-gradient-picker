import React, {
    useEffect, useCallback, useRef, useState,
} from 'react';

import { changePicker, getRgbByHue } from 'lib/helpers';
import { useMouseEvents } from 'lib/hooks';

function Picking({
    red,
    green,
    blue,
    hue,
    saturation,
    value,
    updateRgb,
}) {
    const pickingAreaRef = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (pickingAreaRef.current) {
            setWidth(pickingAreaRef.current.clientWidth);
            setHeight(pickingAreaRef.current.clientHeight);
        }
    }, [pickingAreaRef, setWidth, setHeight]);

    useEffect(() => {
        const { red, green, blue } = getRgbByHue(hue);

        pickingAreaRef.current.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }, [hue]);

    // generate offsetLeft by saturation
    const offsetLeft = ((saturation * width / 100) | 0) - 6;

    // generate offsetTop by value
    const offsetTop = (height - (value * height / 100) | 0) - 6;

    const getPointerStyle = {
        backgroundColor: `rgb(${red}, ${green}, ${blue})`,
        left: `${offsetLeft}px`,
        top: `${offsetTop}px`,
    };

    const mouseDownHandler = useCallback(event => {
        const elementX = event.currentTarget.getBoundingClientRect().x;
        const elementY = event.currentTarget.getBoundingClientRect().y;
        const startX = event.pageX;
        const startY = event.pageY;
        const positionX = startX - elementX;
        const positionY = startY - elementY;

        const color = changePicker(positionX, positionY, height, width, hue);

        updateRgb(color, 'onStartChange');
        return {
            startX,
            startY,
            positionX,
            positionY,

        };
    }, [height, width, hue, updateRgb]);

    const changeObjectPositions = useCallback((event, {
        startX, startY, positionX, positionY,
    }) => {
        const moveX = event.pageX - startX;
        const moveY = event.pageY - startY;
        positionX += moveX;
        positionY += moveY;

        const color = changePicker(positionX, positionY, height, width, hue);

        return {
            positions: {
                positionX,
                positionY,
                startX: event.pageX,
                startY: event.pageY,
            },
            color,
        };
    }, [height, hue, width]);

    const mouseMoveHandler = useCallback((event, {
        startX, startY, positionX, positionY,
    }) => {
        const { positions, color } = changeObjectPositions(event, {
            startX, startY, positionX, positionY,
        });

        updateRgb(color, 'onChange');

        return positions;
    }, [updateRgb, changeObjectPositions]);

    const mouseUpHandler = useCallback((event, {
        startX, startY, positionX, positionY,
    }) => {
        const { positions, color } = changeObjectPositions(event, {
            startX, startY, positionX, positionY,
        });

        updateRgb(color, 'onEndChange');

        return positions;
    }, [updateRgb, changeObjectPositions]);

    const mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    const onMouseDown = event => {
        mouseEvents(event);
    };

    return (
        <div
            className="picking-area"
            ref={pickingAreaRef}
            onMouseDown={onMouseDown}
        >
            <div className="picking-area-overlay1">
                <div className="picking-area-overlay2">
                    <div className="picker-pointer" style={getPointerStyle} />
                </div>
            </div>
        </div>
    );
}

export default Picking;
