import React, {FC, useCallback} from 'react';
import {Button, Form, Modal} from 'semantic-ui-react';
import {abilityShort, SaveLog} from '../../common/encounter';
import {useNumber} from '../../common/form-helpers';
import {capitalize} from 'lodash';

type Props = {
    save: SaveLog,
    onResolve: (value: number) => void,
};

export const ResolveSave: FC<Props> = ({save, onResolve}) => {
    const form = useNumber();
    const onSubmit = useCallback(() => {
        if (form.isValid)
            onResolve(form.number as number);
    }, [form.isValid, form.number, onResolve]);
    return (
        <Modal open={true}>
            <Modal.Header>
                You need to do {abilityShort(save.save.ability)} saving throw!
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={onSubmit}>
                    <Form.Input
                        label={`${capitalize(abilityShort(save.save.ability))} save`}
                        onChange={form.onChange}
                        value={form.value}
                        error={!form.isValid}
                    />
                    <Form.Field>
                        <Button primary type='submit'>Confirm</Button>
                    </Form.Field>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
