import * as vscode from "vscode";
import { createDecorator } from "./decorators";

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