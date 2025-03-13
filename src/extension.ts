import * as vscode from 'vscode';
import { detectFramework } from './frameworkDetector';
import { IconThemeProvider } from './iconThemeProvider';
import { StatusBarManager } from './statusBarManager';

export async function activate(context: vscode.ExtensionContext) {
  console.log('Framework Icons extension is now active!');

  const iconThemeProvider = new IconThemeProvider(context);
  const statusBarManager = new StatusBarManager(context, iconThemeProvider);

  // Detectar el framework al iniciar
  await updateIconTheme(iconThemeProvider);
  await statusBarManager.updateStatusBar();

  // Registrar comandos
  const detectFrameworkCommand = vscode.commands.registerCommand(
    'frameworkIcons.detectFramework',
    async () => {
      await updateIconTheme(iconThemeProvider);
      await statusBarManager.updateStatusBar();
      vscode.window.showInformationMessage(`Framework Icons: Tema de iconos actualizado!`);
    }
  );

  const cycleFrameworkCommand = vscode.commands.registerCommand(
    'frameworkIcons.cycleFramework',
    async () => {
      await statusBarManager.cycleFramework();
    }
  );

  context.subscriptions.push(detectFrameworkCommand, cycleFrameworkCommand);

  // Escuchar cambios en la configuración de frameworkIcons
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('frameworkIcons')) {
        await updateIconTheme(iconThemeProvider);
        await statusBarManager.updateStatusBar();
      }
    })
  );

  // Añadir este nuevo listener para detectar cambios en el tema de iconos
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('workbench.iconTheme')) {
        console.log('Icon theme changed from extension page');
        // Actualizar la barra de estado sin cambiar el tema
        await statusBarManager.updateStatusBar();
      }
    })
  );
}

export async function updateIconTheme(iconThemeProvider: IconThemeProvider) {
  const config = vscode.workspace.getConfiguration('frameworkIcons');

  console.log('updateIconTheme called');

  if (!config.get('enabled')) {
    console.log('Framework Icons is disabled');
    return;
  }

  let framework: string;

  if (config.get('detectFramework')) {
    framework = await detectFramework();
    console.log(`Detected framework: ${framework}`);
  } else {
    framework = config.get('manualFramework') as string;
    console.log(`Manual framework: ${framework}`);
    if (framework === 'auto') {
      framework = await detectFramework();
      console.log(`Detected framework (auto): ${framework}`);
    }
  }

  await iconThemeProvider.updateTheme(framework);
  console.log(`Icon theme updated to: ${framework}`);
}

export function deactivate() {}
