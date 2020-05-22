import React, { useCallback, useEffect, useState } from 'react';

import { Input } from 'lib/components/UI';

export default function RGBItem({
    value, type, label, onChange,
}) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        if (value !== +inputValue && inputValue !== '') {
            setInputValue(value);
        }
    }, [inputValue, value]);

    const onChangeHandler = useCallback(event => {
        const value = +event.target.value;

        if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255) {
            return;
        }
        setInputValue(event.target.value);

        onChange(value);
    }, [onChange]);

    const onBlur = useCallback(() => {
        !inputValue && inputValue !== 0 && setInputValue(value);
    }, [inputValue, setInputValue, value]);

    return (
        <Input
            value={inputValue}
            type={type}
            label={label}
            onChange={onChangeHandler}
            onBlur={onBlur}
            classes="rgb"
        />
    );
}
