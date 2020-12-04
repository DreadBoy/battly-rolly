import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../server/model/encounter';
import {filter, groupBy, isEmpty, isNil, map} from 'lodash';
import {useLoader} from '../../../helpers/Store';
import {DealDamage as DealDamageBody} from '../../../../server/service/log';
import {roll} from '../../../helpers/roll';
import {Log} from '../../../../server/model/log';
import {fakeRequest, useBackend} from '../../../helpers/BackendProvider';
import {isAoe, isDirect} from '../../../../server/model/helpers';
import {Action} from '../../../../server/model/action';
import {findAction} from '../../../../server/model/action-types';
import {toJS} from 'mobx';

type Props = {
    encounter: Encounter,
}

export const DealDamage: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const _loader = useLoader();
    const promise = useRef<Promise<any> | undefined>();

    const logs = filter(encounter.logs, l => l.stage === 'WaitingOnDamage');
    useEffect(() => {
        if (!!promise.current || isEmpty(logs))
            return;
        const actions = map(logs, log => ({
            action: findAction(log.source[0].monster, log.name),
            log,
        }));
        const {true: valid, false: invalid} = groupBy(
            map(actions, ({action, log}): { action?: Action, log: Log, body?: DealDamageBody } => {
                // This is error state, it shouldn't happen if bestiary is complete
                if (!action)
                    return {
                        action,
                        log,
                    };
                if (isDirect(action) && log.success) {
                    return {
                        action,
                        log,
                        body: {
                            damageSuccess: roll(action.damage.roll),
                            damageType: action.damage.damageType,
                        },
                    };
                } else if (isDirect(action)) {
                    // If action is direct and wasn't successful, API should mark log as "Confirmed"
                    // If we hit this condition, something's wrong!
                    throw new Error('Encountered invalid state, went into panic mode!')
                }
                if (isAoe(action)) {
                    const damage = isNil(action.damage) ? undefined : roll(action.damage.roll);
                    return {
                        action, log, body: {
                            // action.damageSuccess means damage if target saves aka attack fails
                            // but log.damageSuccess means damage if attack succeeds aka target fails to save
                            damageSuccess: damage,
                            damageFailure: action.takeHalfOnFailure && !isNil(damage) ?
                                Math.floor(damage / 2) : undefined,
                            damageType: action.damage?.damageType,
                            status: action.status,
                        },
                    };
                }
                return {
                    action,
                    log,
                };
            }),
            o => !!o.body,
        );
        if (!isEmpty(invalid))
            return console.error('Missing actions or return values: ', map(map(invalid, 'log'), l => toJS(l)));
        const requests = map(valid, ({log, body}) => api.put(`/log/${log.id}/deal-damage`, body)).map(p => p.catch(e => e));
        const request = fakeRequest(async () => requests);
        promise.current = _loader.fetchAsync(request, encounter.id)
            .catch(e => e)
            .then(() => promise.current = undefined);

    }, [_loader, api, encounter.id, logs]);
    return null;
});
