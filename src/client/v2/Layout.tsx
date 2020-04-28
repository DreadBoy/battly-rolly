import React, {FC, useEffect, useState} from 'react';
import {Container, Icon, Menu} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import icon from '../../assets/dice-twenty-faces-twenty.svg';
import {Link} from 'react-router-dom';
import {usePlayerId} from './helpers/PlayerId';
import {useBackend} from './helpers/BackendProvider';
import {Encounter} from '../../server/model/encounter';
import {root} from './v2';

const useStyles = createUseStyles({
    grid: {
        height: '100vh',
        width: '100vw',
    },
});

export const Layout: FC = ({children}) => {
    const classes = useStyles();
    const {id} = usePlayerId();
    const {socket} = useBackend();
    const [encounter, setEncounter] = useState<Encounter | null>(null);

    useEffect(() => {
        const onEncounter = (state: string) => {
            const encounter = JSON.parse(state) as Encounter;
            setEncounter(encounter);
        };
        socket?.addEventListener('encounter', onEncounter);
        return () => {
            socket?.removeEventListener('encounter', onEncounter);
        };
    }, [socket]);

    return (
        <div className={classes.grid}>
            <Menu>
                <Container>
                    <Link to={root()} className={'header item'}>
                        <img src={icon} alt={'icon'}/>
                    </Link>
                    {encounter && (
                        <Menu.Item>
                            <span>
                            <Icon fitted name={'attention'} color={'orange'}/>
                            <Link to={root(`/campaign/${encounter.campaign.id}/encounter/${encounter.id}`)}
                            > {encounter.name} </Link>
                            <Icon fitted name={'attention'} color={'orange'}/>
                            </span>
                        </Menu.Item>
                    )}
                    <Menu.Item position={'right'}>
                        {/*TODO Use some logic to create this link*/}
                        <Link to={root(`/user/${id}/edit`)}>
                            <Icon name='user outline'/>
                        </Link>
                    </Menu.Item>
                </Container>
            </Menu>
            <Container>
                {children}
            </Container>
        </div>
    );
};
