import { GlobalVars } from '../extension';
import { TJson, parseJson } from '../helpers/json';


export class dsGlobalVars {

    public loadGlobalVars(): Promise<void> {
        return new Promise((resolve, reject) => {
            fetch('http://em-user-api.service.cloudcore:10001/v1/global_vars/')
                .then((response) => response.json())
                .then(data => {
                    GlobalVars.setGlobalVars(data);
                    resolve();
                })
                .catch(reject);
        });
    }
}

