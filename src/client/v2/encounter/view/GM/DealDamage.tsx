import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {filter, groupBy, isEmpty, map} from 'lodash';
import {useLoader} from '../../../helpers/Store';
import {Action, findAction, isAoe, isDirect} from '../../../types/bestiary';
import {DealDamage as DealDamageBody} from '../../../../../server/service/log';
import {rollMulti} from '../../../../common/roll';
import {Log} from '../../../../../server/model/log';
import {fakeRequest, useBackend} from '../../../helpers/BackendProvider';

type Props = {
    encounter: Encounter,
}

export const DealDamage: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const _loader = useLoader<any[]>();
    const promise = useRef<Promise<any> | undefined>();

    const logs = filter(encounter.logs, l => l.stage === 'WaitingOnDamage');
    useEffect(() => {
        if (!!promise.current || isEmpty(logs))
            return;
        const actions = map(logs, log => ({
            action: findAction(log.source[0].reference, log.name),
            log,
        }));
        const {true: valid, false: invalid} = groupBy(
            map(actions, ({action, log}): { action?: Action, log: Log, body?: DealDamageBody } => {
                if (!action)
                    return {
                        action,
                        log,
                    };
                if (isDirect(action) && log.success) {
                    return {
                        action, log, body: {
                            damage: rollMulti(action.damage.rolls),
                            damageType: action.damage.damageType,
                        },
                    };
                } else if (isDirect(action)) {
                    // If action is direct and wasn't successful, API should mark log as "Confirmed"
                    // If we hit this condition, something's wrong!
                    throw new Error('Encountered invalid state, went into panic mode!')
                }
                if (isAoe(action)) {
                    if (log.success)
                        return {
                            action, log, body: {
                                damage: rollMulti(action.damageSuccess?.rolls),
                                damageType: action.damageSuccess?.damageType,
                                status: action.status,
                            },
                        };
                    else
                        return {
                            action, log, body: {
                                damage: rollMulti(action.damageFailure?.rolls),
                                damageType: action.damageFailure?.damageType,
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
            return console.error('Missing actions or return values: ', map(invalid, 'log'));
        const requests = map(valid, ({log, body}) => api.put(`/log/${log.id}/deal-damage`, body)).map(p => p.catch(e => e));
        const request = fakeRequest(() => requests);
        promise.current = _loader.fetchAsync(request, encounter.id)
            .catch(e => e)
            .then(() => promise.current = undefined);

    }, [_loader, api, encounter.id, logs]);
    return null;
});
