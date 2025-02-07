import { TJson, objectToMap, parseJson } from '../helpers/json';


export class dsVersions {

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
}