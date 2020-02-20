import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Button, Card, Dropdown, Form, Input} from 'semantic-ui-react';
import {Attack as AttackModel, AttackLog, DamageType, damageTypes, Monster} from '../../common/encounter';
import {MonsterCard} from './MonsterCard';
import {useNumber, useText} from '../../common/form-helpers';
import {usePlayerId} from '../PlayerId';

type Props = {
    monster: Monster,
    onFinish: (result: AttackLog[]) => void,
};

const useStyles = createUseStyles({
    attackCard: {},
});

export const Attack: FC<Props> = ({monster, onFinish}) => {
    useStyles();
    const hitRoll = useNumber();
    const damageRoll = useNumber();
    const damageType = useText('bludgeoning');
    const playerId = usePlayerId();

    const [stage, setStage] = useState<number>(0);

    const createAttack = useCallback((): AttackModel => ({
        type: 'attack',
        name: 'manual',
        modifier: 0,
        damage: {damageType: damageType.value as DamageType, rolls: [[0, 0, 0]]},
    }), [damageType.value]);

    const stage0 = useCallback(() => {
        // @ts-ignore
        if (hitRoll.isValid && hitRoll.number >= monster.AC)
            setStage(3);
        else {
            setStage(2);
            onFinish([{
                attackerId: playerId ?? '',
                targetId: monster.id,
                attack: createAttack(),
                hitRoll: hitRoll.number as number,
                damageRoll: 0,
                success: false,
            }]);
        }
    }, [createAttack, hitRoll.isValid, hitRoll.number, monster.AC, monster.id, onFinish, playerId]);

    const stage3 = useCallback(() => {
        setStage(4);
        onFinish([{
            attackerId: playerId ?? '',
            targetId: monster.id,
            attack: createAttack(),
            hitRoll: hitRoll.number as number,
            damageRoll: damageRoll.number as number,
            success: true,
        }]);
    }, [onFinish, playerId, monster.id, createAttack, hitRoll.number, damageRoll.number]);

    return (
        <MonsterCard monster={monster}>
            <Card.Content>
                {stage === 0 && (
                    <Form onSubmit={stage0}>
                        <Form.Field error={!hitRoll.isValid}>
                            <label>Attack roll</label>
                            <Input
                                fluid
                                onChange={hitRoll.onChange}
                                value={hitRoll.value}
                                type={'number'}
                                autoFocus
                            />
                        </Form.Field>
                        <Button type={'submit'} disabled={!hitRoll.isValid}>Attack!</Button>
                    </Form>
                )}
                {stage === 2 && (
                    <>
                        You missed it! 😢
                    </>
                )}
                {stage === 3 && (
                    <Form onSubmit={stage3}>
                        <Form.Field error={!damageRoll.value}>
                            <label>Damage roll</label>
                            <Input
                                fluid
                                onChange={damageRoll.onChange}
                                value={damageRoll.value}
                                type={'number'}
                                autoFocus
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Damage type</label>
                            <Dropdown
                                placeholder={'Damage type'}
                                search
                                selection
                                options={damageTypes.map(t => ({
                                    key: t, value: t, text: t,
                                }))}
                                value={damageType.value}
                                onChange={(e, target) => damageType.onChange({
                                    target,
                                } as any)}
                            />
                        </Form.Field>
                        <Button type={'submit'} disabled={!damageRoll.isValid}>Do damage!</Button>
                    </Form>
                )}
                {stage === 4 && (
                    <>
                        You attacked it for {damageRoll.number} damage!
                    </>
                )}
            </Card.Content>
        </MonsterCard>
    );
};
