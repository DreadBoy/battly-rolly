import React, {FC, useCallback} from 'react';
import {Button, Dropdown, Form, Header, Modal} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {find, isEmpty, isNil} from 'lodash';
import {Encounter} from '../../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {Stacktrace} from '../../../helpers/Stacktrace';
import {featureToDisplay} from '../../../helpers/display-helpers';
import {usePlayerId} from '../../../helpers/PlayerId';
import {damageTypes} from '../../../../common/encounter';
import {useDropdown, useNumber} from '../../../../common/form-helpers';
import {useBackend} from '../../../helpers/BackendProvider';
import {DealDamage as DealDamageBody} from '../../../../../server/service/log';
import {DamageType} from '../../../types/bestiary';

type Props = {
    encounter: Encounter,
}

export const DealDamage: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();

    const log = find(encounter.logs, l =>
        l.stage === 'WaitingOnDamage' &&
        l.source[0].reference === playerId);

    const damageSuccess = useNumber();
    const damageFailure = useNumber();
    const damageType = useDropdown();
    const isValid = damageSuccess.isPositive &&
        (isEmpty(damageFailure.value) || damageSuccess.isPositive) &&
        !isEmpty(damageType.value);

    const _confirm = useLoader();
    const onSubmit = useCallback(() => {
        if (!log)
            return;
        const body: DealDamageBody = {
            damageSuccess: damageSuccess.number,
            damageFailure: damageFailure.number,
            damageType: damageType.value as DamageType,
        }
        _confirm.fetchAsync(api.put(`/log/${log.id}/deal-damage`, body), log.id)
            .then(() => {
                damageSuccess.reset();
                damageFailure.reset();
                damageType.reset();
            })
            .catch(e => e);
    }, [_confirm, api, damageFailure, damageSuccess, damageType, log]);

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
                            <Form.Input
                                type={'number'}
                                label={'Damage'}
                                onChange={damageSuccess.onChange}
                                value={damageSuccess.value}
                            />
                            {log.type === 'aoe' && (
                                <Form.Input
                                    type={'number'}
                                    label={'Damage if target saves (optional)'}
                                    onChange={damageFailure.onChange}
                                    value={damageFailure.value}
                                />
                            )}
                            <Form.Field>
                                <label>Damage type</label>
                                <Dropdown
                                    selection
                                    options={damageTypes.map(t => ({
                                        key: t, value: t, text: t,
                                    }))}
                                    value={damageType.value}
                                    onChange={damageType.onChange}
                                />
                            </Form.Field>
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
