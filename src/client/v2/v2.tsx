import React, {FC} from 'react';
import {PlayerIdProvider} from './helpers/PlayerId';
import {BackendProvider} from './helpers/BackendProvider';
import {Test} from './Test';

export const V2: FC = () => {
    return (
        <BackendProvider>
            <PlayerIdProvider>
                <Test/>
            </PlayerIdProvider>
        </BackendProvider>
    );
};
