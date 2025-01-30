import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';
import { TJson, parseJson } from '../helpers/json';


// type TGlobalVars  = {
//     name: string;
//     value?: string;
//     array?: TGlobalVars[] | undefined;
// };

const defaultLoading = {
    globalvars: false
};

export class GlobalVars extends Loadable<typeof defaultLoading> implements vscode.TreeDataProvider<TJson<string>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<string> | undefined | void> = new vscode.EventEmitter<TJson<string> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<string> | undefined | void> = this._onDidChangeTreeData.event;

    globalVars: TJson<string>[] = [];

    constructor() {
        super();
        this.loading = defaultLoading;
    }

    @loadable("globalvars")
    @errorHandle()
    @successfullyNotify("Global vars loaded successfully")
    @log()
    async loadGlobalVars() {
        const response = await fetch('http://em-user-api.service.cloudcore:10001/v1/global_vars/');
        const data: any = await response.json();
        this.globalVars = parseJson(data);
    }


    public refresh(): void {
        this.loadGlobalVars().then(() => this._onDidChangeTreeData.fire())
            .then(() => console.log('Global vars refreshed'));
    };


    static index: number = 0;
    public getTreeItem(element: TJson<string>): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: `${element.name} : ${element.value}`
        };

        treeItem.id = element.name + GlobalVars.index.toString();
        GlobalVars.index++;
        if (element.name.endsWith("GLOBAL")) {
            treeItem.label = "GLOBAL";
        }
        treeItem.collapsibleState = element.array ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element?: TJson<string>): TJson<string>[] {
        if (element === undefined) {
            return this.globalVars;
        }
        if (element.array) {
            return element.array;
        }
        return [];
    }
}

export function getGlobalVars() {
    const extensionAvailable = new GlobalVars();
    extensionAvailable.loadGlobalVars().then(() => {
        const treeDataProvider = vscode.window.createTreeView('vk-tp.globalVars', {
            treeDataProvider: extensionAvailable
        });
        treeDataProvider.reveal(extensionAvailable.globalVars![0]);
    });
}
