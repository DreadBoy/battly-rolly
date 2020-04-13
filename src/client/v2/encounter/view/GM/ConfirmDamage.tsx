import {FC, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {filter, find, findIndex, flatMap, isEmpty, isNil, map, negate, pick, some} from 'lodash';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Feature} from '../../../../../server/model/feature';

type Props = {
    encounter: Encounter,
}

export const ConfirmDamage: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const _update = useLoader<Feature[]>();
    const _confirm = useLoader<any[]>();

    const logs = filter(encounter.logs, l =>
        l.stage === 'WaitingOnConfirmed' &&
        some(map(l.target, (f, index) => ({target: f, success: l.success[index], confirmed: l.confirmed[index]})),
            ({target, confirmed}) => target.type === 'npc' && isNil(confirmed)));
    useEffect(() => {
        const isLoading = some(Object.values(_update.loading), Boolean) ||
            some(Object.values(_confirm.loading), Boolean);
        if (isLoading || isEmpty(logs))
            return;
        const features = filter(flatMap(logs, (log) => map(log.target, feature => {
            if (feature.type !== 'npc')
                return;
            const index = findIndex(log.target, ['id', feature.id]);
            let damage = 0;
            if (log.type === 'direct')
                damage = log.damageSuccess;
            else if (log.type === 'aoe' && log.success[index] === true)
                damage = log.damageSuccess;
            else if (log.type === 'aoe' && log.success[index] === false)
                damage = log.damageFailure;
            // TODO account for damage resistance or immunity
            const body = pick(feature, ['HP', 'id']);
            body.HP -= damage;
            return {logId: log.id, featureId: feature.id, body};
        })), negate(isNil));
        const willSend = map(features, 'body');
        _update
            .fetchAsync(api.put('/feature', willSend), 'update')
            .then(newFeatures => (async function () {
                for (const {id} of newFeatures) {
                    const logId = find(features, ['featureId', id])?.logId;
                    if (!logId)
                        throw new Error('whatever');
                    await _confirm.fetchAsync(
                        api.put(`/log/${logId}/confirm-damage`, {featureId: id}),
                        `${logId}/${id}`).catch(e => e);
                }
            })());
    }, [_confirm, _update, api, encounter.id, logs]);
    return null;
});
