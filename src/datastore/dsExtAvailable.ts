import { ExtensionAPI } from '../api/ExtensionAPI';
import { dsExtensionInfo } from './dsExtensionInfo';

export class dsExtensionAvailable {
    private extensions: dsExtensionInfo[] = [];

    public getExtensionsAvailable(): dsExtensionInfo[] {
        if (this.extensions.length === 0) {
            this.refreshExtensionsAvailable();
        }
        return this.extensions;
    }

    public refreshExtensionsAvailable(): Promise<dsExtensionInfo[]> {
        return new Promise((resolve, reject) => {
            let api = new ExtensionAPI();
            this.extensions = [];    
            api.loadExtensionsAvailable().then(res => {
                res.forEach((value: string, key: string) => {
                    let ext = new dsExtensionInfo(value);
                    this.extensions.push(ext);
                });
                resolve(this.extensions);
            });            
        });
    }
}
