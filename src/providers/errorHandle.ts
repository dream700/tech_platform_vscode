import * as vscode from "vscode";
import { createDecorator } from "./decorators";

export const errorHandle = (title?: string, desc?: string) =>
  createDecorator(async (self, method, ...args) => {
    try {
      return await method.call(self, ...args);
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
        // notification.error({
        // message: title || "Error",
        // description: desc || (error as Error).message,
        // placement: "bottomRight",);
    }
  });