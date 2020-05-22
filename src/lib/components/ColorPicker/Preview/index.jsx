import React from 'react';

import Hex from './Hex';
import RGB from './RGB';

function Preview({
    red, green, blue, alpha, updateRgb,
}) {
    return (
        <div className="color-preview-area">
            <div className="input-group">
                <Hex
                    red={red}
                    green={green}
                    blue={blue}
                    updateRgb={updateRgb}
                />

                <RGB
                    red={red}
                    green={green}
                    blue={blue}
                    alpha={alpha}
                    updateRgb={updateRgb}
                />
            </div>
        </div>
    );
}

export default Preview;
