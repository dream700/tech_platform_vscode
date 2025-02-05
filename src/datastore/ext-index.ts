import { findValueByName, TJson } from "../helpers/json";
import { parseJson } from "../helpers/json";


export class dsExtensionsIndexJson {
    private extIndex: TJson<string>[] = [];
    private md5sum: string | undefined;
    private fileName = "repository-extensions.index.json";
    private nexusApiUrl = `https://nexus.infra.devmail.ru/service/rest/v1/search?name=${this.fileName}&repository=tech-platform-artifacts`;
    private indexURL: string | undefined;

    constructor() {
        this.md5sum = "";
        this.downloadChecksumExtIndex();
    }

    public downloadChecksumExtIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch(this.nexusApiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const resp = parseJson<string>(data);
                    findValueByName(resp, "md5")?.then((data) => this.md5sum = data);
                    findValueByName(resp, "downloadUrl")?.then((data) => this.indexURL = data);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    public downloadmExtIndex(): Promise<TJson<string>[]> {
        return new Promise((resolve, reject) => {
            fetch(this.indexURL as string)
                .then((response) => response.json())
                .then((data) => {
                    this.extIndex = parseJson(data);
                    resolve(this.extIndex);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
