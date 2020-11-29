import React, {FC, useCallback} from 'react';
import {observer, useLocalObservable} from 'mobx-react';
import {useBackend} from '../helpers/BackendProvider';
import {useHistory} from 'react-router-dom';
import {usePasswordInput} from '../hooks/use-password-input';
import {useLoader} from '../helpers/Store';
import {toJS} from 'mobx';
import {app} from '../App';
import {Button, Form, Input} from 'semantic-ui-react';
import {onText} from '../hooks/use-form';
import {Stacktrace} from '../elements/Stacktrace';
import {isEmpty} from 'lodash';

type FormModel = {
    password: string;
}

export const PasswordForm: FC<{ query: string }> = observer(({query}) => {
    const {api} = useBackend();
    const {push} = useHistory();

    const form = useLocalObservable<FormModel>(() => ({
        password: '',
    }));

    const {type, icon, meter} = usePasswordInput(form.password);

    const loader = useLoader();
    const loaderId = 'update';
    const update = useCallback(() => {
        loader.fetchAsync(api.put('/auth/reset-password', toJS(form), {params: {key: query}}), loaderId)
            .then(() => {
                push(app());
            })
            .catch(e => e)
        ;
    }, [api, form, query, loader, push]);

    return (
        <Form onSubmit={update}>
            <p>Create new password to finish the process.</p>
            <Form.Field>
                <label htmlFor={'password'}>Password</label>
                <Input
                    id={'password'}
                    type={type}
                    icon={icon}
                    value={form.password}
                    onChange={onText(form, 'password')}
                    required
                >
                </Input>
                {meter}
            </Form.Field>
            <Stacktrace error={loader.error[loaderId]}/>
            <Button
                basic
                fluid
                primary
                disabled={isEmpty(form.password) || loader.loading[loaderId]}
                loading={loader.loading[loaderId]}
            >Confirm new password</Button>
        </Form>
    );
});
