import * as vscode from 'vscode';
import { ExtensionAvailableProvider } from "../providers/ext-available";

export function getExtensionAvailable() {
    const extensionAvailable = new ExtensionAvailableProvider();
    extensionAvailable.loadExtensions().then(() => {
        const treeDataProvider = vscode.window.createTreeView('vk-tp.extension', {
            treeDataProvider: extensionAvailable
        });
        treeDataProvider.reveal(extensionAvailable.extensions![0]);
    });
}
