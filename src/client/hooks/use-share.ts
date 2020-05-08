import {useCallback} from 'react';

export type Config = {
    title: string,
    url: string,
}

export function useShare(config: Config) {
    const canShare = navigator.share && navigator.canShare;
    const share = useCallback(() => {
        if (!navigator.share || !navigator.canShare) return;
        const data = config;
        if (navigator.canShare(data))
            navigator.share(data).catch((e) => console.error(e));
    }, [config]);

    return {
        canShare,
        share,
    };
}
