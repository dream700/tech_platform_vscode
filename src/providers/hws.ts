import * as vscode from 'vscode';
import { TJson } from '../helpers/json';
import { APINodeManager } from '../api/NodeManager';
import { dsHWs, HW } from '../datastore/dsHWs';

export class HWsProvider implements vscode.TreeDataProvider<TJson<HW>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<HW> | undefined | void> = new vscode.EventEmitter<TJson<HW> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<HW> | undefined | void> = this._onDidChangeTreeData.event;

    hws: dsHWs; 

    constructor() {
        this.hws = new dsHWs();
        const copyCommand = vscode.commands.registerCommand('tech-platform.sshSession', (item: TJson<HW>) => {
            if (item && item.value?.ipaddr !== undefined) {
                const sshKey = vscode.workspace.getConfiguration('tech-platform').sshSession;
                let sshCommand = `ssh -i ${sshKey} -o StrictHostKeyChecking=no redos@${item.value?.ipaddr}`;
                const terminal = vscode.window.createTerminal('SSH Terminal');
                terminal.sendText(sshCommand);
                terminal.show();
                // vscode.window.showInformationMessage(`Open ssh session: ${item.value?.ipaddr}`);
            }
        });
    }

    public refresh(): Promise<void> {
        return new Promise((resolve) => {
            this.hws.getHWs().then(() => {
                this._onDidChangeTreeData.fire();
                resolve();
            });
        });
    }

    public getTreeItem(element: TJson<HW>): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: `${element.key} : ${element.value}`
        };
        if (element.value === undefined || typeof element.value === "object") {
            treeItem.label = element.key;
        }
        if (element. value?.ipaddr !== undefined) {
            treeItem.contextValue = "ipv4";
        }
        treeItem.collapsibleState = element.array ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element: TJson<HW>): Thenable<TJson<HW>[]> | undefined {
        if (element === undefined) {
            return this.hws.gethws();
        }
        if (element.array) {
            return this.hws.getVMs(element);
        }
        Promise.resolve([]);
    }
}
