import * as vscode from 'vscode';
import { TJson } from '../helpers/json';
import { dsGlobalVars } from '../datastore/dsGlobalVars';
import { GlobalVars } from '../extension';

export class GlobalVarsProvider implements vscode.TreeDataProvider<TJson<string>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<string> | undefined | void> = new vscode.EventEmitter<TJson<string> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<string> | undefined | void> = this._onDidChangeTreeData.event;

    globalVars: dsGlobalVars;

    constructor() {
        this.globalVars = new dsGlobalVars();
        const copyCommand = vscode.commands.registerCommand('tech-platform.copyGlobalVarValue', (item: TJson<string>) => {
            if (item) {
                // Копируем текст элемента в буфер обмена
                vscode.env.clipboard.writeText(item.value as string).then(() => {
                    vscode.window.showInformationMessage(`Скопировано: ${item.value}`);
                });
            }
        });
    }
    // @log()
    public refresh(): Promise<void> {
        return new Promise((resolve) => {
            this.globalVars.loadGlobalVars()
                .then(() => {
                    this._onDidChangeTreeData.fire();
                    resolve();
            });
        });;
    };


    static index: number = 0;
    public getTreeItem(element: TJson<string>): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: `${element.key} : ${element.value}`
        };

        treeItem.id = element.key + GlobalVarsProvider.index.toString();
        GlobalVarsProvider.index++;
        if (element.value === undefined ) {
            treeItem.label = element.key;
        }
        treeItem.collapsibleState = element.array ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element?: TJson<string>): TJson<string>[] {
        if (element === undefined) {
            return GlobalVars.GetGlobalVarsToArray();
        }
        if (element.array) {
            return element.array;
        }
        return [];
    }

    public getParent(element: TJson<string>): TJson<string> | undefined {
        return ;
    }
}

