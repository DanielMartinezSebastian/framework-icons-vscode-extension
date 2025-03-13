"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
async function detectFramework() {
    if (!vscode.workspace.workspaceFolders ||
        vscode.workspace.workspaceFolders.length === 0) {
        return "unknown";
    }
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    // Comprobar Angular
    const angularJsonPath = path.join(workspaceRoot, "angular.json");
    if (fs.existsSync(angularJsonPath)) {
        return "angular";
    }
    // Comprobar Vue
    const vueConfigPath = path.join(workspaceRoot, "vue.config.js");
    if (fs.existsSync(vueConfigPath)) {
        return "vue";
    }
    // Comprobar package.json para dependencias
    const packageJsonPath = path.join(workspaceRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
            const dependencies = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies,
            };
            if (dependencies && typeof dependencies === "object") {
                if (dependencies["@angular/core"]) {
                    return "angular";
                }
                if (dependencies["vue"]) {
                    return "vue";
                }
                if (dependencies["react"] || dependencies["react-dom"]) {
                    return "react";
                }
            }
        }
        catch (error) {
            console.error("Error al analizar package.json:", error);
        }
    }
    return "unknown";
}
exports.detectFramework = detectFramework;
//# sourceMappingURL=frameworkDetector.js.map