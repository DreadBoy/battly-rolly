import React, {FC} from 'react';
import {Container, Grid, Header} from 'semantic-ui-react';
import {Splash} from './Splash';
import { Helmet } from 'react-helmet';

export const FourOhFour: FC = () => {
    return (
        <Splash>
            <Helmet>
                <title>Crit Hit - 404 page</title>
            </Helmet>
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
