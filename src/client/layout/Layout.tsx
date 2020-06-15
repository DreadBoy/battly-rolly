import React, {FC, useCallback} from 'react';
import {Container, Dropdown, Icon, Menu, Responsive} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';
import icon from '../../assets/dice-twenty-faces-twenty.svg';
import {Link, Redirect} from 'react-router-dom';
import {usePlayerId} from '../helpers/PlayerId';
import {useBackend} from '../helpers/BackendProvider';
import {useLoader} from '../helpers/Store';
import {root} from '../App';
import {useGlobalStore} from '../helpers/GlobalStore';
import {find} from 'lodash';
import {observer} from 'mobx-react';
import {UpdateButton} from './UpdateButton';

const useStyles = createUseStyles({
    grid: {
        height: '100vh',
        width: '100vw',
    },
    link: {
        'a&': {
            color: 'rgba(0,0,0,.87)',
            textDecoration: 'none',
        },
    },
    logo: {
        display: 'block',
        width: '1.6em',
    },
    flex: {
        flex: 1,
    },
    border: {
        top: 0,
        right: 0,
        height: '100%',
        width: 1,
        background: 'rgba(34,36,38,.1)',
    },
    fakeItem: {
        width: 44.25,
    },
    menu: {
        width: '100vw',
    },
    noBorder: {
        '.ui.menu &.item:before': {
            display: 'none',
        },
    },
});

export const Layout: FC = observer(({children}) => {
    const classes = useStyles();
    const {id, onLogin} = usePlayerId();
    const {api} = useBackend();

    const globalStore = useGlobalStore();
    const encounter = find(Object.values(globalStore.data), ['active', true]);

    const loader = useLoader();
    const logout = useCallback(() => {
        loader.fetchAsync(api.delete('/auth'), 'logout')
            .then(() => onLogin(null))
            .catch(e => e);
    }, [api, loader, onLogin]);

    if (!!loader.data['logout'])
        return <Redirect to={root('/login')}/>

    return (
        <div className={classes.grid}>
            <Responsive minWidth={640} as={Menu}>
                <Container>
                    <Menu.Item header>
                        <img src={icon} alt={'icon'} title={`App version: ${process.env.REACT_APP_APP_VERSION}`}/>
                    </Menu.Item>
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
                    <Menu.Item>
                        <Link className={classes.link} to={root('/campaign')}>Campaigns</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link className={classes.link} to={root('/monster')}>Monsters</Link>
                    </Menu.Item>
                    <Menu.Menu position={'right'}>
                        <Dropdown icon={'user outline'} item>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <Link className={classes.link} to={root(`/user/${id}`)}>
                                        Profile
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={logout}>
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Container>
            </Responsive>
            <Responsive maxWidth={439} as={Menu}>
                <Container>
                    <Dropdown icon={'bars'} item>
                        <Dropdown.Menu className={classes.menu}>
                            <Dropdown.Item>
                                <Link className={classes.link} to={root('/campaign')}>Campaigns</Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Link className={classes.link} to={root('/monster')}>Monsters</Link>
                            </Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item>
                                <Link className={classes.link} to={root(`/user/${id}`)}>
                                    Profile
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={logout}>
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className={classes.flex}/>
                    {encounter ? (
                        <Menu.Item className={classes.noBorder}>
                            <span>
                            <Icon fitted name={'attention'} color={'orange'}/>
                            <Link to={root(`/campaign/${encounter.campaign.id}/encounter/${encounter.id}`)}
                            > {encounter.name} </Link>
                            <Icon fitted name={'attention'} color={'orange'}/>
                            </span>
                        </Menu.Item>
                    ) : (
                        <img src={icon} alt={'icon'} className={classes.logo}/>
                    )}
                    <div className={classes.flex}/>
                    <Menu.Item className={classes.fakeItem}/>
                </Container>
            </Responsive>
            <Container>
                {children}
                <UpdateButton/>
            </Container>
        </div>
    );
});
