import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Button, Card, Dropdown, Form} from 'semantic-ui-react';
import {abilities, Ability, abilityShort, Monster, Save as SaveModel, SaveLog} from '../../common/encounter';
import {MonsterCard} from './MonsterCard';
import {useNumber, useText} from '../../common/form-helpers';
import {usePlayerId} from '../PlayerId';
import {Input} from '../../common/Input';
import {displayRolls, parseRolls} from '../../gm/encounter/ManualAttackModal';

type Props = {
    monster: Monster,
    focused?: boolean,
    onFinish: (result: SaveLog) => void,
};

const useStyles = createUseStyles({
    attackCard: {},
});

export const Save: FC<Props> = ({monster, focused, onFinish}) => {
    useStyles();
    const DC = useNumber();
    const ability = useText('dexterity');
    const playerId = usePlayerId();
    const damage = [useText(), useText()];
    const rolls = damage.map(d => parseRolls(d.value));

    const [stage, setStage] = useState<number>(0);

    const createAttack = useCallback((): SaveModel => ({
        type: 'save',
        name: 'manual',
        DC: DC.number as number,
        ability: ability.value as Ability,
    }), [DC.number, ability.value]);

    const stage0 = useCallback(() => {
        setStage(1);
        onFinish({
            attackerId: playerId ?? '',
            targetId: monster.id,
            save: createAttack(),
            saveRoll: 0,
            success: null,
        });
    }, [createAttack, monster.id, onFinish, playerId]);

    return (
        <MonsterCard monster={monster}>
            <Card.Content>
                {stage === 0 && (
                    <Form onSubmit={stage0}>
                        <Form.Group widths={'equal'}>
                            <Form.Field error={!DC.isValid}>
                                <label>DC</label>
                                <Input
                                    fluid
                                    onChange={DC.onChange}
                                    value={DC.value}
                                    type={'number'}
                                    focused={focused}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Ability</label>
                                <Dropdown
                                    placeholder={'Ability'}
                                    search
                                    selection
                                    options={abilities.map(t => ({
                                        key: t, value: t, text: t,
                                    }))}
                                    value={ability.value}
                                    onChange={(e, target) => ability.onChange({
                                        target,
                                    } as any)}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Field error={!rolls[0].valid}>
                                <label>Damage if failed</label>
                                <Input
                                    fluid
                                    onChange={damage[0].onChange}
                                    value={damage[0].value}
                                />
                            </Form.Field>
                            <Form.Field error={!!damage[1].value && !rolls[1].valid}>
                                <label>Damage if saved (optional)</label>
                                <Input
                                    fluid
                                    onChange={damage[1].onChange}
                                    value={damage[1].value}

                                />
                            </Form.Field>
                        </Form.Group>
                        <Button
                            primary
                            type={'submit'}
                            disabled={!DC.isValid || !ability.value || !rolls[0].valid}
                        >Attack!</Button>
                    </Form>
                )}
                {stage === 1 && (
                    <>
                        Target need to succeed {DC.value} {abilityShort(ability.value as Ability)} save
                        or take {displayRolls(rolls[0].rolls)}.
                        {rolls[1].valid && ` If saved, target will still take ${displayRolls(rolls[1].rolls)}`}
                    </>
                )}
            </Card.Content>
        </MonsterCard>
    );
};
Save.defaultProps = {
    focused: false,
};
