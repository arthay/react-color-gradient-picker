import React, {
    useCallback, useEffect, useRef, useState,
} from 'react';

import { useMouseEvents } from 'lib/hooks';
import { getAlpha } from 'lib/helpers';

function Alpha({
    red, green, blue, alpha, updateRgb,
}) {
    const alphaMaskRef = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (alphaMaskRef.current) {
            setWidth(alphaMaskRef.current.clientWidth);
        }
    }, [setWidth]);

    const mouseDownHandler = useCallback(event => {
        const elementX = event.currentTarget.getBoundingClientRect().x;
        const startX = event.pageX;
        const positionX = startX - elementX;

        updateRgb({ alpha: getAlpha(positionX, width) }, 'onStartChange');
        return {
            startX,
            positionX,

        };
    }, [width, updateRgb]);

    const changeObjectPositions = useCallback((event, { startX, positionX }) => {
        const moveX = event.pageX - startX;
        positionX += moveX;

        const alpha = getAlpha(positionX, width);

        return {
            positions: {
                positionX,
                startX: event.pageX,
            },
            alpha,
        };
    }, [width]);

    const mouseMoveHandler = useCallback((event, { startX, positionX }) => {
        const { positions, alpha } = changeObjectPositions(event, { startX, positionX });

        updateRgb({ alpha }, 'onChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    const mouseUpHandler = useCallback((event, { startX, positionX }) => {
        const { positions, alpha } = changeObjectPositions(event, { startX, positionX });

        updateRgb({ alpha }, 'onEndChange');

        return positions;
    }, [changeObjectPositions, updateRgb]);

    const mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    const onMouseDown = event => {
        mouseEvents(event);
    };

    const style = {
        background: `linear-gradient(to right, rgba(0, 0, 0, 0), rgb(${red}, ${green}, ${blue}))`,
    };

    const offsetLeft = ((alpha * width) | 0) - 6;

    const pointerStyle = {
        left: `${offsetLeft}px`,
    };

    return (
        <div
            onMouseDown={onMouseDown}
            className="alpha"
        >
            <div className="gradient" style={style} />
            <div className="alpha-area">
                <div className="alpha-mask" ref={alphaMaskRef}>
                    <div className="picker-pointer" style={pointerStyle} />
                </div>
            </div>
        </div>
    );
}

export default Alpha;
