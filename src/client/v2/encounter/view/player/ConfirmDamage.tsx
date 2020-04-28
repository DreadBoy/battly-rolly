import React, {FC, useCallback} from 'react';
import {Button, Header, Modal} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {find, findIndex, isNil, nth, some} from 'lodash';
import {Encounter} from '../../../../../server/model/encounter';
import {sadFace} from '../../../../common/emojis';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Stacktrace} from '../../../helpers/Stacktrace';
import {featureToDisplay, possessive} from '../../../helpers/display-helpers';
import {usePlayerId} from '../../../helpers/PlayerId';
import {hasPlayer} from '../../../../../server/model/helpers';

type Props = {
    encounter: Encounter,
}

export const ConfirmDamage: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();

    const log = find(encounter.logs,  l =>
        l.stage === 'WaitingOnConfirmed' &&
        some(l.target, hasPlayer(playerId)));
    const targetIndex = findIndex(log?.target, hasPlayer(playerId));
    const stillWaiting = isNil(nth(log?.confirmed, targetIndex));
    const feature = find(log?.target, hasPlayer(playerId));

    const _confirm = useLoader();
    const onConfirm = useCallback(() => {
        if (!log)
            return;
        _confirm.fetch(api.put(`/log/${log.id}/confirm-damage`, {
            featureId: feature?.id,
        }), log.id);
    }, [_confirm, api, feature, log]);

    return (
        <Modal
            open={!isNil(log) && stillWaiting}
            dimmer={'blurring'}
        >
            <Header icon='exclamation circle' content='You were attacked!'>
            </Header>
            {isNil(log) ? (
                <></>
            ) : (
                <>
                    <Modal.Content>
                        {log.type === 'direct' ? (
                            <Header size={'small'}>
                                {featureToDisplay(log.source[0])} hit you with {log.name}!
                                <br/>
                                Take {log.damageSuccess} {log.damageType} damage.
                            </Header>
                        ) : log.success[targetIndex] ? (
                            <Header size={'small'}>
                                You failed to avoid {possessive(featureToDisplay(log.source[0]))} {log.name}!
                                <br/>
                                Take {log.damageSuccess} {log.damageType} damage.
                                {log.status && (
                                    <>
                                        <br/>
                                        You are also {log.status}.
                                    </>
                                )}
                            </Header>
                        ) : (
                            <Header size={'small'}>
                                You managed to avoid {possessive(featureToDisplay(log.source[0]))} {log.name}!
                                <br/>
                                But still take {log.damageFailure} {log.damageType} damage.
                                {log.status && (
                                    <>
                                        <br/>
                                        You are also {log.status}.
                                    </>
                                )}
                            </Header>
                        )}
                        <Stacktrace error={_confirm.error[log.id]}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            onClick={onConfirm}
                            loading={_confirm.loading[log.id]}
                            color='red'
                            basic
                        >
                            OK {sadFace}
                        </Button>
                    </Modal.Actions>
                </>
            )}
        </Modal>
    );
});
