import * as vscode from 'vscode';
import { loadable, Loadable } from '../providers/loadable';
import { errorHandle } from '../providers/errorHandle';
import { successfullyNotify } from '../providers/successfully';
import { log } from '../providers/log';

export type Extension = {
    name: string;
};

const defaultLoading = {
    extensions: false,
};

class ExtensionAvailable extends Loadable<typeof defaultLoading> {
    extensions: Extension[] = [];

    constructor() {
        super();
        this.loading = defaultLoading;
    }
    defaultLog = vscode.window.createOutputChannel("Tech Platform");

    @loadable("extensions")
    @errorHandle()
    @successfullyNotify("Available extensions loaded successfully")
    @log()
    async loadExtensions() {
        const response = await fetch('http://em-user-api.service.cloudcore:10001/v1/extensions/available/');
        const data = await response.json();
        const extensions = data as Extension[];
        this.extensions = extensions;
    }

    public Log(message?: string) {
        if (message) {
            this.defaultLog.appendLine(message);
        }
    }

}

export function getExtensionAvailable() {
    const extensionAvailable = new ExtensionAvailable();
    extensionAvailable.loadExtensions();
    for (let extension of extensionAvailable.extensions) {
        extensionAvailable.Log(extension.name);
    }
}
