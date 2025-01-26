import * as vscode from 'vscode';

interface IRouteConfig {
    path: string;
    method: "GET" | "POST";
    hasIdParam: boolean;
}

type Routes = {
    getExtensionAvailable: IRouteConfig;
    getUsers: IRouteConfig;
    getUserById: IRouteConfig;
    createUser: IRouteConfig;
};

const routes = {
    getExtensionAvailable: {
        path: "http://em-user-api.service.cloudcore:10001/v1/extensions/available/",
        method: "GET",
        hasIdParam: false,
    },
    getUsers: {
        path: "/users",
        method: "GET",
        hasIdParam: true,
    },
    getUserById: {
        path: "/users",
        method: "GET",
        hasIdParam: true,
    },
    createUser: {
        path: "/users",
        method: "POST",
        hasIdParam: false,
    }
} as const satisfies Routes;

type ClientFunction<T extends IRouteConfig> = T['hasIdParam'] extends true
    ? (id: number) => Promise<string>
    : () => Promise<string>;

type Client<T extends Record<string, IRouteConfig>> = {
    [K in keyof T]: ClientFunction<T[K]>;
};

function createClient<T extends Record<string, IRouteConfig>>(
    config: T
): Client<T> {
    const entries = Object.entries(config).map(([key, route]) => {
        const fn = route.hasIdParam
            ? (id: number) =>
                Promise.resolve(`${route.method} ${route.path}/${id} was called!`)
            : () => Promise.resolve(`${route.method} ${route.path} was called!`);

        return [key, fn];
    });

    return Object.fromEntries(entries);
}

export function getExtensionAvailable() {
    const apiClient = createClient(routes);
    apiClient.getExtensionAvailable().then(
        res => {
            vscode.window.showInformationMessage(res);
        }
    );
    return;
}