"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.updateIconTheme = exports.activate = void 0;
const vscode = require("vscode");
const frameworkDetector_1 = require("./frameworkDetector");
const iconThemeProvider_1 = require("./iconThemeProvider");
const statusBarManager_1 = require("./statusBarManager");
async function activate(context) {
    console.log('Framework Icons extension is now active!');
    const iconThemeProvider = new iconThemeProvider_1.IconThemeProvider(context);
    const statusBarManager = new statusBarManager_1.StatusBarManager(context, iconThemeProvider);
    // Detectar el framework al iniciar
    await updateIconTheme(iconThemeProvider);
    await statusBarManager.updateStatusBar();
    // Registrar comandos
    const detectFrameworkCommand = vscode.commands.registerCommand('frameworkIcons.detectFramework', async () => {
        await updateIconTheme(iconThemeProvider);
        await statusBarManager.updateStatusBar();
        vscode.window.showInformationMessage(`Framework Icons: Tema de iconos actualizado!`);
    });
    const cycleFrameworkCommand = vscode.commands.registerCommand('frameworkIcons.cycleFramework', async () => {
        await statusBarManager.cycleFramework();
    });
    context.subscriptions.push(detectFrameworkCommand, cycleFrameworkCommand);
    // Escuchar cambios en la configuración de frameworkIcons
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('frameworkIcons')) {
            await updateIconTheme(iconThemeProvider);
            await statusBarManager.updateStatusBar();
        }
    }));
    // Añadir este nuevo listener para detectar cambios en el tema de iconos
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('workbench.iconTheme')) {
            console.log('Icon theme changed from extension page');
            // Actualizar la barra de estado sin cambiar el tema
            await statusBarManager.updateStatusBar();
        }
    }));
}
exports.activate = activate;
async function updateIconTheme(iconThemeProvider) {
    const config = vscode.workspace.getConfiguration('frameworkIcons');
    console.log('updateIconTheme called');
    if (!config.get('enabled')) {
        console.log('Framework Icons is disabled');
        return;
    }
    let framework;
    if (config.get('detectFramework')) {
        framework = await (0, frameworkDetector_1.detectFramework)();
        console.log(`Detected framework: ${framework}`);
    }
    else {
        framework = config.get('manualFramework');
        console.log(`Manual framework: ${framework}`);
        if (framework === 'auto') {
            framework = await (0, frameworkDetector_1.detectFramework)();
            console.log(`Detected framework (auto): ${framework}`);
        }
    }
    await iconThemeProvider.updateTheme(framework);
    console.log(`Icon theme updated to: ${framework}`);
}
exports.updateIconTheme = updateIconTheme;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map