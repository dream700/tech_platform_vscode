import { ExtensionAPI } from '../api/ExtensionAPI';
import { dsExtension } from '../datastore/dsExtension';

export class dsExtensionAvailable {
    private extensions: dsExtension[] = [];

    public getExtensionsAvailable(): dsExtension[] {
        if (this.extensions.length === 0) {
            this.refreshExtensionsAvailable();
        }
        return this.extensions;
    }

    public refreshExtensionsAvailable(): Promise<dsExtension[]> {
        return new Promise((resolve, reject) => {
            let api = new ExtensionAPI();
            this.extensions = [];    
            api.loadExtensionsAvailable().then(res => {
                res.forEach((value: string, key: string) => {
                    let ext = new dsExtension(value);
                    this.extensions.push(ext);
                });
                resolve(this.extensions);
            });            
        });
    }
}
