import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Splash} from './Splash';
import bg from '../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import {Button} from 'semantic-ui-react';

const useStyles = createUseStyles({
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
});

export const FullScreen: FC = ({children}) => {
    const classes = useStyles();

    const div = useRef<HTMLDivElement | null>(null);
    const [full, setFull] = useState<boolean>(false);
    const setTrue = useCallback(() => setFull(true), []);
    const go = useCallback(() => {
        if (document.fullscreenElement) {
            setFull(true);
            return;
        }
        document.documentElement.requestFullscreen()
            .then(setTrue)
            .catch(setTrue);
    }, [setTrue]);
    useEffect(() => {
        if (document.fullscreenElement)
            setFull(true);
    }, []);

    return full ? (
        <>{children}</>
    ) : (
        <Splash bg={bg}>
            <div className={classes.row} ref={div}>
                <Button onClick={setTrue}>Cancel</Button>
                <Button primary onClick={go}>Go fullscreen</Button>
            </div>
        </Splash>
    );
};
