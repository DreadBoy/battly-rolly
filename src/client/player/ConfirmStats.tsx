import {createUseStyles} from 'react-jss';
import React, {FC, FormEventHandler, useCallback} from 'react';
import {Button, Form, Header, Input, Segment} from 'semantic-ui-react';
import {useNumber} from '../common/form-helpers';
import {column} from '../common/styles';
import {useHistory} from 'react-router';
import bg from '../../assets/wp2227164.jpg';

const useStyles = createUseStyles({
    confirmStats: {
        height: '100vh',
        width: '100vw',
        display: 'grid',
        alignItems: 'center',
    },
    image: {
        background: `url(${bg}) 24% center / cover`,
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        justifySelf: 'stretch',
        alignSelf: 'stretch',
    },
    panel: {
        gridColumn: '1 / 1',
        gridRow: '1 / 1',
        zIndex: 1,
        background: 'white',
        ...column,
        padding: 20,
        '&.ui.segment': {margin: 10},
    },
});

export const ConfirmStats: FC = () => {
    const classes = useStyles();
    const {push} = useHistory();
    const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>((event) => {
        event.preventDefault();
        push('connect');
    }, [push]);
    const {value: acString, number: ac, isValid, onChange: acOnChange} = useNumber();
    return (
        <div className={classes.confirmStats}>
            <div className={classes.image}/>
            <Segment className={classes.panel}>
                <Header as='h1'>Enter your stats</Header>
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <Input label={'AC'} onChange={acOnChange} value={acString} error={!isValid || !ac || ac < 1}/>
                    </Form.Field>
                    <Button primary type={'submit'} disabled={!isValid || !ac || ac < 1}>Confirm</Button>
                </Form>
            </Segment>
        </div>
    );
};
