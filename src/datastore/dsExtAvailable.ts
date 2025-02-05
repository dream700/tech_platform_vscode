import { dsExtension } from '../datastore/dsExtension';

export class dsExtensionAvailable {
    private extensions: dsExtension[] = [];

    public getExtensions(): dsExtension[] {
        return this.extensions;
    }

    public loadExtensions(): Promise<dsExtension[]> {
        return new Promise((resolve, reject) => {
            this.extensions = [];    
            fetch('http://em-user-api.service.cloudcore:10001/v1/extensions/available/')
            .then(response => response.json())
            .then((data: any) => {
                for (const pack of data) {
                    const requiresItem = new dsExtension(pack);
                    this.extensions.push(requiresItem);
                };
                resolve(this.extensions);
            }).catch(reject);
        });
    }
}
