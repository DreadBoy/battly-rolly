import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Splash} from './Splash';
import bg from '../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import {Button} from 'semantic-ui-react';
import {useTouches} from './touch';

const useStyles = createUseStyles({
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
});

export const FullScreen: FC = ({children}) => {
    const classes = useStyles();

    const div = useRef<HTMLDivElement | null>(null);
    const [full, setFull] = useState<boolean>(true);
    // const [full, setFull] = useState<boolean>(false);
    const go = useCallback(() => {
        document.documentElement.requestFullscreen()
            .catch(() => undefined)
            .finally(() => setFull(true));
    }, []);

    // If fullscreen is turned off, show Splash
    const onFullscreenChange = useCallback(() => {
        setFull(!!document.fullscreenElement);
    }, []);
    useEffect(() => {
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, [onFullscreenChange]);

    const {touches} = useTouches();
    useEffect(() => {
        if (touches === 3) {
            document.exitFullscreen()
                .catch(() => undefined)
                .finally(() => setFull(false))
        }
    });

    return full ? (
        <>{children}</>
    ) : (
        <Splash bg={bg}>
            <div className={classes.row} ref={div}>
                <Button onClick={() => setFull(true)}>Cancel</Button>
                <Button primary onClick={go}>Go fullscreen</Button>
            </div>
        </Splash>
    );
};
