import React, {FC} from 'react';
import {Container, Grid, Header} from 'semantic-ui-react';
import bg from '../../assets/07cdffb028209e9b2fe3ef7fc142e920.jpg';
import {Splash} from './Splash';

export const FourOhFour: FC = () => {
    return (
        <Splash bg={bg}>
            <Container>
                <Grid columns={2} centered doubling>
                    <Grid.Column>
                        <Header textAlign='center' size={'large'}>That's odd</Header>
                        <Header textAlign='center' size={'small'}>This page appears to be missing.</Header>
                    </Grid.Column>
                </Grid>
            </Container>
        </Splash>
    );
};
