import React, {FC} from 'react';
import {Button, Container, Header, Icon} from 'semantic-ui-react';

export const HomepageHeading: FC = () => (
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
        <Button primary size='huge'>
            Get Started
            <Icon name='arrow right'/>
        </Button>
    </Container>
)
