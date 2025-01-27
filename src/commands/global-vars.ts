import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';

export type TGlobalVars = {
    name: string;
    value: string;
    vars: TGlobalVars[] | undefined;
};

const defaultLoading = {
    globalvars: false
};

export class GlobalVars extends Loadable<typeof defaultLoading> implements vscode.TreeDataProvider<TGlobalVars> {
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
        this.globalVars = data;
    }

    static index: number = 0;
    public getTreeItem(element: TGlobalVars): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };

        treeItem.id = element.name + GlobalVars.index.toString();
        GlobalVars.index++;
        if (element.name?.endsWith("GLOBAL VARS")) {
            treeItem.contextValue = "root";
        } else {
            treeItem.contextValue = "extension";
        }
        treeItem.collapsibleState = element.vars ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element?: TGlobalVars): TGlobalVars[] {
        if (element === undefined) {
            return [ {name: 'GLOBAL VARS', value : '', vars: this.globalVars } ];
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
