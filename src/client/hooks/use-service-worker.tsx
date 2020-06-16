import React, {createContext, FC, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {register} from '../serviceWorker';

export type ServiceWorkerContext = {
    isUpdateAvailable: boolean,
    update: () => void,
}
const serviceWorkerContext = createContext<ServiceWorkerContext | null>(null);

/// https://medium.com/@FezVrasta/service-worker-updates-and-error-handling-with-react-1a3730800e6a
export const ServiceWorkerProvider: FC = ({children}) => {
    const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
    const [isUpdateAvailable, setUpdateAvailable] = useState<boolean>(false);

    useEffect(() => {
        register({
            onUpdate: registration => {
                setWaitingServiceWorker(registration.waiting);
                setUpdateAvailable(true);
            },
            onWaiting: waiting => {
                setWaitingServiceWorker(waiting);
                setUpdateAvailable(true);
            },
        });
    }, []);

    const stateChange = useCallback(event => {
        if (event?.target?.state === 'activated') {
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        // We setup an event listener to automatically reload the page
        // after the Service Worker has been updated, this will trigger
        // on all the open tabs of our application, so that we don't leave
        // any tab in an incosistent state
        waitingServiceWorker?.addEventListener('statechange', stateChange);
        return () => waitingServiceWorker?.removeEventListener('statechange', stateChange);
    }, [stateChange, waitingServiceWorker]);

    const value = useMemo(() => ({
        isUpdateAvailable,
        update: () => {
            if (waitingServiceWorker) {
                // We send the SKIP_WAITING message to tell the Service Worker
                // to update its cache and flush the old one
                waitingServiceWorker.postMessage({type: 'SKIP_WAITING'});
            }
        },
    }), [isUpdateAvailable, waitingServiceWorker]);

    return (
        <serviceWorkerContext.Provider value={value}>
            {children}
        </serviceWorkerContext.Provider>
    );
}

// With this React Hook we'll be able to access `isUpdateAvailable` and `update`
export const useServiceWorker = () => {
    const ctx = useContext(serviceWorkerContext);
    if (!ctx)
        throw new Error('useServiceWorker must be used within a ServiceWorkerProvider.')
    return ctx;
}
