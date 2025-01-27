import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';

type TGlobalVars = {
    name: string;
    value?: string;
    vars?: TGlobalVars[] | undefined;
};

const defaultLoading = {
    globalvars: false
};

export class GlobalVars extends Loadable<typeof defaultLoading> implements vscode.TreeDataProvider<TGlobalVars> {
    private _onDidChangeTreeData: vscode.EventEmitter<TGlobalVars | undefined | void> = new vscode.EventEmitter<TGlobalVars | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TGlobalVars | undefined | void> = this._onDidChangeTreeData.event;

    globalVars: TGlobalVars[] = [];

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
        this.globalVars = this.parseJson(data);
    }
    private parseJson(json: any, parentLabel: string = 'Root'): TGlobalVars[] {
        const items: TGlobalVars[] = [];
        if (typeof json === 'object' && json !== null) {
            for (const key in json) {
                const value = json[key];
                const item: TGlobalVars = { name: key };
                if (typeof value === 'object' && value !== null) {
                    item.vars = this.parseJson(value, key);
                } else {
                    item.name += `: ${value}`;
                }
                items.push(item);
            }
        }
        return items;
    }

    public refresh(): void {
        this.loadGlobalVars().then(() => this._onDidChangeTreeData.fire());
    }

    static index: number = 0;
    public getTreeItem(element: TGlobalVars): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };

        treeItem.id = element.name + GlobalVars.index.toString();
        GlobalVars.index++;
        // if (element.name?.endsWith("GLOBAL")) {
        //     treeItem.contextValue = "root";
        // } else {
        //     treeItem.contextValue = "extension";
        // }
        treeItem.collapsibleState = element.vars ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element?: TGlobalVars): TGlobalVars[] {
        if (element === undefined) {
            return this.globalVars;
        }
        if (element.vars) {
            return element.vars;
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
