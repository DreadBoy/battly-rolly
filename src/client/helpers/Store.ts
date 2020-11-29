import {useLocalObservable} from 'mobx-react';
import {AxiosPromise} from 'axios';

export type Silent = 'silent' | undefined;
type Obj<T = any> = { [id: string]: T };
type Model = { id: string };

export function createStore() {
    return {
        loading: {} as Obj,
        error: {} as Obj,
        data: {} as Obj,
        set<T extends Model>(obj: T) {
            this.data[obj.id] = obj;
        },
        get<T>(id: string) {
            return this.data[id] as T;
        },
        async fetchAsync(request: AxiosPromise, uuid: string, silent?: Silent) {
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
        },
        fetch(request: AxiosPromise, uuid: string, silent?: Silent) {
            this.fetchAsync(request, uuid, silent).catch(() => undefined);
        },
        reset() {
            this.data = {};
            this.error = {};
            this.loading = {};
        },
    };
}

export type TStore = ReturnType<typeof createStore>;

export function useLoader() {
    return useLocalObservable(createStore);
}
