import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Button, Card, Form} from 'semantic-ui-react';
import {ActionLog, MissedAttackLog, Monster} from '../../common/encounter';
import {MonsterCard} from './MonsterCard';
import {useNumber} from '../../common/form-helpers';
import {Input} from '../../common/Input';
import {usePlayerId} from '../PlayerId';

type Props = {
    monster: Monster,
    focused?: boolean,
    onFinish: (result: ActionLog) => void,
};

const useStyles = createUseStyles({
    attackCard: {},
});

export const Attack: FC<Props> = ({monster, focused, onFinish}) => {
    useStyles();
    const attack = useNumber();
    const damage = useNumber();
    const playerId = usePlayerId();

    const [stage, setStage] = useState<number>(0);

    const attackRoll = useCallback(() => {
        // @ts-ignore
        if (attack.isValid && attack.number >= monster.AC)
            setStage(3);
        else {
            setStage(2);
            const log: MissedAttackLog = {
                attackerId: playerId ?? '',
                targetId: monster.id,
                attackRoll: attack.number ?? 0,
                attackName: 'manual',
            };
            onFinish(log);
        }
    }, [attack.isValid, attack.number, monster.AC, monster.id, onFinish, playerId]);

    const damageRoll = useCallback(() => {
        setStage(4);
        onFinish({
            attackerId: playerId ?? '',
            targetId: monster.id,
            attackRoll: attack.number ?? 0,
            attackName: 'manual',
            damage: damage.number ?? 0,
            damageType: 'acid',
        });
    }, [attack.number, damage.number, monster.id, onFinish, playerId]);

    return (
        <MonsterCard monster={monster}>
            <Card.Header>{monster.name}</Card.Header>
            {stage === 0 && (
                <Form onSubmit={attackRoll}>
                    <Form.Field>
                        <label>Attack roll</label>
                        <Input
                            fluid
                            onChange={attack.onChange}
                            value={attack.value}
                            type={'number'}
                            focused={focused}
                        />
                    </Form.Field>
                    <Button type={'submit'}>Attack!</Button>
                </Form>
            )}
            {stage === 2 && (
                <>
                    You missed it! 😢
                </>
            )}
            {stage === 3 && (
                <Form onSubmit={damageRoll}>
                    <Form.Field>
                        <label>Damage roll</label>
                        <Input
                            fluid
                            onChange={damage.onChange}
                            value={damage.value}
                            type={'number'}
                            focused={true}
                        />
                    </Form.Field>
                    <Button type={'submit'}>Do damage!</Button>
                </Form>
            )}
            {stage === 4 && (
                <>
                    You attacked it for {damage.number} damage!
                </>
            )}
        </MonsterCard>
    );
};
Attack.defaultProps = {
    focused: false,
};
