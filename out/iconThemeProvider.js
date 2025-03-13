"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconThemeProvider = void 0;
const vscode = require("vscode");
/**
 * Proveedor de temas de iconos para diferentes frameworks
 */
class IconThemeProvider {
    constructor(context) {
        this.currentFramework = null;
        // Mapeo de frameworks a IDs de temas de iconos (verificar que coincidan con package.json)
        this.themeIds = {
            react: "framework-icons-react",
            angular: "framework-icons-angular",
            vue: "framework-icons-vue",
            unknown: "framework-icons-default",
        };
        this.context = context;
    }
    /**
     * Actualiza el tema de iconos basado en el framework detectado
     * @param framework El framework detectado ('react', 'angular', 'vue', etc.)
     */
    async updateTheme(framework) {
        try {
            if (this.currentFramework === framework) {
                return; // No ha cambiado el framework, no hacemos nada
            }
            console.log(`Cambiando tema de iconos a: ${framework}`);
            this.currentFramework = framework;
            // Obtener el ID de tema correspondiente al framework con valor predeterminado seguro
            const themeId = this.themeIds[framework] || this.themeIds.unknown;
            // Actualizar la configuración para usar el tema de iconos predefinido
            await vscode.workspace
                .getConfiguration("workbench")
                .update("iconTheme", themeId, vscode.ConfigurationTarget.Workspace);
            console.log(`Tema de iconos activado: ${themeId}`);
        }
        catch (error) {
            console.error(`Error al actualizar el tema de iconos: ${error}`);
        }
    }
    /**
     * Obtiene información sobre los colores utilizados para cada framework (solo para documentación)
     * @returns Un objeto con información de colores por framework
     */
    getFrameworkColorInfo() {
        return {
            react: {
                components: "#1976D2",
                hooks: "#4CAF50",
                contexts: "#9C27B0",
                assets: "#FF9800", // naranja
            },
            angular: {
                src: "#F44336",
                app: "#4CAF50",
                assets: "#2196F3",
                environments: "#FFEB3B", // amarillo
            },
            vue: {
                components: "#4CAF50",
                views: "#2196F3",
                store: "#FFEB3B",
                assets: "#9C27B0", // morado
            },
        };
    }
}
exports.IconThemeProvider = IconThemeProvider;
//# sourceMappingURL=iconThemeProvider.js.map