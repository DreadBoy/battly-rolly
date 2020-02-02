import React, {FC} from 'react';
import {Card, Icon} from 'semantic-ui-react';
import {Monster} from '../../common/encounter';
import {createUseStyles} from 'react-jss';
import classNames from 'classnames';

type Props = {
    monster: Monster,
    selected?: boolean,
    onClick?: () => void,
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

export const MonsterCard: FC<Props> = ({monster, selected, onClick, children}) => {
    const classes = useStyles();
    const bloody = monster.currentHP <= monster.maxHP / 2;

    return (
        <Card
            fluid
            className={classNames(classes.card, {[classes.selected]: selected})}
            color={bloody ? 'red' : undefined}
            onClick={onClick}
        >
            <Card.Content>
                <Icon name={'circle'} className={classNames('ui right floated', classes.icon)} size={'big'}
                      color={'orange'}/>
                {children}
            </Card.Content>
        </Card>
    );
};
MonsterCard.defaultProps = {
    selected: false,
};
