import * as vscode from 'vscode';


export class Extension {
    public uuid?: string;
    public name?: string;
    public version?: string;
    public requred?: Extension[] | undefined;
}

export class ExtensionAvailable implements vscode.TreeDataProvider<Extension> {
    public viewType = 'tp.extension';
    public requres?: Extension[];
    public buildRequired?: Extension[];

    public fillRequres(requresJSON: any) {
        if (requresJSON) {
            this.requres = [];
            this.buildRequired = [];
        }
    }

    public getRequires(requresJSON: any, requires: Extension[], property: string) {
        for ( var pack of requresJSON) {
            if (Object.prototype.hasOwnProperty.call(pack, property)) {
                console.log(pack["display name"], pack[property]);
                let children: {name: string }[] = [];
                for (let item of pack[property]) {
                    children.push({name: item});
                }
                let requiresItem = { name: pack["display name"] as string, requred: children };
                requires.push(pack[property]);
            }
        }
    }


    static index: number = 0;
    public getTreeItem(element: Extension): vscode.TreeItem {
        const treeItem: vscode.TreeItem = {
            label: element.name
        };

        treeItem.id = element.name + ExtensionAvailable.index.toString();
        ExtensionAvailable.index++;
        if (element.name?.endsWith("requires")) {
            treeItem.contextValue = "root";
        } else {
            treeItem.contextValue = "package";
        }
        treeItem.collapsibleState = element.requred ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        return treeItem;
    }
    public getChildren(element?: Extension): Extension[] {
        if (element === undefined) {
            return [ {name: 'Extension requires', requred: this.buildRequired },
                     {name: 'Extension requires', requred: this.requres } ];
        }
        if (element.requred) {
            return element.requred;
        }
        return [];
    }
}

