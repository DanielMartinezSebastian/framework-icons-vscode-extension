import * as vscode from 'vscode';
import { detectFramework } from './frameworkDetector';
import { IconThemeProvider } from './iconThemeProvider';
import { updateIconTheme } from './extension';

export class StatusBarManager {
  private context: vscode.ExtensionContext;
  private statusBarItem: vscode.StatusBarItem;
  private frameworks: string[] = ['react', 'angular', 'vue', 'default'];
  private currentFrameworkIndex: number = 0;
  private iconThemeProvider: IconThemeProvider;

  constructor(context: vscode.ExtensionContext, iconThemeProvider: IconThemeProvider) {
    this.context = context;
    this.iconThemeProvider = iconThemeProvider;
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'frameworkIcons.cycleFramework';
    this.statusBarItem.show();
    this.updateStatusBar();
  }

  public async updateStatusBar() {
    const config = vscode.workspace.getConfiguration('frameworkIcons');
    const workbenchConfig = vscode.workspace.getConfiguration('workbench');
    
    // Obtener el tema de iconos activo
    const activeIconTheme = workbenchConfig.get('iconTheme') as string;
    let framework: string = 'default';
    
    // Mapear el tema de iconos a un framework
    if (activeIconTheme.includes('react')) {
      framework = 'react';
    } else if (activeIconTheme.includes('angular')) {
      framework = 'angular';
    } else if (activeIconTheme.includes('vue')) {
      framework = 'vue';
    }
    
    // Actualizar el índice del framework actual
    this.currentFrameworkIndex = this.frameworks.indexOf(framework);
    
    // Personalizar ícono según el framework
    const icon = this.getIconForFramework(framework);
    this.statusBarItem.text = `${icon} ${framework}`;
    this.statusBarItem.tooltip = `Current framework: ${framework}\nClick to change framework`;

    console.log(`Status bar updated to: ${framework} (based on theme: ${activeIconTheme})`);
  }

  public async cycleFramework() {
    const items = this.frameworks.map(framework => ({
      label: this.getIconForFramework(framework) + ' ' + framework,
      description: `Switch to ${framework} framework`,
      framework: framework
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a framework',
    });

    if (selected) {
      const selectedFramework = selected.framework;

      // 1. Desactivar detección automática primero
      await vscode.workspace.getConfiguration('frameworkIcons')
        .update('detectFramework', false, vscode.ConfigurationTarget.Global);
        
      // 2. Configurar el framework seleccionado
      await vscode.workspace.getConfiguration('frameworkIcons')
        .update('manualFramework', selectedFramework, vscode.ConfigurationTarget.Global);
      
      // 3. Actualizar tema primero
      await updateIconTheme(this.iconThemeProvider);
      
      // 4. Actualizar directamente la barra de estado sin llamar a updateStatusBar()
      this.currentFrameworkIndex = this.frameworks.indexOf(selectedFramework);
      const icon = this.getIconForFramework(selectedFramework);
      this.statusBarItem.text = `${icon} ${selectedFramework}`;
      this.statusBarItem.tooltip = `Current framework: ${selectedFramework}`;
      
      // 5. Mostrar mensaje de confirmación 
      vscode.window.showInformationMessage(`Framework changed to: ${selectedFramework}`);
    }
  }


  // Función para obtener un ícono personalizado para cada framework disponibles en Octicons de VS Code
  private getIconForFramework(framework: string): string {
    if (framework === 'react') {
      return '$(zap)'; // Usar un icono disponible
    } else if (framework === 'angular') {
      return '$(flame)'; // Usar un icono disponible
    } else if (framework === 'vue') {
      return '$(beaker)'; // Usar un icono disponible
    } else {
      return '$(file-code)'; // Icono por defecto
    }
  }
}
