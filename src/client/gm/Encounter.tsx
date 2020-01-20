import {createUseStyles} from 'react-jss';
import React, {FC, useCallback} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button} from 'semantic-ui-react';
import {useDispatch, useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {Creator} from './Creator';

const useStyles = createUseStyles({
    combat: {},
});

export const Encounter: FC = () => {
    useStyles();
    const encounter = useSelector((state: State) => state.encounter);
    const dispatch = useDispatch();
    const phase = encounter?.phase || 0;
    const increasePhase = useCallback(() => {
        dispatch({type: 'SET PHASE', payload: phase + 1});
    }, [dispatch, phase]);

    if (!encounter)
        return <Creator/>;
    return (
        <Splash bg={bg} position={'88% center'}>
            <Button onClick={increasePhase}>Phase: {phase}</Button>
        </Splash>
    );
};
