import React, { useCallback, useEffect, useState } from 'react';

import { useMount } from 'lib/hooks';
import { rgbToHsv, getRightValue, generateGradientStyle } from 'lib/helpers';

import Area from '../Area';
import Preview from '../Preview';
import GradientControls from './GradientControls';

function Gradient({
    points, type, degree, onChange, onStartChange, onEndChange,
}) {
    const [activePointIndex, setActivePointIndex] = useState(0);
    const [gradientPoints, setGradientPoints] = useState(points);
    const [activePoint, setActivePoint] = useState(gradientPoints[0]);
    const [colorRed, setColorRed] = useState(activePoint.red);
    const [colorGreen, setColorGreen] = useState(activePoint.green);
    const [colorBlue, setColorBlue] = useState(activePoint.blue);
    const [colorAlpha, setColorAlpha] = useState(activePoint.alpha);
    const [colorHue, setColorHue] = useState(0);
    const [colorSaturation, setColorSaturation] = useState(100);
    const [colorValue, setColorValue] = useState(100);
    const [gradientType, setGradientType] = useState(type);
    const [gradientDegree, setGradientDegree] = useState(degree);

    const actions = {
        onChange,
        onStartChange,
        onEndChange,
    };

    useMount(() => {
        const { hue, saturation, value } = rgbToHsv({ red: colorRed, green: colorGreen, blue: colorBlue });

        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
    });

    const keyUpHandler = useCallback(event => {
        if ((event.keyCode === 46 || event.keyCode === 8) && gradientPoints.length > 2) {
            const localGradientPoints = gradientPoints.slice();
            localGradientPoints.splice(activePointIndex, 1);

            setGradientPoints(localGradientPoints);

            if (activePointIndex > 0) {
                setActivePointIndex(activePointIndex - 1);
            }

            onChange && onChange({
                points: localGradientPoints,
                type: gradientType,
                degree: gradientDegree,
                style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
            });
        }
    }, [gradientPoints, activePointIndex, gradientType, gradientDegree, onChange]);

    useEffect(() => {
        document.addEventListener('keyup', keyUpHandler);

        return () => {
            document.removeEventListener('keyup', keyUpHandler);
        };
    });

    const changeGradientControl = useCallback(({ type, degree }, actionName = 'onChange') => {
        type = getRightValue(type, gradientType);
        degree = getRightValue(degree, gradientDegree);

        setGradientType(type);
        setGradientDegree(degree);

        const action = actions[actionName];

        action && action({
            points: gradientPoints,
            type,
            degree,
            style: generateGradientStyle(gradientPoints, type, degree),
        });
    }, [actions, gradientPoints, gradientDegree, gradientType]);

    const changeActivePointIndex = useCallback(index => {
        setActivePointIndex(index);

        const localGradientPoint = gradientPoints[index];
        const {
            red, green, blue, alpha,
        } = localGradientPoint;
        setActivePoint(localGradientPoint);

        setColorRed(red);
        setColorGreen(green);
        setColorBlue(blue);
        setColorAlpha(alpha);

        const { hue, saturation, value } = rgbToHsv({ red, green, blue });

        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
    }, [gradientPoints]);

    const updateColor = useCallback(({
        red, green, blue, alpha, hue, saturation, value,
    }, actionName = 'onChange') => {
        red = getRightValue(red, colorRed);
        green = getRightValue(green, colorGreen);
        blue = getRightValue(blue, colorBlue);
        alpha = getRightValue(alpha, colorAlpha);
        hue = getRightValue(hue, colorHue);
        saturation = getRightValue(saturation, colorSaturation);
        value = getRightValue(value, colorValue);

        const localGradientPoints = gradientPoints.slice();

        localGradientPoints[activePointIndex] = {
            ...localGradientPoints[activePointIndex],
            red,
            green,
            blue,
            alpha,
        };

        setColorRed(red);
        setColorGreen(green);
        setColorBlue(blue);
        setColorAlpha(alpha);
        setColorHue(hue);
        setColorSaturation(saturation);
        setColorValue(value);
        setGradientPoints(localGradientPoints);

        const action = actions[actionName];

        action && action({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [
        colorRed, colorGreen, colorBlue, colorAlpha,
        colorHue, colorSaturation, colorValue,
        activePointIndex, gradientPoints, actions, gradientType, gradientDegree,
    ]);

    const updateGradientLeft = useCallback((left, index, actionName = 'onChange') => {
        const localGradientPoints = gradientPoints.slice();
        localGradientPoints[index].left = left;

        setGradientPoints(localGradientPoints);

        const action = actions[actionName];

        action && action({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [actions, gradientPoints, gradientDegree, gradientType]);

    const addPoint = useCallback(left => {
        const localGradientPoints = gradientPoints.slice();

        localGradientPoints.push({
            ...localGradientPoints[activePointIndex],
            left,
        });

        setGradientPoints(localGradientPoints);
        setActivePointIndex(localGradientPoints.length - 1);

        onChange && onChange({
            points: localGradientPoints,
            type: gradientType,
            degree: gradientDegree,
            style: generateGradientStyle(localGradientPoints, gradientType, gradientDegree),
        });
    }, [onChange, gradientPoints, activePointIndex, gradientType, gradientDegree]);

    return (
        <>
            <GradientControls
                type={gradientType}
                degree={gradientDegree}
                changeGradientControl={changeGradientControl}
            />
            <Area
                red={colorRed}
                green={colorGreen}
                blue={colorBlue}
                alpha={colorAlpha}
                hue={colorHue}
                saturation={colorSaturation}
                value={colorValue}
                updateRgb={updateColor}
                isGradient
                type={gradientType}
                degree={gradientDegree}
                points={gradientPoints}
                activePointIndex={activePointIndex}
                changeGradientControl={changeGradientControl}
                changeActivePointIndex={changeActivePointIndex}
                updateGradientLeft={updateGradientLeft}
                addPoint={addPoint}
            />
            <Preview
                red={colorRed}
                green={colorGreen}
                blue={colorBlue}
                alpha={colorAlpha}
                updateRgb={updateColor}
            />
        </>
    );
}

export default Gradient;
