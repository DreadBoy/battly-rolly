import {fakeRequest, useBackend} from '../helpers/BackendProvider';
import {useHistory, useRouteMatch} from 'react-router';
import React, {FC, useCallback, useEffect} from 'react';
import {observer, useLocalStore} from 'mobx-react';
import {useStore} from '../helpers/StoreProvider';
import {Store} from '../helpers/Store';
import {assign} from 'lodash';
import {toJS} from 'mobx';
import {Button, InputOnChangeData} from 'semantic-ui-react';
import {Stacktrace} from '../helpers/Stacktrace';

export function useEditor<T>(store: Store<T>, baseUrl: string, creator: () => Partial<T>) {
    const fakeId = baseUrl;
    const {api} = useBackend();
    const {goBack} = useHistory();
    const {params: {id}} = useRouteMatch();

    const editor = useLocalStore<Partial<T>>(creator);

    const editorDefault = useLocalStore<Partial<T>>(creator);
    useEffect(() => {
        const promise = id ?
            store.fetchAsync(api.get(`/${baseUrl}/${id}`), id) :
            store.fetchAsync(fakeRequest<T>(creator), fakeId);
        promise.then((data) => {
            assign(editorDefault, data);
            assign(editor, data);
        });
    }, [api, baseUrl, creator, editor, editorDefault, fakeId, id, store]);

    const {noContent} = useStore();
    const reset = useCallback(() => {
        assign(editor, editorDefault);
    }, [editor, editorDefault]);
    const submit = useCallback(() => {
        const promise = id ?
            noContent
                .fetchAsync(api.put(`/${baseUrl}/${id}`, toJS(editor)), id) :
            noContent
                .fetchAsync(api.post(`/${baseUrl}`, toJS(editor)), fakeId);
        promise.then(goBack).catch(() => undefined);
    }, [api, baseUrl, editor, fakeId, goBack, id, noContent]);

    const finalId = id || fakeId;
    const loading = noContent.loading[finalId];
    const FormButtons: FC = observer(() => (
        <>
            <Button.Group>
                <Button
                    basic
                    color={'red'}
                    type='reset'
                    onClick={reset}
                    disabled={loading}
                >Reset</Button>
                <Button
                    basic
                    color={'blue'}
                    type='submit'
                    loading={loading}
                    disabled={loading}
                >Submit</Button>
            </Button.Group>
            {noContent.error[finalId] && (
                <Stacktrace error={noContent.error[finalId]}/>
            )}
        </>
    ));

    const textControl = (key: keyof T) => ({
        value: editor[key],
        onChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
            // @ts-ignore
            editor[key] = data.value;
        },
    });

    return {submit, id: finalId, FormButtons, textControl};
}
