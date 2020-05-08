import {fakeRequest, useBackend} from '../helpers/BackendProvider';
import {useHistory} from 'react-router';
import React, {FC, useCallback, useEffect} from 'react';
import {observer, useLocalStore} from 'mobx-react';
import {Store, useLoader} from '../helpers/Store';
import {assign} from 'lodash';
import {toJS} from 'mobx';
import {Button, InputOnChangeData} from 'semantic-ui-react';
import {Stacktrace} from '../elements/Stacktrace';
import {ConfirmButton} from '../elements/ConfirmButton';

type Mode = 'edit' | 'create';
type Urls = {
    get: string,
    put: string,
    post: string,
    delete: string,
}

export function useEditor<T>(store: Store<T>, baseUrl: string, id: string, creator: () => Partial<T>, urls?: Partial<Urls>) {
    const {api} = useBackend();
    const {goBack} = useHistory();

    const mode: Mode = id ? 'edit' : 'create';
    const fakeId = baseUrl;
    const urlsAll = {} as Urls;
    assign(urlsAll, {
        get: `/${baseUrl}/${id}`,
        put: `/${baseUrl}/${id}`,
        post: `/${baseUrl}`,
        delete: `/${baseUrl}/${id}`
    }, urls);

    const editor = useLocalStore<Partial<T>>(creator);

    const editorDefault = useLocalStore<Partial<T>>(creator);
    useEffect(() => {
        const promise = mode === 'edit' ?
            store.fetchAsync(api.get(urlsAll.get), id) :
            store.fetchAsync(fakeRequest<T>(creator), fakeId);
        promise.then((data) => {
            assign(editorDefault, data);
            assign(editor, data);
        });
    }, [api, baseUrl, creator, editor, editorDefault, fakeId, id, mode, store, urlsAll.get]);

    const submitter = useLoader();
    const reset = useCallback(() => {
        assign(editor, editorDefault);
    }, [editor, editorDefault]);
    const submit = useCallback(() => {
        const promise = mode === 'edit' ?
            submitter.fetchAsync(api.put(urlsAll.put, toJS(editor)), id) :
            submitter.fetchAsync(api.post(urlsAll.post, toJS(editor)), fakeId);
        promise.then(goBack).catch(() => undefined);
    }, [api, editor, fakeId, goBack, id, mode, submitter, urlsAll.post, urlsAll.put]);

    const remover = useLoader();
    const remove = useCallback(() => {
        const promise = mode === 'edit' ?
            remover.fetchAsync(api.delete(urlsAll.delete), id) :
            Promise.resolve(null);
        promise.then(goBack).catch(() => undefined);
    }, [api, goBack, id, mode, remover, urlsAll.delete]);

    const finalId = id || fakeId;
    const loading = submitter.loading[finalId] || remover.loading[finalId];
    const FormButtons: FC<{ removeButton?: boolean }> = observer(({removeButton}) => (
        <>
            {removeButton && (
                <ConfirmButton
                    basic
                    colors={['red', 'blue']}
                    onClick={remove}
                    loading={remover.loading[finalId]}
                    disabled={loading}
                >Delete</ConfirmButton>
            )}
            <Button.Group floated={removeButton ? 'right' : undefined}>
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
                    loading={submitter.loading[finalId]}
                    disabled={loading}
                >Submit</Button>
            </Button.Group>
            {submitter.error[finalId] && (
                <Stacktrace error={submitter.error[finalId]}/>
            )}
            {remover.error[finalId] && (
                <Stacktrace error={remover.error[finalId]}/>
            )}
        </>
    ));
    FormButtons.defaultProps = {
        removeButton: true,
    };

    const textControl = (key: keyof T) => ({
        value: editor[key],
        onChange: (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
            // @ts-ignore
            editor[key] = data.value;
        },
    });

    return {editor, submit, id: finalId, FormButtons, textControl, mode};
}
