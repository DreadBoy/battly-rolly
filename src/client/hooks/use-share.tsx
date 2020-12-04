import React, {FC, useCallback} from 'react';
import {Message} from 'semantic-ui-react';
import {createUseStyles} from 'react-jss';

export type Config = {
    title: string,
    url: string,
}

export type ShareResult = {
    silent: boolean,
}

export function useShare(data: Config) {
    return useCallback((): Promise<ShareResult> => {
        const text = `${data.title} ${data.url}`;
        if (navigator.share && navigator.canShare && navigator.canShare(data)) {
            return navigator.share(data)
                .then(() => ({
                    silent: false,
                }));
        } else if (navigator.clipboard) {
            return navigator.clipboard.writeText(text)
                .then(() => ({
                    silent: true,
                }))
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // Avoid scrolling to bottom
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            return Promise.resolve()
                .then(() => document.execCommand('copy'))
                .then(() => ({
                    silent: true,
                }))
                .finally(() => document.body.removeChild(textArea))
        }
    }, [data]);
}

const useStyles = createUseStyles({
    message: {
        '.ui.message&': {
            margin: 0,
            padding: '0.885714em 1.5em',
        },
    },
});

export const SilentShareMessage: FC<{ result: ShareResult }> = ({result}) => {
    const classes = useStyles();
    return result?.silent ? (
        <Message compact positive size={'mini'} className={classes.message}>
            Link was copied to your clipboard!
        </Message>
    ) : null;
};
