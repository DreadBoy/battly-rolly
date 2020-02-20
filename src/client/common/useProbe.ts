import {useCallback, useEffect, useState} from 'react';
import Axios from 'axios';

export function useProbe() {
    const [status, setStatus] = useState<'none' | 'probing' | 'success' | 'failure'>('none');
    const [origin, setOrigin] = useState<string>('');
    useEffect(() => {
        const port = process.env.REACT_APP_API_PORT ? `:${process.env.REACT_APP_API_PORT}` : ':3000';
        setOrigin(`${window.location.protocol}//${window.location.hostname}${port}`);
    }, []);

    const check = useCallback(async () => {
        if (origin.length === 0)
            return;
        setStatus('probing');
        const res = await Axios.get(`${origin}/probe`);
        if (res.status !== 200)
            throw new Error();
        setStatus('success');
    }, [origin]);
    useEffect(() => {
        check().catch(() => setStatus('failure'));
    }, [check]);
    return {status, origin, setOrigin};
}
