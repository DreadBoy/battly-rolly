import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Splash} from '../common/Splash';
import noCombat from '../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import phase0 from '../../assets/MaoXBkH.jpg';
import phase1 from '../../assets/rXi8wK.jpg';
import phase2 from '../../assets/lcoznS.jpg';
import phase3 from '../../assets/157403.jpg';
import {useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {Phase0} from './Phase0';
import {Phase1} from './Phase1';
import {Message} from '../common/Message';

const useStyles = createUseStyles({
    combat: {},
});

const bgs = [phase0, phase1, phase2, phase3];
const poss = [23, 80, 66, 45];

export const Encounter: FC = () => {
    useStyles();
    const encounter = useSelector((state: State) => state.encounter);
    if (!encounter)
        return (
            <Splash bg={noCombat}>
                <Message>No combat going on <br/>😴🥱</Message>
            </Splash>
        );

    if (encounter.phase % 2 === 0)
        return <Phase0 phase={encounter.phase === 0 ? 'Fast' : 'Slow'}/>;
    if (encounter.phase % 2 === 1)
        return <Phase1 phase={encounter.phase === 1 ? 'Fast' : 'Slow'}/>;

    return (
        <Splash bg={bgs[encounter.phase]} position={`${poss[encounter.phase]}% center`}>
            this is combat in phase {encounter.phase}
        </Splash>
    );
};
