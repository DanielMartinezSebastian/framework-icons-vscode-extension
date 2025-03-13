"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const frameworkDetector_1 = require("./frameworkDetector");
const iconThemeProvider_1 = require("./iconThemeProvider");
async function activate(context) {
    console.log("Framework Icons extension is now active!");
    const iconThemeProvider = new iconThemeProvider_1.IconThemeProvider(context);
    // Detectar el framework al iniciar
    await updateIconTheme(iconThemeProvider);
    // Registrar comando para detectar framework manualmente
    const disposable = vscode.commands.registerCommand("frameworkIcons.detectFramework", async () => {
        await updateIconTheme(iconThemeProvider);
        vscode.window.showInformationMessage(`Framework Icons: Tema de iconos actualizado!`);
    });
    // Escuchar cambios en la configuración
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration("frameworkIcons")) {
            await updateIconTheme(iconThemeProvider);
        }
    }));
    // Escuchar apertura de carpetas/workspace
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(async () => {
        await updateIconTheme(iconThemeProvider);
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function updateIconTheme(iconThemeProvider) {
    const config = vscode.workspace.getConfiguration("frameworkIcons");
    if (!config.get("enabled")) {
        return;
    }
    let framework;
    if (config.get("detectFramework")) {
        framework = await (0, frameworkDetector_1.detectFramework)();
    }
    else {
        framework = config.get("manualFramework");
        if (framework === "auto") {
            framework = await (0, frameworkDetector_1.detectFramework)();
        }
    }
    await iconThemeProvider.updateTheme(framework);
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map