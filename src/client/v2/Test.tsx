import React, {FC} from 'react';
import {Splash} from '../common/Splash';
import bg from '../../assets/20-205533_paper-dungeons-hd-wallpaper-hd-d-d-desktop.jpg';
import {usePlayerId} from './helpers/PlayerId';

export const Test: FC = () => {
    const {id} = usePlayerId();
    return (
        <Splash bg={bg} position={'88% center'}>
            v2 => {id}
        </Splash>
    );
};
