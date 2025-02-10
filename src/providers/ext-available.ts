import * as vscode from 'vscode';
import { dsExtensionsIndexJson } from '../datastore/ext-index';
import { dsExtensionInfo } from '../datastore/dsExtensionInfo';
import { dsExtensionAvailable } from '../datastore/dsExtAvailable';
import { formatDateString } from '../helpers/json';
import { GlobalVars } from '../extension';
import { RepositoryAPI } from '../api/Repository';

export class ExtensionAvailableProvider implements vscode.TreeDataProvider<dsExtensionInfo> {
    private _onDidChangeTreeData: vscode.EventEmitter<dsExtensionInfo | undefined | void> = new vscode.EventEmitter<dsExtensionInfo | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<dsExtensionInfo | undefined | void> = this._onDidChangeTreeData.event;

    extensions: dsExtensionAvailable;

    constructor() {
        this.extensions = new dsExtensionAvailable();
        const copyCommand = vscode.commands.registerCommand('tech-platform.InstallExtension', (item: dsExtensionInfo) => {
            if (item && item.uuid === undefined) {
                vscode.window.showInformationMessage(`Select version extension ${item.name} for installing.`,"Error");
                return;
            }
            if (item && item.uuid !== undefined) {
                vscode.window.showInformationMessage(`Installing Extension: ${item.name} ${item.version}`);
            }
        });
        const openManifest = vscode.commands.registerCommand('tech-platform.OpenManifest', (item: dsExtensionInfo) => {
            if (item && item.uuid !== undefined) {
                                const urlRepository = GlobalVars.globalVarsEndPoints.get("Repository");
                                if (urlRepository) {
                                    const user_api_url = urlRepository.get("user_api_url");
                                    if (user_api_url) {
                                        let v = new RepositoryAPI();
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
        return new Promise((resolve, reject) => {
            this.extensions.refreshExtensionsAvailable().then(() => this._onDidChangeTreeData.fire())
            .then(() => {
                const extIndex = new dsExtensionsIndexJson();
                console.log('Extensions index download');
                return resolve();
            }
            ).catch((err: any) => reject(err));    
        });
    }

    static index: number = 0;
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
    public getChildren(element: dsExtensionInfo): dsExtensionInfo[] | Thenable<dsExtensionInfo[]> | undefined {
        if (element === undefined) {
            return this.extensions.getExtensionsAvailable();
        }
        if (element.uuid === undefined) {
            return element.getExtensionInfo();
        }
        return [];
    }
}
