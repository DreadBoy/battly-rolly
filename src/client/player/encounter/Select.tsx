import React, {FC} from 'react';
import {Card, Checkbox} from 'semantic-ui-react';
import {Monster} from '../../common/encounter';
import {createUseStyles} from 'react-jss';
import {MonsterCard} from './MonsterCard';

type Props = {
    monster: Monster,
    selected?: boolean,
    onClick: () => void,
};

const useStyles = createUseStyles({
    card: {
        'a.ui.card:hover&': {
            transform: 'translateY(0)',
        },
    },
    selected: {
        'a.ui.card&': {
            boxShadow: '0 0 0 1px #2185d0, 0 1px 3px 0 #d4d4d5',
        },
        'a.ui.red.card&': {
            boxShadow: '0 0 0 1px #db2828, 0 2px 0 0 #db2828, 0 1px 3px 0 #d4d4d5',
        },
    },
    icon: {
        'i.icon&': {
            width: '1em',
            margin: 0,
        },
    },
    checkbox: {
        '.ui.checkbox&': {
            display: 'none',
        },
    },
});

export const Select: FC<Props> = ({monster, selected, onClick}) => {
    const classes = useStyles();
    return (
        <MonsterCard monster={monster} onClick={onClick} selected={selected}>
            <Card.Header>{monster.name}</Card.Header>
            <Checkbox className={classes.checkbox} checked={selected}/>
        </MonsterCard>
    );
};
Select.defaultProps = {
    selected: false,
};
