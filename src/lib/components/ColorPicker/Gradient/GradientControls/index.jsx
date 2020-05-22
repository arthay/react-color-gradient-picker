import React, { useCallback, useState } from 'react';

import { calculateDegree } from 'lib/helpers';
import { useMouseEvents } from 'lib/hooks';

function GradientControls({ type, degree, changeGradientControl }) {
    const [disableClick, setDisableClick] = useState(false);

    const onClickGradientDegree = useCallback(() => {
        if (disableClick) {
            setDisableClick(false);
            return;
        }

        let gradientDegree = degree + 45;

        if (gradientDegree >= 360) {
            gradientDegree = 0;
        }

        changeGradientControl({ degree: gradientDegree });
    }, [disableClick, degree, changeGradientControl]);

    const mouseDownHandler = useCallback(event => {
        const pointer = event.target;
        const pointerBox = pointer.getBoundingClientRect();
        const centerY = pointerBox.top + parseInt(8 - window.pageYOffset, 10);
        const centerX = pointerBox.left + parseInt(8 - window.pageXOffset, 10);

        return {
            centerY,
            centerX,

        };
    }, []);

    const mouseMoveHandler = useCallback((event, { centerX, centerY }) => {
        setDisableClick(true);

        const newDegree = calculateDegree(event.clientX, event.clientY, centerX, centerY);

        changeGradientControl({ degree: newDegree });

        return { centerX, centerY };
    }, [changeGradientControl]);

    const mouseUpHandler = event => {
        const targetClasses = event.target.classList;

        if (targetClasses.contains('gradient-degrees') || targetClasses.contains('icon-rotate')) {
            return;
        }

        setDisableClick(false);
    };

    const mouseEvents = useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler);

    const onMouseDown = event => {
        console.log(1);
        mouseEvents(event);
    };

    const degreesStyle = {
        transform: `rotate(${degree}deg)`,
    };

    return (
        <div className="gradient-controls">
            <div className="gradient-type">
                <div
                    className={`gradient-type-item liner-gradient ${type === 'linear' ? 'active' : ''}`}
                    onClick={() => changeGradientControl({ type: 'linear' })}
                />
                <div
                    className={`gradient-type-item radial-gradient ${type === 'radial' ? 'active' : ''}`}
                    onClick={() => changeGradientControl({ type: 'radial' })}
                />
            </div>
            {
                type === 'linear'
                && (
                    <div className="gradient-degrees-options">
                        <div
                            className="gradient-degrees"
                            onMouseDown={onMouseDown}
                            onClick={onClickGradientDegree}
                        >
                            <div className="gradient-degree-center" style={degreesStyle}>
                                <div className="gradient-degree-pointer" />
                            </div>
                        </div>
                        <div className="gradient-degree-value">
                            <p>
                                {parseInt(degree, 10)}
                                &#176;
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default GradientControls;
