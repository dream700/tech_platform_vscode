import * as vscode from 'vscode';
import { dsExtensionsIndexJson } from '../datastore/ext-index';
import { dsExtension } from '../datastore/dsExtension';
import { dsExtensionAvailable } from '../datastore/dsExtAvailable';
import { formatDateString } from '../helpers/json';
import { GlobalVars } from '../extension';
import { APIRepository } from '../api/Repository';

export class ExtensionAvailableProvider implements vscode.TreeDataProvider<dsExtension> {
    private _onDidChangeTreeData: vscode.EventEmitter<dsExtension | undefined | void> = new vscode.EventEmitter<dsExtension | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<dsExtension | undefined | void> = this._onDidChangeTreeData.event;

    extensions: dsExtensionAvailable;

    constructor() {
        this.extensions = new dsExtensionAvailable();
        const copyCommand = vscode.commands.registerCommand('tech-platform.InstallExtension', (item: dsExtension) => {
            if (item && item.uuid === undefined) {
                vscode.window.showInformationMessage(`Select version extension ${item.name} for installing.`,"Error");
                return;
            }
            if (item && item.uuid !== undefined) {
                vscode.window.showInformationMessage(`Installing Extension: ${item.name} ${item.version}`);
            }
        });
        const openManifest = vscode.commands.registerCommand('tech-platform.OpenManifest', (item: dsExtension) => {
            if (item && item.uuid !== undefined) {
                                const urlRepository = GlobalVars.globalVarsEndPoints.get("Repository");
                                if (urlRepository) {
                                    const user_api_url = urlRepository.get("user_api_url");
                                    if (user_api_url) {
                                        let v = new APIRepository();
                                        v.loadManifest(user_api_url, item.uuid).then(res => {
                                            vscode.workspace.openTextDocument({ content: res, language: 'yaml' }).then(doc => {
                                                return vscode.window.showTextDocument(doc);    
                                            });                                            
                                        });
                                    }
                                }
                


                vscode.window.showInformationMessage(`Open manifest: ${item.name} ${item.version}`);
            }
        });

    }

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
            treeItem.label = ` v${element.version} (${formatDateString(element?.update)})`;
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
