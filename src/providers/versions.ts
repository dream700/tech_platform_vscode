import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';
import { TJson, parseJson } from '../helpers/json';



const defaultLoading = {
    versions: false
};

export class VersionsProvider extends Loadable<typeof defaultLoading> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<string> | undefined | void> = new vscode.EventEmitter<TJson<string> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<string> | undefined | void> = this._onDidChangeTreeData.event;

    versions: TJson<string>[] = [];
    urlRepository: string;
    extName: string;

    constructor(urlRepository: string, extName: string) {
        super();
        this.loading = defaultLoading;

        this.urlRepository = urlRepository;
        this.extName = extName;
    }
    @loadable("versions")
    @errorHandle()
    @successfullyNotify(`Versions of loaded successfully`)
    @log()
    async loadGlobalVars() {
        this.versions = [];
        const response = await fetch('${this.urlRepository}/v1/extensions/?name=${this.extName}');
        const data: any = await response.json();
        this.versions = parseJson(data);
        return Promise.resolve(this.versions);
    }

}