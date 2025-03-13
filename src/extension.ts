import * as vscode from "vscode";
import { detectFramework } from "./frameworkDetector";
import { IconThemeProvider } from "./iconThemeProvider";

export async function activate(context: vscode.ExtensionContext) {
  console.log("Framework Icons extension is now active!");

  const iconThemeProvider = new IconThemeProvider(context);

  // Detectar el framework al iniciar
  await updateIconTheme(iconThemeProvider);

  // Registrar comando para detectar framework manualmente
  const disposable = vscode.commands.registerCommand(
    "frameworkIcons.detectFramework",
    async () => {
      await updateIconTheme(iconThemeProvider);
      vscode.window.showInformationMessage(
        `Framework Icons: Tema de iconos actualizado!`
      );
    }
  );

  // Escuchar cambios en la configuración
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration("frameworkIcons")) {
        await updateIconTheme(iconThemeProvider);
      }
    })
  );

  // Escuchar apertura de carpetas/workspace
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(async () => {
      await updateIconTheme(iconThemeProvider);
    })
  );

  context.subscriptions.push(disposable);
}

async function updateIconTheme(iconThemeProvider: IconThemeProvider) {
  const config = vscode.workspace.getConfiguration("frameworkIcons");

  if (!config.get("enabled")) {
    return;
  }

  let framework: string;

  if (config.get("detectFramework")) {
    framework = await detectFramework();
  } else {
    framework = config.get("manualFramework") as string;
    if (framework === "auto") {
      framework = await detectFramework();
    }
  }

  await iconThemeProvider.updateTheme(framework);
}

export function deactivate() {}
