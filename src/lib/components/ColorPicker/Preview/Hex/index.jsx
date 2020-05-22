import React, { useState, useEffect, useCallback } from 'react';

import { rgbToHex, hexToRgb } from 'lib/helpers';
import { Input } from 'lib/components/UI';

function Hex({
    red, green, blue, updateRgb,
}) {
    const [hexValue, setHexValue] = useState('');
    const [progress, setProgress] = useState(false);

    useEffect(() => {
        if (progress) {
            return;
        }
        const hex = rgbToHex(red, green, blue);

        setHexValue(hex);
    }, [red, green, blue, progress]);

    const changeHex = useCallback(event => {
        setHexValue(event.target.value);
        const color = hexToRgb(event.target.value);

        if (color) {
            updateRgb(color);
        }
    }, [setHexValue, updateRgb]);

    return (
        <Input
            value={hexValue}
            label="hex"
            onChange={changeHex}
            onFocus={() => setProgress(true)}
            onBlur={() => setProgress(false)}
            classes="hex"
        />
    );
}

export default Hex;
