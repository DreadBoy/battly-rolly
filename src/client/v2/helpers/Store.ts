import {action, observable} from 'mobx';
import {AxiosPromise} from 'axios';
import {useState} from 'react';

export type Silent = 'silent' | undefined;
type Obj<T> = { [id: string]: T };

export class Store<T> {
    @observable public loading: Obj<boolean> = {};
    @observable public error: Obj<Error> = {};
    @observable public data: Obj<T> = {};

    @action
    public async fetchAsync(request: AxiosPromise<T>, uuid: string, silent?: Silent) {
        const isSilent = silent === 'silent';
        if (!isSilent) {
            this.loading[uuid] = true;
            delete this.data[uuid];
            delete this.error[uuid];
        }

        try {
            const response = await request;
            this.data[uuid] = response.data;
            this.loading[uuid] = false;
        } catch (e) {
            let error = e;
            if (e.response && e.response.data)
                error = e.response.data;
            console.error(error);
            this.error[uuid] = error;
            this.loading[uuid] = false;
            throw error;
        }
        return this.data[uuid];
    }

    @action
    public fetch(request: AxiosPromise<T>, uuid: string, silent?: Silent) {
        this.fetchAsync(request, uuid, silent).catch(() => undefined);
    }

    @action
    public reset() {
        this.data = {};
        this.error = {};
        this.loading = {};
    }
}

export const useSimpleStore = () => useState<Store<null>>(new Store<null>())[0];
