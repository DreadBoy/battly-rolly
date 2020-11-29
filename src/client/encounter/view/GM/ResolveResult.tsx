import {FC, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../server/model/encounter';
import {filter, flatMap, isEmpty, isNil, map, negate, some} from 'lodash';
import {useLoader} from '../../../helpers/Store';
import {ResolveResult as ResolveResultBody} from '../../../../server/service/log';
import {roll} from '../../../helpers/roll';
import {useBackend} from '../../../helpers/BackendProvider';
import {Log} from '../../../../server/model/log';
import {type} from '../../../../server/model/helpers';
import {statToModifier} from '../../../../server/model/action-types';

type Props = {
    encounter: Encounter,
}

export const ResolveResult: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const _loader = useLoader();

    const logs = filter(encounter.logs, l =>
        l.stage === 'WaitingOnResult' &&
        some(map(l.target, (f, index) => ({target: f, success: l.success[index]})),
            ({target, success}) => type(target) === 'npc' && isNil(success)));
    useEffect(() => {
        const isLoading = some(Object.values(_loader.loading), Boolean);
        if (isLoading || isEmpty(logs))
            return;
        type Result = { log: Log } & ResolveResultBody;
        const results = filter(flatMap(logs, (log) => map(log.target, feature => {
            if (type(feature) !== 'npc')
                return;
            const monster = feature.monster;
            if (!monster)
                return;
            if (log.type === 'direct') {
                return {
                    log,
                    featureId: feature.id,
                    success: log.nat20 || monster.AC <= log.attack,
                } as Result;
            } else {
                return {
                    log,
                    featureId: feature.id,
                    throw: roll([1, 20, statToModifier(monster.abilitySet[log.stat])]),
                } as Result;
            }
        })), negate(isNil)) as Result[];
        (async function () {
            for (const {log, ...body} of results)
                await _loader.fetchAsync(
                    api.put(`/log/${log.id}/resolve-result`, body),
                    `${log.id}/${body.featureId}`).catch(e => e);
        })();
    }, [_loader, api, encounter.id, logs]);
    return null;
});
