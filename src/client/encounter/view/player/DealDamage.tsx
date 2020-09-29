import React, {FC, useCallback} from 'react';
import {Button, Dropdown, Form, Header, InputOnChangeData, Modal} from 'semantic-ui-react';
import {observer, useLocalStore} from 'mobx-react';
import {assign, find, isNil, isNumber} from 'lodash';
import {Encounter} from '../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {Stacktrace} from '../../../elements/Stacktrace';
import {featureToDisplay} from '../../../helpers/display-helpers';
import {usePlayerId} from '../../../helpers/PlayerId';
import {useBackend} from '../../../helpers/BackendProvider';
import {DealDamage as DealDamageBody} from '../../../../server/service/log';
import {damageTypes} from '../../../../server/encounter';
import {onDropdown, onNumber} from '../../../hooks/use-form';
import {toJS} from 'mobx';
import {integer} from '../../../helpers/integer';

type Props = {
    encounter: Encounter,
}

export const DealDamage: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();

    const log = find(encounter.logs, l =>
        l.stage === 'WaitingOnDamage' &&
        l.source[0]?.player?.id === playerId);


    const empty = useCallback(() => ({
        damageType: undefined,
        damageSuccess: undefined,
        damageFailure: undefined,
    } as DealDamageBody), []);
    const form = useLocalStore<DealDamageBody>(empty);

    const isValid = isNumber(form.damageSuccess) &&
        (isNil(form.damageFailure) || isNumber(form.damageFailure)) &&
        !isNil(form.damageType);

    const onDamageSuccess = useCallback((event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        onNumber(form, 'damageSuccess')(event, data);
        if (!isNil(log) && !isNil(form.damageSuccess)) {
            if (log.stat === 'dexterity')
                form.damageFailure = Math.floor(form.damageSuccess / 2);
            else
                form.damageFailure = 0;
        }
    }, [form, log]);

    const _confirm = useLoader();
    const onSubmit = useCallback(() => {
        if (!log)
            return;
        const body = toJS(form);
        _confirm.fetchAsync(api.put(`/log/${log.id}/deal-damage`, body), log.id)
            .then(() => assign(form, empty()))
            .catch(e => e);
    }, [_confirm, api, empty, form, log]);

    const formId = Math.ceil(Math.random() * 1000).toString();

    return (
        <Modal
            open={!isNil(log)}
            dimmer={'blurring'}
        >
            {isNil(log) ? (
                <></>
            ) : (
                <>
                    <Header icon='bullseye' content='You hit the target!'/>
                    <Modal.Content>
                        <Form id={formId} onSubmit={onSubmit}>
                            {log.type === 'direct' ? (
                                <Header size={'small'}>
                                    Your attack against {featureToDisplay(log.target[0])} connected, deal it some
                                    damage!
                                </Header>
                            ) : (
                                <Header size={'small'}>
                                    Your AoE attack hit something, deal some damage!
                                </Header>
                            )}
                            <Form.Field>
                                <label>Damage type</label>
                                <Dropdown
                                    selection
                                    options={damageTypes.map(t => ({
                                        key: t, value: t, text: t,
                                    }))}
                                    onChange={onDropdown(form, 'damageType')}
                                    value={form.damageType}
                                />
                            </Form.Field>
                            <Form.Input
                                {...integer}
                                label={'Damage'}
                                onChange={onDamageSuccess}
                                value={form.damageSuccess ?? ''}
                            />
                            {log.type === 'aoe' && (
                                <Form.Input
                                    {...integer}
                                    label={'Damage if target saves (optional)'}
                                    onChange={onNumber(form, 'damageFailure')}
                                    value={form.damageFailure ?? ''}
                                />
                            )}
                            <Stacktrace error={_confirm.error[log.id]}/>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            form={formId}
                            loading={_confirm.loading[log.id]}
                            primary
                            basic
                            disabled={!isValid}
                        >
                            Confirm
                        </Button>
                    </Modal.Actions>
                </>
            )}
        </Modal>
    );
});
