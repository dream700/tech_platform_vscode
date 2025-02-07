import { objectToMap } from '../helpers/json';


export class APIRepository {

    public loadExtVersionInfo(urlRepository: string, extName: string): Promise<Map<any, any>> {
        return new Promise((resolve, reject) => {
            fetch(`${urlRepository}/v1/extensions/?name=${extName}&sort_by=version`)
                .then(response => response.json())
                .then((data: any) => {
                    const versions = objectToMap(data);
                    resolve(versions);
                }).catch(reject);
        });
    }

    public loadManifest(urlRepository: string, extUuid: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch(`${urlRepository}/v1/extensions/${extUuid}`)
                .then(response => response.json())
                .then((data: any) => {                    
                    const versions = objectToMap(data);
                    const manifest = versions.get("manifest");
                    resolve(manifest);
                }).catch(reject);
        });
    }

}