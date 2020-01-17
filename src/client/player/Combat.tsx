import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Splash} from '../common/Splash';
import phase0 from '../../assets/MaoXBkH.jpg';
import phase1 from '../../assets/rXi8wK.jpg';
import phase2 from '../../assets/lcoznS.jpg';
import phase3 from '../../assets/157403.jpg';
import {useSelector} from 'react-redux';
import {State} from '../common/reducer';
import {Phase0} from './Phase0';

const useStyles = createUseStyles({
    combat: {},
});

const bgs = [phase0, phase1, phase2, phase3];
const poss = [23, 80, 66, 45];

export const Combat: FC = () => {
    useStyles();
    const phase = useSelector((state: State) => state.phase);
    switch (phase) {
        case 0:
            return (<Phase0/>);
    }
    return (
        <Splash bg={bgs[phase]} position={`${poss[phase]}% center`}>
            this is combat in phase {phase}
        </Splash>
    );
};
