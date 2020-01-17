import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button} from 'semantic-ui-react';
import {useDispatch} from 'react-redux';

const useStyles = createUseStyles({
    combat: {},
});

export const Combat: FC = () => {
    useStyles();
    const [phase, setPhase] = useState<number>(0);
    const increasePhase = useCallback(() => {
        setPhase((phase + 1) % 4);
    }, [phase]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({type: 'SET PHASE', payload: phase});
    }, [dispatch, phase]);
    return (
        <Splash bg={bg} position={'88% center'}>
            <Button onClick={increasePhase}>Phase: {phase}</Button>
        </Splash>
    );
};
