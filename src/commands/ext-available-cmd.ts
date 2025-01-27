import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';

export type Extension = {
    name: string;
    version?: string;
    extensions?: Extension[] | undefined;
};

const defaultLoading = {
    extensions: false,
};

export class ExtensionAvailable extends Loadable<typeof defaultLoading> implements vscode.TreeDataProvider<Extension> {
    extensions: Extension[] = [];
    constructor() {
        super();
        this.loading = defaultLoading;
    }

    @loadable("extensions")
    @errorHandle()
    @successfullyNotify("Available extensions loaded successfully")
    @log()
    async loadExtensions() {
        const response = await fetch('http://em-user-api.service.cloudcore:10001/v1/extensions/available/');
        const data: any = await response.json();
        for (var pack of data) {
            let requiresItem = { name: pack };
            this.extensions.push(requiresItem);
        };
    }

    static index: number = 0;
    public getTreeItem(element: Extension): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };
        treeItem.id = element.name + ExtensionAvailable.index.toString();
        ExtensionAvailable.index++;
        treeItem.collapsibleState = element.extensions ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element?: Extension): Extension[] {
        if (element === undefined) {
            return this.extensions;
        }
        if (element.extensions) {
            return element.extensions;
        }
        return [];
    }
}

export function getExtensionAvailable() {
    const extensionAvailable = new ExtensionAvailable();
    extensionAvailable.loadExtensions().then(() => {
        const treeDataProvider = vscode.window.createTreeView('vk-tp.extension', {
            treeDataProvider: extensionAvailable
        });
        treeDataProvider.reveal(extensionAvailable.extensions![0]);
    });
}
