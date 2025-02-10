import { dsExtensionInfo } from "../datastore/dsExtensionInfo";
import { dsInstalledExtension } from "../datastore/dsInstExtension";
import { formatDateString, TJson } from "../helpers/json";
import * as vscode from 'vscode';

export class InstalledExtensionProvider implements vscode.TreeDataProvider<dsExtensionInfo> {
    private _onDidChangeTreeData: vscode.EventEmitter<dsExtensionInfo | undefined | void> = new vscode.EventEmitter<dsExtensionInfo | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<dsExtensionInfo | undefined | void> = this._onDidChangeTreeData.event;

    extensions: dsInstalledExtension;
    constructor() {
        this.extensions = new dsInstalledExtension();
    }

    public refresh(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.extensions.refreshInstalledExtensions().then(() => this._onDidChangeTreeData.fire())
                .then(() => {
                    //   const extIndex = new dsExtensionsIndexJson();
                    //   console.log('Extensions index download');
                    return resolve();
                }
                ).catch((err: any) => reject(err));
        });
    }


    public getTreeItem(element: dsExtensionInfo): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };
        if (element.version !== undefined) {
            treeItem.label = ` v${element.version} (${formatDateString(element?.update)})`;
        }
        treeItem.collapsibleState = element.version ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed;
        return treeItem;
    }
    public getChildren(element?: dsExtensionInfo): dsExtensionInfo[] | Thenable<dsExtensionInfo[]> | undefined {
        if (element === undefined) {
            return this.extensions.getInstalledExtensions();
        }
        if (element.extensions) {
            return element.getExtensionInfo();
        }
        return [];
    }
}