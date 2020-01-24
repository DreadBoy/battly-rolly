import {createUseStyles} from 'react-jss';
import React, {FC} from 'react';
import {Card} from 'semantic-ui-react';
import {Action as DnDAction, isAttack, Monster} from '../../common/encounter';
import {Action} from './Action';

type Props = {
    monster: Monster,
    onAttack: (playerId: string, action: DnDAction) => void,
};

const useStyles = createUseStyles({
    monsterCard: {
        cursor: 'pointer',
    },
});

export const MonsterCard: FC<Props> = ({monster, onAttack}) => {
    const classes = useStyles();

    return (
        <div className={classes.monsterCard}>
            <Card>
                <Card.Content>
                    <Card.Header>{monster.name}</Card.Header>
                    <Card.Meta>
                        <span>HP: {monster.currentHP}</span>
                    </Card.Meta>
                </Card.Content>
                {monster.actions.map(action => isAttack(action) ? (
                    <Action key={Math.random()} action={action} onAttack={onAttack}/>
                ) : null)}
            </Card>
        </div>
    );
};
