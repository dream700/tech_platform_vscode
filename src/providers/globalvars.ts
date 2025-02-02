import * as vscode from 'vscode';
import { TJson } from '../helpers/json';
import { dsGlobalVarsProvider } from '../datastore/dsGlobalVars';

export class GlobalVarsProvider implements vscode.TreeDataProvider<TJson<string>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<string> | undefined | void> = new vscode.EventEmitter<TJson<string> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<string> | undefined | void> = this._onDidChangeTreeData.event;

    globalVars: dsGlobalVarsProvider;

    constructor() {
        this.globalVars = new dsGlobalVarsProvider();
        const copyCommand = vscode.commands.registerCommand('tech-platform.copyGlobalVarValue', (item: TJson<string>) => {
            if (item) {
                // Копируем текст элемента в буфер обмена
                vscode.env.clipboard.writeText(item.value as string).then(() => {
                    vscode.window.showInformationMessage(`Скопировано: ${item.value}`);
                });
            }
        });
    }

    public refresh(): TJson<string>[] {
        this.globalVars.loadGlobalVars().then(() => this._onDidChangeTreeData.fire());        ;
        return this.globalVars.getGlobalVars();
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
    public getChildren(element?: TJson<string>): Promise<TJson<string>[]> | TJson<string>[] {
        if (element === undefined) {
            return this.globalVars.getGlobalVars();
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

