import * as vscode from 'vscode';
import { log } from '../decorators/log';
import { dsExtensionsIndexJson } from '../datastore/ext-index';
import { TJson } from '../helpers/json';
import { dsExtension } from '../datastore/dsExtension';
import { dsExtensionAvailable } from '../datastore/dsExtAvailable';

export class ExtensionAvailableProvider implements vscode.TreeDataProvider<dsExtension> {
    private _onDidChangeTreeData: vscode.EventEmitter<dsExtension | undefined | void> = new vscode.EventEmitter<dsExtension | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<dsExtension | undefined | void> = this._onDidChangeTreeData.event;

    extensions: dsExtensionAvailable;

    constructor() {
        this.extensions = new dsExtensionAvailable();
    }

    @log()
    public refresh(): Promise<void> {
        this.extensions.loadExtensions().then(() => this._onDidChangeTreeData.fire())
            .then(() => {
                const extIndex = new dsExtensionsIndexJson();
                console.log('Extensions index download');
                return Promise.resolve();
            }
            ).catch((err: any) => Promise.reject(err));
        return Promise.resolve();
    }

    static index: number = 0;
    public getTreeItem(element: dsExtension): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };
        if (element.version !== undefined) {
            treeItem.label = ` v${element.version}`;
        }
        treeItem.collapsibleState = element.version ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed;
        return treeItem;
    }
    public getChildren(element: dsExtension): Thenable<dsExtension[]> | undefined {
        if (element === undefined) {
            return Promise.resolve(this.extensions.getExtensions());
        }
        if (element.uuid === undefined) {
            return element.getExtensionInfo();
        }
        Promise.resolve([]);
    }
}
