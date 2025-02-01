import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';
import { TJson, parseJson } from '../helpers/json';


const defaultLoading = {
    globalvars: false
};

export class GlobalVarsProvider extends Loadable<typeof defaultLoading> implements vscode.TreeDataProvider<TJson<string>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<string> | undefined | void> = new vscode.EventEmitter<TJson<string> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<string> | undefined | void> = this._onDidChangeTreeData.event;

    globalVars: TJson<string>[] = [];

    public getGlobalVars(): TJson<string>[] {
        if (this.loading) return this.globalVars
        else return [];
    }

    constructor() {
        super();
        this.loading = defaultLoading;

        const copyCommand = vscode.commands.registerCommand('tech-platform.copyGlobalVarValue', (item: TJson<string>) => {
            if (item) {
                // Копируем текст элемента в буфер обмена
                vscode.env.clipboard.writeText(item.value as string).then(() => {
                    vscode.window.showInformationMessage(`Скопировано: ${item.value}`);
                });
            }
        });
    }

    @loadable("globalvars")
    @errorHandle()
    @successfullyNotify("Global vars loaded successfully")
    @log()
    async loadGlobalVars() {
        this.globalVars = [];
        const response = await fetch('http://em-user-api.service.cloudcore:10001/v1/global_vars/');
        const data: any = await response.json();
        this.globalVars = parseJson(data);
    }


    public refresh(): Promise<TJson<string>[]> {
        this.loadGlobalVars().then(() => this._onDidChangeTreeData.fire());
        return Promise.resolve(this.globalVars);
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
            return this.globalVars;
        }
        if (element.array) {
            return element.array;
        }
        return [];
    }
}

