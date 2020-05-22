import React from 'react';

import { ColorPicker } from './lib';

function App() {
    const onChange = (attrs, name) => {
        console.log(attrs, name);
    };

    return (
        <div style={{ display: 'flex', textAlign: 'center' }}>
            <div style={{ marginRight: '50px' }}>
                <p>Solid</p>
                <ColorPicker
                    onStartChange={color => onChange(color, 'start')}
                    onChange={color => onChange(color, 'change')}
                    onEndChange={color => onChange(color, 'end')}
                />
            </div>
            <div>
                <p>Gradient</p>
                <ColorPicker
                    onStartChange={color => onChange(color, 'start')}
                    onChange={color => onChange(color, 'change')}
                    onEndChange={color => onChange(color, 'end')}
                    isGradient
                />
            </div>
        </div>
    );
}

export default App;
