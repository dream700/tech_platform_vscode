import * as vscode from "vscode";
import { createDecorator } from "./decorators";

export const successfullyNotify = (message: string, description?: string) =>
  createDecorator(async (self, method, ...args) => {
    const result = await method.call(self, ...args);
    vscode.window.showInformationMessage(message);
    return result;
  });