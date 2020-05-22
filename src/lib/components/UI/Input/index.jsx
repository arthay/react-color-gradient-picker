import React from 'react';
import './index.scss';

function Input({
    value, label, type = 'text', onChange, onFocus, onBlur, classes,
}) {
    return (
        <div className={`input-field ${classes}`}>
            <div className="input-container">
                <input
                    className={`${type}-input input`}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
            <div className="label">
                {label}
            </div>
        </div>
    );
}

export { Input };
