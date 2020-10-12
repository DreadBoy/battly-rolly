import React, {FC} from 'react';
import {Container, Header, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {app} from '../App';

export const Landing: FC = () => (
    <Container text>
        <Header
            as='h1'
            content='Imagine-a-Company'
        />
        <Header
            as='h2'
            content='Do whatever you want when you want to.'
            style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginTop: '1.5em',
            }}
        />
        <Link className={'ui button primary huge'} to={app('/')}>
            Get Started
            <Icon name='arrow right'/>
        </Link>
    </Container>
)
