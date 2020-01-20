import {createUseStyles} from 'react-jss';
import React, {FC, useCallback} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button} from 'semantic-ui-react';
import {useDispatch, useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {Creator} from './Creator';
import {Message} from '../common/Message';
import {phases} from '../common/encounter';

const useStyles = createUseStyles({
    combat: {},
});

export const Encounter: FC = () => {
    useStyles();
    const encounter = useSelector((state: State) => state.encounter);
    const dispatch = useDispatch();
    const phase = encounter?.phase || 0;
    const increasePhase = useCallback(() => {
        dispatch({type: 'SET PHASE', payload: (phase + 1) % 4});
    }, [dispatch, phase]);

    // TODO remove this effect
    // useEffect(() => {
    //     if(!encounter)
    //         dispatch({
    //             type: 'START ENCOUNTER',
    //             payload: {
    //                 monsters: JSON.parse('[{"name":"Aboleth","HP":10,"abilitySet":{"strength":21,"dexterity":9,"constitution":15,"intelligence":18,"wisdom":15,"charisma":18},"savingThrows":{"strength":0,"dexterity":0,"constitution":6,"intelligence":8,"wisdom":6,"charisma":0},"actions":[{"type":"attack","modifier":9,"damage":{"rolls":[[2,6,5]],"damageType":"bludgeoning"},"effect":{"DC":14,"ability":"constitution","status":"stunned"}}]},{"name":"Aboleth","HP":10,"abilitySet":{"strength":21,"dexterity":9,"constitution":15,"intelligence":18,"wisdom":15,"charisma":18},"savingThrows":{"strength":0,"dexterity":0,"constitution":6,"intelligence":8,"wisdom":6,"charisma":0},"actions":[{"type":"attack","modifier":9,"damage":{"rolls":[[2,6,5]],"damageType":"bludgeoning"},"effect":{"DC":14,"ability":"constitution","status":"stunned"}}]},{"name":"Aboleth","HP":10,"abilitySet":{"strength":21,"dexterity":9,"constitution":15,"intelligence":18,"wisdom":15,"charisma":18},"savingThrows":{"strength":0,"dexterity":0,"constitution":6,"intelligence":8,"wisdom":6,"charisma":0},"actions":[{"type":"attack","modifier":9,"damage":{"rolls":[[2,6,5]],"damageType":"bludgeoning"},"effect":{"DC":14,"ability":"constitution","status":"stunned"}}]}]'),
    //                 phase: 0,
    //             },
    //         });
    // }, [dispatch, encounter]);

    if (!encounter)
        return <Creator/>;
    return (
        <Splash bg={bg} position={'88% center'} centered>
            <Message>Encounter in {phases[phase]} phase</Message>
            <Button onClick={increasePhase}>Next phase</Button>
        </Splash>
    );
};
