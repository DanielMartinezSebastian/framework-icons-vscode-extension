import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getIconDefinitions } from "./iconDefinitions";
import { getFolderColor } from "./utils";

/**
 * Proveedor de temas de iconos para diferentes frameworks
 */
export class IconThemeProvider {
  private context: vscode.ExtensionContext;
  private currentFramework: string | null = null;

  // Mapeo de frameworks a IDs de temas de iconos (verificar que coincidan con package.json)
  private readonly themeIds: Record<string, string> = {
    react: "framework-icons-react",
    angular: "framework-icons-angular",
    vue: "framework-icons-vue",
    unknown: "framework-icons-default",
  };

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Actualiza el tema de iconos basado en el framework detectado
   * @param framework El framework detectado ('react', 'angular', 'vue', etc.)
   */
  public async updateTheme(framework: string): Promise<void> {
    try {
      if (this.currentFramework === framework) {
        return; // No ha cambiado el framework, no hacemos nada
      }

      console.log(`Cambiando tema de iconos a: ${framework}`);
      this.currentFramework = framework;

      // Obtener el ID de tema correspondiente al framework con valor predeterminado seguro
      const themeId: string = this.themeIds[framework] || this.themeIds.unknown;

      // Actualizar la configuración para usar el tema de iconos predefinido
      await vscode.workspace
        .getConfiguration("workbench")
        .update("iconTheme", themeId, vscode.ConfigurationTarget.Workspace);

      console.log(`Tema de iconos activado: ${themeId}`);
    } catch (error) {
      console.error(`Error al actualizar el tema de iconos: ${error}`);
    }
  }

  /**
   * Obtiene información sobre los colores utilizados para cada framework (solo para documentación)
   * @returns Un objeto con información de colores por framework
   */
  public getFrameworkColorInfo(): Record<string, Record<string, string>> {
    return {
      react: {
        components: "#1976D2", // azul
        hooks: "#4CAF50", // verde
        contexts: "#9C27B0", // morado
        assets: "#FF9800", // naranja
      },
      angular: {
        src: "#F44336", // rojo
        app: "#4CAF50", // verde
        assets: "#2196F3", // azul
        environments: "#FFEB3B", // amarillo
      },
      vue: {
        components: "#4CAF50", // verde
        views: "#2196F3", // azul
        store: "#FFEB3B", // amarillo
        assets: "#9C27B0", // morado
      },
    };
  }
}
