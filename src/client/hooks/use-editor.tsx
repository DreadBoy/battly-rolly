import {fakeRequest, useBackend} from '../helpers/BackendProvider';
import {useHistory} from 'react-router';
import React, {FC, useCallback, useEffect} from 'react';
import {observer, useLocalObservable} from 'mobx-react';
import {TStore, useLoader} from '../helpers/Store';
import {assign} from 'lodash';
import {toJS} from 'mobx';
import {Button} from 'semantic-ui-react';
import {Stacktrace} from '../elements/Stacktrace';
import {ConfirmButton} from '../elements/ConfirmButton';
import {onNumber, onText} from './use-form';

type Mode = 'edit' | 'create';
type Urls = {
    get: string,
    put: string,
    post: string,
    delete: string,
}

export function useEditor<T>(store: TStore, baseUrl: string, id: string, creator: () => Partial<T>, urls?: Partial<Urls>) {
    const {api} = useBackend();
    const {goBack} = useHistory();

    const mode: Mode = id ? 'edit' : 'create';
    const fakeId = baseUrl;
    const urlsAll = {} as Urls;
    assign(urlsAll, {
        get: `/${baseUrl}/${id}`,
        put: `/${baseUrl}/${id}`,
        post: `/${baseUrl}`,
        delete: `/${baseUrl}/${id}`,
    }, urls);

    const editor = useLocalObservable<Partial<T>>(creator);

    const editorDefault = useLocalObservable<Partial<T>>(creator);
    useEffect(() => {
        const promise = mode === 'edit' ?
            store.fetchAsync(api.get(urlsAll.get), id) :
            store.fetchAsync(fakeRequest<T>(async () => creator()), fakeId);
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

    const textControl = useCallback((key: keyof T, defaultValue: string = '') => ({
        value: editor[key] || defaultValue,
        // @ts-ignore
        onChange: onText(editor, key),
    }), [editor]);

    const numberControl = useCallback((key: keyof T, defaultValue: string = '') => ({
        value: editor[key] || defaultValue,
        // @ts-ignore
        onChange: onNumber(editor, key),
    }), [editor]);

    return {editor, submit, id: finalId, FormButtons, textControl, numberControl, mode};
}
