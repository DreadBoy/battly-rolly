import React, {FC, useCallback} from 'react';
import {Action, DamageType, damageTypes, Roll} from '../../common/encounter';
import {Button, Dropdown, Form, Modal as SModal} from 'semantic-ui-react';
import {useNumber, useText} from '../../common/form-helpers';

type Props = {
    onConfirm: (action: Action) => void,
    onCancel: () => void,
}

export const Modal: FC<Props> = ({onConfirm, onCancel}) => {
    const nameT = useText('');
    const modifier = useNumber('');
    const type = useText('');
    const rolls = useText('');

    const confirm = useCallback(() => {
        const parsedRolls = parseRolls(rolls.value);
        onConfirm({
            type: 'attack',
            name: nameT.value,
            modifier: modifier.number,
            damage: {
                damageType: type.value as DamageType,
                rolls: parsedRolls.valid ? parsedRolls.rolls : [],
            },
        });
    }, [modifier.number, nameT.value, onConfirm, rolls.value, type.value]);

    return (
        <SModal
            open={true}
            size='small'
            onClose={onCancel}
        >
            <SModal.Header>Manual attack</SModal.Header>
            <SModal.Content>
                <Form onSubmit={confirm}>
                    <Form.Group widths={'equal'}>
                        <Form.Input
                            label={'Name'}
                            onChange={nameT.onChange}
                            value={nameT.value}
                            error={!nameT.value}
                        />
                        <Form.Input
                            label={'Modifier'}
                            type={'number'}
                            onChange={modifier.onChange}
                            value={modifier.value}
                            error={!modifier.value}
                        />
                        <Form.Field>
                            <label>Damage type</label>
                            <Dropdown
                                placeholder={'Damage type'}
                                search
                                selection
                                options={damageTypes.map(t => ({
                                    key: t, value: t, text: t,
                                }))}
                                value={type.value}
                                onChange={(e, target) => type.onChange({
                                    target,
                                } as any)}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <Form.Input label={'Roll'} onChange={rolls.onChange} value={rolls.value}
                                    error={!parseRolls(rolls.value).valid}/>
                    </Form.Group>
                    <Button primary type={'submit'}>Submit</Button>
                </Form>
            </SModal.Content>
        </SModal>
    );
};

function parseRolls(value: string): { valid: boolean, rolls: Roll[] } {
    if (!value)
        return {valid: false, rolls: []};
    const rolls: Roll[] = value.split(',').map(r => {
        const match = r.match(/^(\d+?)d(\d+?)([+-]\d+?)?$/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3] || '0')] as Roll : null;
    }) as Roll[];
    const valid = rolls.length > 0 && rolls.length === rolls.filter(Boolean).length;
    return {valid, rolls};
}
