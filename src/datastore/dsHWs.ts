export class HW {
    uuid: string;
    name: string;
    ipaddr: string | undefined;
    status: string | undefined;
    constructor(uuid: string, name: string, ipaddr?: string, status?: string) {
        this.uuid = uuid;
        this.name = name;
        this.ipaddr = ipaddr;
        this.status = status;
    }
}