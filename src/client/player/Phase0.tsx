import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/MaoXBkH.jpg';
import {Header} from 'semantic-ui-react';
import {SelectMonsters} from './encounter/SelectMonsters';

const useStyles = createUseStyles({
    header: {
        textAlign: 'center',
    },
});

export const Phase0: FC = () => {
    const classes = useStyles();
    return (
        <Splash bg={bg} position={`23% center`}>
            <Header className={classes.header} as={'h1'}>
                Fast round
                <Header.Subheader>
                    You are attacking!
                </Header.Subheader>
                <Header.Subheader>
                    Select target(s):
                </Header.Subheader>
            </Header>
            <SelectMonsters/>
        </Splash>
    );
};