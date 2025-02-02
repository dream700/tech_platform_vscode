import * as vscode from 'vscode';
import { TJson, parseJson } from '../helpers/json';


export class VersionsProvider {
    private _onDidChangeTreeData: vscode.EventEmitter<TJson<string> | undefined | void> = new vscode.EventEmitter<TJson<string> | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TJson<string> | undefined | void> = this._onDidChangeTreeData.event;

    versions: TJson<string>[] = [];
    urlRepository: string;
    extName: string;

    constructor(urlRepository: string, extName: string) {
        this.urlRepository = urlRepository;
        this.extName = extName;
    }
    public loadExtVersionInfo(): Promise<TJson<string>[]> {
        return new Promise((resolve, error) => {
            fetch(`${this.urlRepository}/v1/extensions/?name=${this.extName}`)
                .then(
                    response => {
                        const data: any = response.json();
                        return data;
                    })
                .then(
                    data => {
                        this.versions = parseJson(data);
                        resolve(this.versions);
                    })
                .catch(error);
        });
    }

}