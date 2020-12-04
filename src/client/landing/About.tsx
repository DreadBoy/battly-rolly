import React, {FC} from 'react';
import {createUseStyles} from 'react-jss';
import {Page} from '../layout/Page';
import {Container, Header, Image, List, Segment} from 'semantic-ui-react';
import s1 from '../../assets/screenshots/1.png';
import s2 from '../../assets/screenshots/2.png';
import s3 from '../../assets/screenshots/3.png';
import s4 from '../../assets/screenshots/4.png';
import s5 from '../../assets/screenshots/5.png';

const useStyles = createUseStyles({
    container: {
        '.ui.text.container&': {
            maxWidth: '100%!important',
        },
    },
})

const images = [
    ['Login or create your account', s1],
    ['Create your first campaign', s2],
    ['Create your own monsters or subscribe to user-created ones', s3],
    ['Create an encounter and add monsters. Click on their names and HP to edit them before or during encounter', s4],
    ['Once ready, share your campaign to your friends and let them join. Then let the battle begin!', s5],
]

export const About: FC = () => {
    const classes = useStyles();
    return (
        <Page>
            <Container text className={classes.container}>
                <Header as={'h1'}>About Crit Hit</Header>
                <p>
                    I play and DM D&D and I realised half of our sessions are spend communicating numbers when we could
                    roleplay instead. Our encounters are too long not because monsters have too much HP or we don't know
                    how to kill them efficiently, it's because we have to communicate all those numbers across the
                    table. This conversation is all too familiar in my group:
                </p>
                <Segment color={'blue'}>
                    <b>pc:</b> I attack for 18, does it hit? <br/>
                    <b>dm:</b> Yes, roll for damage. <br/>
                    <b>pc:</b> I rolled 6 bludgeoning damage. <br/>
                    <b>dm:</b> Noted, who's next? <br/>
                </Segment>
                <p>
                    To ease the issue I created the app that is before you, Crit Hit. It was primarily designed to help
                    with offline in-person play and doesn't aim to replace Roll20. You'll still have to roll your dice
                    manually and bring your own battle mat but the app will take care of dealing the damage for you so
                    you can focus on roleplay.
                </p>
                <Header as={'h2'}>Guide</Header>
                <List relaxed divided ordered>
                    {images.map(([text, src]) => (
                        <List.Item key={text}>
                            <List.Content>
                                <List.Header as={'h4'}>{text}</List.Header>
                                <List.Description>
                                    <Image src={src} rounded bordered size={'big'}/>
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </Container>
        </Page>
    );
}
