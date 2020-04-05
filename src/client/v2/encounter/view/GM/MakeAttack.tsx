import React, {FC, useCallback} from 'react';
import {DndProvider} from 'react-dnd';
import {Button, Grid, Header, List, Form} from 'semantic-ui-react';
import {Feature} from '../../../../../server/model/feature';
import {DropTarget, TargetType} from './DropTarget';
import {observer, useLocalStore} from 'mobx-react';
import {StartLog} from '../../../../../server/service/log';
import {assign, find, includes, pull} from 'lodash';
import Backend from 'react-dnd-html5-backend';
import {FeatureItem} from './FeatureItem';
import {Encounter} from '../../../../../server/model/encounter';
import {useLoader} from '../../../helpers/Store';
import {useBackend} from '../../../helpers/BackendProvider';
import {Stacktrace} from '../../../helpers/Stacktrace';

type Props = {
    encounter: Encounter,
}

export type OnDrop = {
    target: TargetType,
    action: null | Pick<StartLog, 'name' | 'type' | 'attack' | 'DC' | 'stat'>,
};

export const MakeAttack: FC<Props> = observer(({encounter}) => {
    const {api} = useBackend();

    const logSetup = useLocalStore<StartLog>(() => ({source: [], target: [], type: 'direct', name: ''}));
    const isTargetFull = logSetup.type === 'direct' && logSetup.target.length > 0;
    const onDrop = useCallback((id: string) => ({target, action}: OnDrop) => {
        if (target === 'target' && !isTargetFull && !includes(logSetup.target, id))
            return logSetup.target.push(id);
        if (target === 'source' && action !== null) {
            logSetup.source.splice(0, logSetup.source.length, id);
            assign(logSetup, action);
        }
    }, [isTargetFull, logSetup]);
    const onClear = useCallback((type: TargetType) => (id: string) => {
        pull(logSetup[type], id);
        if (logSetup.source.length === 0)
            logSetup.name = '';
    }, [logSetup]);
    const logSetupValid = logSetup.source.length > 0 &&
        logSetup.target.length > 0 && logSetup.name;


    const _confirm = useLoader();
    const onConfirm = useCallback(() => {
        _confirm.fetch(api.post(`/log/encounter/${encounter.id}`, logSetup), encounter.id);
    }, [_confirm, api, encounter.id, logSetup]);

    const featuresById = useCallback((ids: string[]): Feature[] => {
        return ids.map(id => find(encounter.features, ['id', id])).filter(Boolean) as Feature[];
    }, [encounter.features]);

    return encounter.features.length > 0 ? (
        <DndProvider backend={Backend}>
            <Header size={'small'}>Make attack</Header>
            <Grid>
                <Grid.Column width={2}>
                    <Header size={'tiny'}>Monsters</Header>
                    <List>
                        {encounter.features
                            .filter(f => f.type === 'npc')
                            .map((f) => (
                                <FeatureItem
                                    key={f.id}
                                    feature={f}
                                    onDrop={onDrop(f.id)}
                                />
                            ))}
                    </List>
                </Grid.Column>
                <Grid.Column><Header size={'tiny'}>Players</Header>
                    <List>
                        {encounter.features
                            .filter(f => f.type === 'player')
                            .map((f) => (
                                <FeatureItem
                                    key={f.id}
                                    feature={f}
                                    onDrop={onDrop(f.id)}
                                />
                            ))}
                    </List>
                </Grid.Column>
                <Grid.Column>
                    <Header size={'tiny'}>Attackers</Header>
                    <DropTarget
                        type={'source'}
                        onClear={onClear('source')}
                        features={featuresById(logSetup['source'])}
                        canDrop={true}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Header size={'tiny'}>Defenders</Header>
                    <DropTarget
                        type={'target'}
                        onClear={onClear('target')}
                        features={featuresById(logSetup['target'])}
                        canDrop={!isTargetFull}
                    />
                </Grid.Column>
                <Grid.Column>
                    {logSetup.name && (
                        <Form.Field>
                            {logSetup.name} ready!
                        </Form.Field>
                    )}
                    <Button
                        basic
                        primary
                        disabled={!logSetupValid}
                        onClick={onConfirm}
                        loading={_confirm.loading[encounter.id]}
                    >Make attack</Button>
                    <Stacktrace error={_confirm.error[encounter.id]}/>
                </Grid.Column>
            </Grid>
        </DndProvider>
    ) : null;
});
