import * as vscode from 'vscode';
import { TJson } from '../helpers/json';
import { NodeManagerAPI } from '../api/NodeManager';
import { dsInstances, Instance } from '../datastore/dsInstances';

export class HWsProvider implements vscode.TreeDataProvider<TJson<Instance>> {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<Instance> | undefined | void> = new vscode.EventEmitter<TJson<Instance> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<Instance> | undefined | void> = this._onDidChangeTreeData.event;

    instances: dsInstances;

    constructor() {
        this.instances = new dsInstances();
        vscode.commands.registerCommand('tech-platform.sshSession', (item: TJson<Instance>) => {
            if (item && item.value?.ipaddr !== undefined) {
                let sshOptions = vscode.workspace.getConfiguration('tech-platform').sshSession;
                if (sshOptions===undefined) {
                    sshOptions = "";
                }
                let sshCommand = `ssh ${sshOptions} redos@${item.value?.ipaddr}`;
                let terminalName = item.value?.name;
                if (terminalName===undefined) {
                    terminalName = 'SSH';
                }
                const terminal = vscode.window.createTerminal(terminalName,'/bin/sh');
                terminal.sendText(sshCommand);
                terminal.show();
            }
        });
    }

    public refresh(): Promise<void> {
        return new Promise((resolve) => {
            this.instances.refreshInstances().then(() => {
                this._onDidChangeTreeData.fire();
                resolve();
            });
        });
    }

    public getTreeItem(element: TJson<Instance>): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: `${element.key} : ${element.value}`
        };
        if (element.value === undefined || typeof element.value === "object") {
            treeItem.label = element.key;
        }
        if (element.value?.ipaddr !== undefined) {
            treeItem.contextValue = "ipv4";
        }
        treeItem.collapsibleState = element.array ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element: TJson<Instance>): TJson<Instance>[] | undefined {
        if (element === undefined) {
            return this.instances.getInstances();
        }
        Promise.resolve([]);
    }
}
