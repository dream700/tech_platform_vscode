import { errorHandle } from "../decorators/errorHandle";
import { loadable, Loadable } from "../decorators/loadable";
import { successfullyNotify } from "../decorators/successfully";
import { findValueByName, TJson } from "../helpers/json";
import { parseJson } from "../helpers/json";
import { log } from '../decorators/log';

const defaultLoading = {
    extIndex: false
};

export class ExtIndexProvider extends Loadable<typeof defaultLoading> {
    extIndex: TJson<string>[] = [];
    md5sum: string | undefined;
    fileName = "repository-extensions.index.json";
    nexusApiUrl = `https://nexus.infra.devmail.ru/service/rest/v1/search?name=${this.fileName}&repository=tech-platform-artifacts`;
    indexURL: string | undefined;

    constructor() {
        super();
        this.downloadChecksumExtIndex();
        this.md5sum = "";
    }

    @loadable("extIndex")
    @errorHandle()
    @successfullyNotify("MD5 checksum loadedsuccessfully")
    @log()
    async downloadChecksumExtIndex() {
        let resp: TJson<string>[];
        const response = await fetch(this.nexusApiUrl);
        const data: any = await response.json();
        resp = parseJson(data);
        this.md5sum = findValueByName(resp, "md5");
        this.indexURL = findValueByName(resp, "downloadUrl");
    }
    @loadable("extIndex")
    @errorHandle()
    @successfullyNotify("Index repository extensions loaded successfully")
    @log()
    async downloadmExtIndex() {
        const response = await fetch(this.indexURL as string);
        const data: any = await response.json();
        this.extIndex = parseJson(data);
    }

}

// Пример использования:
// downloadJsonFromNexus("path/to/your/file.json").catch(console.error);