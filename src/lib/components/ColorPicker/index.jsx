import React from 'react';

import Solid from './Solid';
import Gradient from './Gradient';

function ColorPicker({
    color,
    isGradient,
    gradient,
    onStartChange,
    onChange,
    onEndChange,
}) {
    return (
        <div className="ui-color-picker">
            {
                isGradient
                    ? (
                        <Gradient
                            points={gradient.points}
                            updateColor={onChange}
                            type={gradient.type}
                            degree={gradient.degree}
                            onChange={onChange}
                            onStartChange={onStartChange}
                            onEndChange={onEndChange}
                        />
                    )
                    : (
                        <Solid
                            red={color.red}
                            green={color.green}
                            blue={color.blue}
                            alpha={color.alpha}
                            onChange={onChange}
                            onStartChange={onStartChange}
                            onEndChange={onEndChange}
                        />
                    )
            }
        </div>
    );
}

ColorPicker.defaultProps = {
    isGradient: false,
    onChange: () => {},
    color: {
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
    },
    gradient: {
        points: [
            {
                left: 0,
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1,
            },
            {
                left: 100,
                red: 255,
                green: 0,
                blue: 0,
                alpha: 1,
            },
        ],
        degree: 0,
        type: 'linear',
    },
};

export default ColorPicker;
