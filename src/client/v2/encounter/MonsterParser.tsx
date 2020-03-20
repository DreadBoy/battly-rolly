import React, {FC, useCallback} from 'react';
import {Button, Form, TextArea} from 'semantic-ui-react';
import {useTextArea} from '../../common/form-helpers';
import {parseMonster} from '../../common/monster-parser';
import {Feature} from '../../../server/model/feature';
import {roll} from '../../common/roll';

type Props = {
    onParsed: (features: Partial<Feature>[]) => void,
};

export const MonsterParser: FC<Props> = ({onParsed}) => {
    const {value, onChange, setValue} = useTextArea();
    const onSubmit = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const monsters = value
            .split('\n')
            .map(parseMonster)
            .map(monster => ({
                type: 'npc',
                reference: monster.name,
                AC: monster.AC,
                HP: roll(monster.HP),
            } as Partial<Feature>));
        setValue('');
        onParsed(monsters);
    }, [onParsed, setValue, value]);

    return (
        <>
            <Form.Field>
                <label>Import monsters</label>
                <TextArea value={value} onChange={onChange} rows={1}/>
            </Form.Field>
            <Button basic color={'grey'} type={'submit'} disabled={value.length < 1} onClick={onSubmit}>Add monsters</Button>
        </>
    );
};

