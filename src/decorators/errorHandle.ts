import * as vscode from "vscode";
import { createDecorator } from "../decorators/create";

export const errorHandle = (title?: string, desc?: string) =>
  createDecorator(async (self, method, ...args) => {
    try {
      return await method.call(self, ...args);
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message);  
      }
    }
  });