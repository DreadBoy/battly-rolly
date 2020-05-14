import React, {useCallback, useState} from 'react';
import {Icon, Progress, SemanticCOLORS} from 'semantic-ui-react';
import {PasswordMeter} from 'password-meter';

export const strengthToColour: { [strength: string]: SemanticCOLORS } = {
    veryWeak: 'red',
    weak: 'red',
    medium: 'orange',
    strong: 'yellow',
    veryStrong: 'olive',
    perfect: 'green',
}

export function usePasswordInput(value: string) {
    const [passVisible, setPassVisible] = useState<boolean>(false);
    const togglePassVisible = useCallback(() => {
        setPassVisible(!passVisible)
    }, [passVisible]);

    const passwordStrength = new PasswordMeter().getResult(value);

    return {
        togglePassVisible,
        passVisible,
        type: passVisible ? 'text' : 'password',
        icon: (
            <Icon
                link
                name={passVisible ? 'eye slash' : 'eye'}
                onClick={togglePassVisible}
            />
        ),
        meter: passwordStrength.status !== 'Empty' && (
            <Progress
                percent={passwordStrength.percent}
                attached={'bottom'}
                color={strengthToColour[passwordStrength.status]}/>
        ),
    }
}
