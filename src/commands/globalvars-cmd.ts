import * as vscode from 'vscode';
import { GlobalVarsProvider } from "../providers/globalvars";

export function getGlobalVars() {
    const globalVars = new GlobalVarsProvider();
    globalVars.refresh();
    const treeDataProvider = vscode.window.createTreeView('vk-tp.globalVars', {
        treeDataProvider: globalVars
    });
    treeDataProvider.reveal(globalVars.globalVars.getGlobalVars()[0]);
}
