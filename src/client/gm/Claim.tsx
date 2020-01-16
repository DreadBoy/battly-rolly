import React, {FC, useEffect} from 'react';
import {Header} from 'semantic-ui-react';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {Splash} from '../common/Splash';
import {useSocket} from '../common/Socket';

export const Claim: FC = () => {
    const {connected, claim, claimed} = useSocket();
    useEffect(() => {
        if (connected && !claimed)
            claim();
    }, [connected, claimed, claim]);
    return (
        <Splash bg={bg} position={'88% center'}>
            <Header as='h1'>Claiming role as GM</Header>
        </Splash>
    );
};
