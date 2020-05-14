import {useLoader} from '../helpers/Store';
import {useCallback} from 'react';
import {useBackend} from '../helpers/BackendProvider';

export function useResetPassword(email: string) {
    const {api} = useBackend();

    const resetLoader = useLoader();
    const resetId = 'reset';
    const resetPass = useCallback(() => {
        resetLoader.fetch(api.delete('/auth/reset-password', {params: {email}}), resetId);
    }, [api, email, resetLoader]);
    return {
        reset: resetPass,
        loading: resetLoader.loading[resetId],
        data: resetLoader.data[resetId],
        error: resetLoader.error[resetId],
    }
}

export const successMessage = 'Further instructions on how to reset your password has been sent to your inbox.';
