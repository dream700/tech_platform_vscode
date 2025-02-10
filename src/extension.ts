// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IPingResType } from './providers.js';
import { ExtensionAvailableProvider } from './providers/ext-available.js';
import { GlobalVarsProvider } from './providers/globalvars.js';
import { HWsProvider } from './providers/instances.js';
import { mapToJsonArray, objectToMap, TJson } from './helpers/json.js';


//const serverSetting = vscode.workspace.getConfiguration('yourPackageName').server;


export class GlobalVars {

	private static _globalVarsExtensions: Map<any, any> = new Map<any, any>();
	public static get globalVarsExtensions(): Map<any, any> {
		return GlobalVars._globalVarsExtensions;
	}
	public static set globalVarsExtensions(value: Map<any, any>) {
		GlobalVars._globalVarsExtensions = value;
	}
	private static _globalVarsEndPoints: Map<any, any> = new Map<any, any>();
	public static get globalVarsEndPoints(): Map<any, any> {
		return GlobalVars._globalVarsEndPoints;
	}
	public static set globalVarsEndPoints(value: Map<any, any>) {
		GlobalVars._globalVarsEndPoints = value;
	}
	private static globalVarsMap: Map<any, any> = new Map<any, any>();

	static getGlobalVars(): Map<any, any> {
		return this.globalVarsMap;
	}

	static GetGlobalVarsToArray(): TJson<string>[] {
		return mapToJsonArray(this.globalVarsMap);
	}

	static setGlobalVars(value: any) {
		let globalvars = objectToMap(value);
		if (globalvars.has("GLOBAL")) {
			this.globalVarsMap = globalvars.get("GLOBAL");
			if (this.globalVarsMap.has("endpoints")) {
				this.globalVarsEndPoints = this.globalVarsMap.get("endpoints");
			}
			if (this.globalVarsMap.has("extensions")) {
				this.globalVarsExtensions = this.globalVarsMap.get("extensions");
			}
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tech-platform" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('tech-platform.helloWorld', (item) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Tech Platform from VS Code!');
	});


	const disposableCheckConnection = vscode.commands.registerCommand('tech-platform.checkConnection', () => {
		checkConnectionOnStand().then(
			res => {
				const result = res as IPingResType;
				if (result.alive !== undefined) {
					if (result.alive) {
						vscode.window.showInformationMessage(`Connection to personal stand completed successfully, packet loss: ${result.packetLoss}\%`);
					} else {
						vscode.window.showInformationMessage(`Your personal stand is not connected, maybe your Dev portal is not connected. Please connect the VPN (portal) and try again.`);
					}
				}
			},
			err => vscode.window.showInformationMessage(`Rejected: ${err}`)
		);
	});

	const globalVars = new GlobalVarsProvider();
	vscode.window.registerTreeDataProvider('vk-tp.extension', globalVars);
	const globalVarsProvider = vscode.window.createTreeView('vk-tp.globalVars', {
		treeDataProvider: globalVars
	});
	const extensionAvailable = new ExtensionAvailableProvider();
	vscode.window.registerTreeDataProvider('vk-tp.extension', extensionAvailable);
	const extensionAvailableProvider = vscode.window.createTreeView('vk-tp.extension', {
		treeDataProvider: extensionAvailable
	});
	const hws = new HWsProvider();
	vscode.window.registerTreeDataProvider('vk-tp.HWs', hws);
	const hwsProvider = vscode.window.createTreeView('vk-tp.HWs', {
		treeDataProvider: hws
	});
	globalVars.refresh()
		.then(() => extensionAvailable.refresh().then(() => hws.refresh()));


	context.subscriptions.push(
		vscode.commands.registerCommand('tech-platform.RefreshStands', () => {
			extensionAvailable.refresh();
		})
	);
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableCheckConnection);
}

// This method is called when your extension is deactivated
export function deactivate() { }

export function checkConnectionOnStand() {
	return checkConnection('em-user-api.service.cloudcore');
}

export function checkConnection(host: string) {
	return new Promise((resolve, reject) => {
		var ping = require('ping');
		const options = {
			timeout: 3,
			extra: ['-i', '2']
		};
		ping.promise.probe(host, options)
			.then((res: any) => {
				resolve(res);
			}).catch((err: any) => {
				reject(err);
			});
	});
}

