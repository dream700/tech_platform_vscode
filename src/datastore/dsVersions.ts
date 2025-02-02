import { TJson, parseJson } from '../helpers/json';


export class dsVersions {

    versions: TJson<string>[] = [];
    urlRepository: string;
    extName: string;

    constructor(urlRepository: string, extName: string) {
        this.urlRepository = urlRepository;
        this.extName = extName;
    }
    public loadExtVersionInfo(): Promise<TJson<string>[]> {
        return new Promise((resolve, reject) => {
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
                .catch(reject);
        });
    }
}