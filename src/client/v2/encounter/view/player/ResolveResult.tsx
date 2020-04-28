import React, {FC, useCallback} from 'react';
import {Button, Form, Header, Input, Modal} from 'semantic-ui-react';
import {observer} from 'mobx-react';
import {find, findIndex, isNil, nth, some} from 'lodash';
import {Encounter} from '../../../../../server/model/encounter';
import {coolFace, sadFace} from '../../../../common/emojis';
import {createUseStyles} from 'react-jss';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Stacktrace} from '../../../helpers/Stacktrace';
import {useNumber} from '../../../../common/form-helpers';
import {abilityShort, featureToDisplay} from '../../../helpers/display-helpers';
import {usePlayerId} from '../../../helpers/PlayerId';
import {hasPlayer} from '../../../../../server/model/helpers';

type Props = {
    encounter: Encounter,
}

const useStyles = createUseStyles({
    action: {
        '.ui.modal .actions>.button&': {
            marginLeft: 0,
        },
    },
});

export const ResolveResult: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();
    const {id: playerId} = usePlayerId();
    const classes = useStyles();

    const log = find(encounter.logs, l =>
        l.stage === 'WaitingOnResult' &&
        some(l.target, hasPlayer(playerId)));
    const targetIndex = findIndex(log?.target, hasPlayer(playerId));
    const stillWaiting = isNil(nth(log?.success, targetIndex));
    const feature = find(log?.target, hasPlayer(playerId));

    const _confirm = useLoader();
    const onResult = useCallback((success: boolean) => () => {
        if (!log)
            return;
        _confirm.fetch(api.put(`/log/${log.id}/resolve-result`, {
            featureId: feature?.id,
            success,
        }), log.id);
    }, [_confirm, api, feature, log]);

    const save = useNumber();
    const onSave = useCallback(() => {
        if (!log || !save.isValid)
            return;
        _confirm.fetch(api.put(`/log/${log.id}/resolve-result`, {
            featureId: feature?.id,
            throw: save.number,
        }), log.id);
    }, [_confirm, api, feature, log, save.isValid, save.number]);

    const formId = Math.ceil(Math.random() * 1000).toString();

    return (
        <Modal
            open={!isNil(log) && stillWaiting}
            dimmer={'blurring'}
        >
            <Header icon='exclamation circle' content='You are being attacked!'>
            </Header>
            {isNil(log) ? (
                <></>
            ) : log.type === 'direct' ? (
                <>
                    <Modal.Content>
                        <Header size={'small'}>
                            {featureToDisplay(log.source[0])} attacked you with {log.name}.
                            <br/>
                            Did {log.attack} hit you?
                        </Header>
                        <Stacktrace error={_confirm.error[log.id]}/>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            onClick={onResult(false)}
                            loading={_confirm.loading[log.id]}
                            className={classes.action}
                            color='green'
                            basic
                            floated={'left'}
                        >
                            No {coolFace}
                        </Button>
                        <Button
                            onClick={onResult(true)}
                            loading={_confirm.loading[log.id]}
                            className={classes.action}
                            color='red'
                            basic
                        >
                            Yes {sadFace}
                        </Button>
                    </Modal.Actions>
                </>
            ) : (
                <>
                    <Modal.Content>
                        <Form onSubmit={onSave} id={formId}>
                            <Header size={'small'}>
                                {featureToDisplay(log.source[0])} attacked you with {log.name}.
                                <br/>
                                Make {log.stat} saving throw!</Header>
                            <Input
                                label={abilityShort(log.stat)}
                                value={save.value}
                                onChange={save.onChange}
                                type={'number'}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            form={formId}
                            loading={_confirm.loading[log.id]}
                            primary
                            basic
                            disabled={!save.isValid}
                        >
                            Confirm
                        </Button>
                    </Modal.Actions>
                </>
            )}
        </Modal>
    );
});
