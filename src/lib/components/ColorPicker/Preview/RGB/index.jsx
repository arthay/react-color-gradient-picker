import React, { useCallback } from 'react';

import { rgbToHsv } from 'lib/helpers';

import RGBItem from './item';

function RGB({
    red, green, blue, alpha, updateRgb,
}) {
    const changeValue = useCallback((field, value) => {
        if (field === 'alpha') {
            updateRgb({ alpha: value / 100 });

            return;
        }

        const color = rgbToHsv({
            red, green, blue, [field]: value,
        });

        updateRgb({ ...color, [field]: value });
    }, [red, green, blue, updateRgb]);

    return (
        <>
            <RGBItem
                value={red}
                type="number"
                label="R"
                onChange={value => changeValue('red', value)}
            />

            <RGBItem
                value={green}
                type="number"
                label="G"
                onChange={value => changeValue('green', value)}
            />

            <RGBItem
                value={blue}
                type="number"
                label="B"
                onChange={value => changeValue('blue', value)}
            />

            <RGBItem
                value={parseInt(alpha * 100, 10)}
                type="number"
                label="alpha"
                onChange={value => changeValue('alpha', value)}
            />
        </>
    );
}

export default RGB;
