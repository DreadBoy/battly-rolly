import React, {FC, FormEventHandler, useCallback} from 'react';
import {Button, Form, TextArea} from 'semantic-ui-react';
import {useTextArea} from '../common/form-helpers';
import {Monster} from '../common/encounter';
import {parseMonster} from '../common/monster-parser';

type Props = {
    onParsed: (monsters: Monster[]) => void,
};

export const MonsterParser: FC<Props> = ({onParsed}) => {
    const {value, onChange, setValue} = useTextArea();
    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
        event.preventDefault();
        const monsters = value.split('\n').map(parseMonster);
        setValue('');
        onParsed(monsters);
    }, [onParsed, setValue, value]);

    return (
        <Form onSubmit={onSubmit}>
            <Form.Field>
                <TextArea placeholder={'Import monsters...'} value={value} onChange={onChange} rows={1}/>
            </Form.Field>
            <Button primary type={'submit'} disabled={value.length < 1}>Add monsters</Button>
        </Form>
    );
};

