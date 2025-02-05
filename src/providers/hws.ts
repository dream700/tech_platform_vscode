import * as vscode from 'vscode';
import { TJson } from '../helpers/json';
import { dsNodeManger } from '../datastore/dsNodeManager';
import { HW } from '../datastore/dsHWs';

export class HWsProvider implements vscode.TreeDataProvider<TJson<HW>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<HW> | undefined | void> = new vscode.EventEmitter<TJson<HW> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<HW> | undefined | void> = this._onDidChangeTreeData.event;

    hws: dsNodeManger = new dsNodeManger();

    // @log()
    public refresh(): Promise<void> {
        return new Promise((resolve) => {
            this.hws.getHWs().then(() => {
                this._onDidChangeTreeData.fire();
                resolve();
            });
        });
    }

    static index: number = 0;
    public getTreeItem(element: TJson<HW>): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: `${element.key} : ${element.value}`
        };
        if (element.value === undefined) {
            treeItem.label = element.key;
        }
        treeItem.collapsibleState = element.array ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element: TJson<HW>): TJson<HW>[] | undefined{
        if (element === undefined) {
            return this.hws.hws();
        }
        if (element.array !== undefined) {
            return element.array;
        }
        return [];
    }
}
