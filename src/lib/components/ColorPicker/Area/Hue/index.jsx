import React, {
    useCallback, useEffect, useRef, useState,
} from 'react';

import { useMouseEvents } from 'lib/hooks';
import { getHue } from 'lib/helpers';

function Hue({
    hue, saturation, value, updateRgb,
}) {
    const hueRef = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (hueRef.current) {
            setWidth(hueRef.current.clientWidth);
        }
    }, [setWidth]);

    const mouseDownHandler = useCallback(event => {
        const elementX = event.currentTarget.getBoundingClientRect().x;
        const startX = event.pageX;
        const positionX = startX - elementX;

        const color = getHue(positionX, width, saturation, value);

        updateRgb(color, 'onStartChange');

        return {
            startX,
            positionX,
        };
    }, [width, saturation, value, updateRgb]);

    const changeObjectPositions = useCallback((event, { startX, positionX }) => {
        const moveX = event.pageX - startX;
        positionX += moveX;

        // update value and saturation
        const offsetX = positionX > width ? width : positionX <= 0 ? 0 : positionX;
        const color = getHue(offsetX, width, saturation, value);

        return {
            positions: {
                positionX,
                startX: event.pageX,
            },
            color,
        };
    }, [width, saturation, value]);

    const mouseMoveHandler = useCallback((event, { startX, positionX }) => {
        const { positions, color } = changeObjectPositions(event, { startX, positionX });

        updateRgb(color, 'onChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    const mouseUpHandler = useCallback((event, { startX, positionX }) => {
        const { positions, color } = changeObjectPositions(event, { startX, positionX });

        updateRgb(color, 'onEndChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    const mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    const onMouseDown = event => {
        mouseEvents(event);
    };

    const offsetLeft = ((hue * width / 360) | 0) - 6;

    const pointerStyle = {
        left: `${offsetLeft}px`,
    };

    return (
        <div
            className="hue"
            onMouseDown={onMouseDown}
        >
            <div className="hue-area" ref={hueRef}>
                <div
                    className="picker-pointer"
                    style={pointerStyle}
                />
            </div>
        </div>
    );
}

export default Hue;
