import {fakeRequest, useBackend} from '../helpers/BackendProvider';
import {useHistory, useRouteMatch} from 'react-router';
import React, {FC, useCallback, useEffect} from 'react';
import {observer, useLocalStore} from 'mobx-react';
import {Store, useLoader} from '../helpers/Store';
import {assign} from 'lodash';
import {toJS} from 'mobx';
import {Button, InputOnChangeData} from 'semantic-ui-react';
import {Stacktrace} from '../helpers/Stacktrace';
import {ConfirmButton} from '../helpers/ConfirmButton';

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

    const submitter = useLoader();
    const reset = useCallback(() => {
        assign(editor, editorDefault);
    }, [editor, editorDefault]);
    const submit = useCallback(() => {
        const promise = id ?
            submitter.fetchAsync(api.put(`/${baseUrl}/${id}`, toJS(editor)), id) :
            submitter.fetchAsync(api.post(`/${baseUrl}`, toJS(editor)), fakeId);
        promise.then(goBack).catch(() => undefined);
    }, [api, baseUrl, editor, fakeId, goBack, id, submitter]);

    const remover = useLoader();
    const remove = useCallback(() => {
        const promise = id ?
            remover.fetchAsync(api.delete(`/${baseUrl}/${id}`), id) :
            Promise.resolve(null);
        promise.then(goBack).catch(() => undefined);
    }, [api, baseUrl, goBack, id, remover]);

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

    return {editor, submit, id: finalId, FormButtons, textControl};
}
