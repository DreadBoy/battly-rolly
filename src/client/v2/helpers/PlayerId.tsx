import React, {createContext, FC, useCallback, useContext, useEffect, useState} from 'react';
import {useLocalStorage} from '../../common/use-local-storage';
import {useBackend} from './BackendProvider';
import {Splash} from '../../common/Splash';
import bg from '../../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Button} from 'semantic-ui-react';
import {User} from '../../../server/model/user';
import {Message} from '../../common/Message';

const playerIdContext = createContext<{ id: string }>(undefined as any);

export const PlayerIdProvider: FC = ({children}) => {
    const [init, setInit] = useState(false);
    const {value, set} = useLocalStorage('playerId');
    const {api} = useBackend();
    const connect = useCallback(() => {
        api.post<User>('/user')
            .then(res => {
                set(res.data.id)
            })
            .catch(e => alert(e));
    }, [api, set]);

    useEffect(() => {
        if (!value) return;
        api.defaults.headers.common['Authorization'] = value;
        setInit(true);
    }, [api.defaults.headers.common, value]);
    return (
        <playerIdContext.Provider value={{id: value || ''}}>
            {init ? children : (
                <Splash bg={bg} position={'88% center'} centered>
                    <Message>You haven't played on this device yet</Message>
                    <Button primary onClick={connect}>Create account</Button>
                    <Button disabled>Transfer from other device</Button>
                </Splash>
            )}
        </playerIdContext.Provider>
    )
};

export const usePlayerId = () => useContext(playerIdContext);
