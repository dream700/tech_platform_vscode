import * as vscode from 'vscode';
import { GlobalVarsProvider } from "../providers/global-vars";

export function getGlobalVars() {
    const extensionAvailable = new GlobalVarsProvider();
    extensionAvailable.loadGlobalVars().then(() => {
        const treeDataProvider = vscode.window.createTreeView('vk-tp.globalVars', {
            treeDataProvider: extensionAvailable
        });
        treeDataProvider.reveal(extensionAvailable.globalVars![0]);
    });
}
