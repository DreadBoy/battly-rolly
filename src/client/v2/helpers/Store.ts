import {action, observable} from 'mobx';
import {AxiosPromise} from 'axios';

export type Silent = 'silent' | undefined;
type Obj<T> = { [id: string]: T };

export class Store<T> {
    @observable public loading: Obj<boolean> = {};
    @observable public error: Obj<Error> = {};
    @observable public data: Obj<T> = {};

    @action
    public fetch(request: AxiosPromise<T>, uuid: string, silent?: Silent) {
        const isSilent = silent === 'silent';
        if (!isSilent) {
            this.loading[uuid] = true;
            delete this.data[uuid];
            delete this.error[uuid];
        }

        request
            .then(response => {
                this.data[uuid] = response.data;
                this.loading[uuid] = false;
            })
            .catch(e => {
                if (e.response && e.response.data)
                    e = e.response.data;
                console.error(e);
                this.error[uuid] = e;
                this.loading[uuid] = false;
            });
    }

    @action
    public reset() {
        this.data = {};
        this.error = {};
        this.loading = {};
    }
}
