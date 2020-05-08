import {createUseStyles} from 'react-jss';
import React, {FC, useCallback, useState} from 'react';
import {Button, Card, Dropdown, Form, Input} from 'semantic-ui-react';
import {abilities, Ability, abilityShort, Monster, Save as SaveModel, SaveLog} from '../../../server/encounter';
import {useNumber, useText} from '../../common/form-helpers';
import {usePlayerId} from '../PlayerId';

type Props = {
    monsters: Monster[],
    onFinish: (result: SaveLog[]) => void,
};

const useStyles = createUseStyles({
    attackCard: {},
});

export const Save: FC<Props> = ({monsters, onFinish}) => {
    useStyles();
    const DC = useNumber();
    const ability = useText('dexterity');
    const playerId = usePlayerId();
    const damage = [useNumber(), useNumber()];

    const [stage, setStage] = useState<number>(0);

    const createAttack = useCallback((): SaveModel => ({
        type: 'save',
        name: 'manual',
        DC: DC.number,
        ability: ability.value as Ability,
    }), [DC.number, ability.value]);

    const stage0 = useCallback(() => {
        setStage(1);
        const actions = monsters.map(m => ({
            attackerId: playerId ?? '',
            targetId: m.id,
            save: createAttack(),
            damageSuccessRoll: damage[0].isValid ? damage[0].number : 0,
            damageFailureRoll: damage[1].isValid ? damage[1].number : 0,
            saveRoll: 0,
            success: null,
        }));
        onFinish(actions);
    }, [createAttack, damage, monsters, onFinish, playerId]);

    return (
        <Card fluid>
            <Card.Content>
                {stage === 0 && (
                    <Form onSubmit={stage0}>
                        <Form.Group widths={'equal'}>
                            <Form.Field error={!DC.isValid}>
                                <label>DC</label>
                                <Input
                                    fluid
                                    autoFocus
                                    onChange={DC.onChange}
                                    value={DC.value}
                                    type={'number'}
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
                            <Form.Field error={!damage[0].isValid}>
                                <label>Damage if failed</label>
                                <Input
                                    fluid
                                    onChange={damage[0].onChange}
                                    value={damage[0].value}
                                />
                            </Form.Field>
                            <Form.Field error={!!damage[1].value && !damage[1].isValid}>
                                <label>Damage if saved (optional)</label>
                                <Input
                                    fluid
                                    onChange={damage[1].onChange}
                                    value={damage[1].value}

                                />
                            </Form.Field>
                        </Form.Group>
                        <Button
                            type={'submit'}
                            disabled={!DC.isValid || !ability.value || !damage[0].isValid}
                        >Do damage!</Button>
                    </Form>
                )}
                {stage === 1 && (
                    <>
                        <span>Target need to succeed {DC.value} {abilityShort(ability.value as Ability)} save
                        or take {damage[0].number} damage.</span>
                        {damage[1].isValid && (
                            <span> If saved, target will still take {damage[1].number} damage.</span>
                        )}
                    </>
                )}
            </Card.Content>
        </Card>
    );
};
