import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';
import { TJson, parseJson } from '../helpers/json';

const defaultLoading = {
    globalvars: false
};

export var globalVars: TJson<string>[] = [];

export class dsGlobalVarsProvider extends Loadable<typeof defaultLoading> {

    public getGlobalVars(): TJson<string>[] {
        return globalVars;
    }

    constructor() {
        super();
        this.loading = defaultLoading;
    }

    @loadable("globalvars")
    @errorHandle()
    @successfullyNotify("Global vars loaded successfully")
    @log()
    async loadGlobalVars() {
        globalVars = [];
        const response = await fetch('http://em-user-api.service.cloudcore:10001/v1/global_vars/');
        const data: any = await response.json();
        globalVars = parseJson(data);
    }
}

