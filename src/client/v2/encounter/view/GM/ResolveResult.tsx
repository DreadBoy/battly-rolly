import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react';
import {Encounter} from '../../../../../server/model/encounter';
import {filter, flatMap, isEmpty, isNil, map, negate, some} from 'lodash';
import {useLoader} from '../../../helpers/Store';
import {findMonster} from '../../../types/bestiary';
import {ResolveResult as ResolveResultBody} from '../../../../../server/service/log';
import {roll} from '../../../../common/roll';
import {fakeRequest, useBackend} from '../../../helpers/BackendProvider';
import {Log} from '../../../../../server/model/log';

type Props = {
    encounter: Encounter,
}

export const ResolveResult: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const _loader = useLoader<any[]>();
    const promise = useRef<Promise<any> | undefined>();

    const logs = filter(encounter.logs, l =>
        l.stage === 'WaitingOnResult' &&
        some(map(l.target, (f, index) => ({target: f, success: l.success[index]})),
            ({target, success}) => target.type === 'npc' && isNil(success)));
    useEffect(() => {
        if (!!promise.current || isEmpty(logs))
            return;
        type Result = { log: Log } & ResolveResultBody;
        const results = filter(flatMap(logs, (log) => map(log.target, feature => {
            if (feature.type !== 'npc')
                return;
            const monster = findMonster(feature.reference);
            if (!monster)
                return;
            if (log.type === 'direct') {
                return {
                    log,
                    featureId: feature.id,
                    success: monster.AC <= log.attack,
                } as Result;
            } else {
                return {
                    log,
                    featureId: feature.id,
                    throw: roll([1, 20, monster.abilitySet[log.stat]]),
                } as Result;
            }
        })), negate(isNil)) as Result[];
        const requests = map(results, ({log, ...body}) =>
            api.put(`/log/${log.id}/resolve-result`, body)).map(p => p.catch(e => e));
        const request = fakeRequest(() => requests);
        promise.current = _loader.fetchAsync(request, encounter.id)
            .catch(e => e)
            .then(() => promise.current = undefined);

    }, [_loader, api, encounter.id, logs]);
    return null;
});
