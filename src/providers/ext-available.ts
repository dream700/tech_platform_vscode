import * as vscode from 'vscode';
import { loadable, Loadable } from '../decorators/loadable';
import { errorHandle } from '../decorators/errorHandle';
import { successfullyNotify } from '../decorators/successfully';
import { log } from '../decorators/log';
import { ExtIndexProvider } from './ext-index';
import { TJson } from '../helpers/json';
import { Extension } from './extension';

const defaultLoading = {
    extensions: false,
};

export class ExtensionAvailableProvider extends Loadable<typeof defaultLoading> implements vscode.TreeDataProvider<Extension> {
    private _onDidChangeTreeData: vscode.EventEmitter<Extension | undefined | void> = new vscode.EventEmitter<Extension | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<Extension | undefined | void> = this._onDidChangeTreeData.event;

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
        this.extensions = [];
        const response = await fetch('http://em-user-api.service.cloudcore:10001/v1/extensions/available/');
        const data: any = await response.json();
        for (const pack of data) {
            let requiresItem = new Extension(pack);
            this.extensions.push(requiresItem);
        };
    }

    public refresh(globalVars: TJson<string>[]): Promise<void> {
        this.loadExtensions().then(() => this._onDidChangeTreeData.fire())
            .then(() => {
                const extIndex = new ExtIndexProvider();
                console.log('Extensions index download');
                return Promise.resolve();
            }
            ).catch((err: any) => Promise.reject(err));
        return Promise.resolve();
    }

    static index: number = 0;
    public getTreeItem(element: Extension): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };
        if (element.version !== undefined) {
            treeItem.label = ` v${element.version}`;
        }
        treeItem.collapsibleState = element.version ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed;
        treeItem.id = element.name + ExtensionAvailableProvider.index.toString();
        ExtensionAvailableProvider.index++;
        return treeItem;
    }
    public getChildren(element: Extension): Thenable<Extension[]> | undefined {
        if (element === undefined) {
            return Promise.resolve(this.extensions);
        }
        if (element.uuid === undefined) {
            return element.getExtensionInfo();
        }
        Promise.resolve([]);
    }
}
