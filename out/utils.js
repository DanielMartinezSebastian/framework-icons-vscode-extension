"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderColor = exports.generateCommonSvgs = exports.generateFileIconsStructure = exports.IconThemeManager = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
/**
 * Clase que gestiona los temas de iconos para distintos frameworks
 */
class IconThemeManager {
    constructor(context) {
        this.currentFramework = null;
        // Mapeo de frameworks a IDs de temas de iconos
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
        if (this.currentFramework === framework) {
            return; // No ha cambiado el framework, no hacemos nada
        }
        console.log(`Cambiando tema de iconos a: ${framework}`);
        this.currentFramework = framework;
        // Obtener el ID de tema correspondiente al framework
        const themeId = this.themeIds[framework] || this.themeIds.unknown;
        try {
            // Verificar si hay un workspace abierto
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                // Actualizar la configuración para usar el tema de iconos predefinido
                await vscode.workspace
                    .getConfiguration("workbench")
                    .update("iconTheme", themeId, vscode.ConfigurationTarget.Workspace);
                console.log(`Tema de iconos activado: ${themeId}`);
            }
            else {
                // Si no hay workspace, actualizamos a nivel global o no hacemos nada
                console.log("No hay workspace abierto. El tema de iconos se aplicará cuando se abra uno.");
            }
        }
        catch (error) {
            console.error(`Error al cambiar el tema de iconos: ${error}`);
        }
    }
}
exports.IconThemeManager = IconThemeManager;
/**
 * Genera la estructura de archivos necesaria para los temas de iconos
 * @param baseDir Directorio base donde se crearán los archivos
 */
function generateFileIconsStructure(baseDir) {
    const fileiconsDir = path.join(baseDir, "fileicons");
    // Frameworks soportados
    const frameworks = ["react", "angular", "vue", "default"];
    // Crear directorio principal de iconos si no existe
    if (!fs.existsSync(fileiconsDir)) {
        fs.mkdirSync(fileiconsDir, { recursive: true });
    }
    // Crear directorio común para iconos compartidos
    const commonDir = path.join(fileiconsDir, "common");
    if (!fs.existsSync(commonDir)) {
        fs.mkdirSync(commonDir, { recursive: true });
    }
    // Generar iconos SVG comunes
    generateCommonSvgs(baseDir);
    // Crear subdirectorio para cada framework
    for (const framework of frameworks) {
        const frameworkDir = path.join(fileiconsDir, framework);
        if (!fs.existsSync(frameworkDir)) {
            fs.mkdirSync(frameworkDir, { recursive: true });
        }
    }
    // Generar archivos JSON de tema para cada framework
    for (const framework of frameworks) {
        const themeContent = generateThemeJson(framework);
        const themeFilePath = path.join(fileiconsDir, `${framework}-icon-theme.json`);
        fs.writeFileSync(themeFilePath, JSON.stringify(themeContent, null, 2), "utf-8");
    }
    console.log(`Estructura de archivos para temas de iconos creada en: ${fileiconsDir}`);
    console.log("Para completar la instalación, coloca los archivos SVG en las respectivas carpetas de cada framework.");
}
exports.generateFileIconsStructure = generateFileIconsStructure;
/**
 * Genera el contenido JSON para un tema de iconos de un framework específico
 * @param framework Nombre del framework ('react', 'angular', 'vue', 'default')
 * @returns Objeto con la estructura del tema de iconos
 */
function generateThemeJson(framework) {
    // Carpetas comunes para todos los frameworks
    const commonFolders = ["src", "public", "test", "docs", "dist", "build"];
    // Carpetas específicas según el framework
    const specificFolders = getFrameworkSpecificFolders(framework);
    // Nombres de iconos por defecto - IMPORTANTE: Deben coincidir con las claves en iconDefinitions
    const defaultFolderIcon = "folder";
    const defaultFolderExpandedIcon = "folderExpanded";
    // Estructura básica del tema de iconos
    const themeJson = {
        iconDefinitions: {
            // Iconos por defecto para cualquier carpeta
            [defaultFolderIcon]: {
                iconPath: `./${framework}/default_folder.svg`,
            },
            [defaultFolderExpandedIcon]: {
                iconPath: `./${framework}/default_folder_open.svg`,
            },
            // Los iconos específicos se añadirán después
        },
        // Propiedad clave: asigna el icono por defecto a TODAS las carpetas
        folder: defaultFolderIcon,
        // Propiedad clave: asigna el icono expandido por defecto a TODAS las carpetas abiertas
        folderExpanded: defaultFolderExpandedIcon,
        // Este arreglo asigna el icono por defecto a todas las carpetas (wildcard *)
        folders: [
            {
                icon: defaultFolderIcon,
                name: "*",
            },
        ],
        // Este arreglo asigna el icono expandido por defecto a todas las carpetas abiertas (wildcard *)
        foldersExpanded: [
            {
                icon: defaultFolderExpandedIcon,
                name: "*",
            },
        ],
        // Aquí se definirán las asociaciones específicas de nombres de carpeta a iconos
        folderNames: {},
        // Aquí se definirán las asociaciones específicas de nombres de carpeta a iconos para carpetas expandidas
        folderNamesExpanded: {},
        // Configuración de archivos
        file: {
            iconPath: `./${framework}/file.svg`,
        },
        fileExtensions: {},
        fileNames: {},
        languageIds: {},
        // Configuración para modo light
        light: {
            folder: {
                iconPath: `./${framework}/default_folder.svg`,
            },
            folderExpanded: {
                iconPath: `./${framework}/default_folder_open.svg`,
            },
            folders: [
                {
                    icon: defaultFolderIcon,
                    name: "*",
                },
            ],
            foldersExpanded: [
                {
                    icon: defaultFolderExpandedIcon,
                    name: "*",
                },
            ],
        },
        // Configuración para modo high contrast
        highContrast: {
            folder: {
                iconPath: `./${framework}/default_folder.svg`,
            },
            folderExpanded: {
                iconPath: `./${framework}/default_folder_open.svg`,
            },
            folders: [
                {
                    icon: defaultFolderIcon,
                    name: "*",
                },
            ],
            foldersExpanded: [
                {
                    icon: defaultFolderExpandedIcon,
                    name: "*",
                },
            ],
        },
        // Configuración de la carpeta raíz
        rootFolder: {
            iconPath: `./${framework}/default_folder.svg`,
        },
        rootFolderExpanded: {
            iconPath: `./${framework}/default_folder_open.svg`,
        },
    };
    // Para el tema "default", simplificamos y usamos el mismo icono para todas las carpetas
    if (framework === "default") {
        return themeJson;
    }
    // Agregar definiciones para carpetas comunes
    for (const folderName of commonFolders) {
        // Solo si el framework no es "default"
        const iconName = `folder-${folderName}`;
        const expandedIconName = `folderExpanded-${folderName}`;
        // Definir los iconos
        if (framework !== "default") {
            themeJson.iconDefinitions[iconName] = {
                iconPath: `./${framework}/folder_${folderName}.svg`,
            };
            themeJson.iconDefinitions[expandedIconName] = {
                iconPath: `./${framework}/folder_${folderName}_open.svg`,
            };
            // Verificar si el archivo existe, si no, usar el de common
            const frameworkFolderPath = path.join(__dirname, "..", "fileicons", framework, `folder_${folderName}.svg`);
            if (!fs.existsSync(frameworkFolderPath)) {
                themeJson.iconDefinitions[iconName] = {
                    iconPath: `./common/folder-${folderName}.svg`,
                };
                themeJson.iconDefinitions[expandedIconName] = {
                    iconPath: `./common/folder-${folderName}-expanded.svg`,
                };
            }
            // Asignar nombres de carpetas a iconos
            themeJson.folderNames[folderName] = iconName;
            themeJson.folderNamesExpanded[folderName] = expandedIconName;
        }
    }
    // Agregar definiciones para carpetas específicas del framework
    for (const folderName of specificFolders) {
        const iconName = `folder-${folderName}`;
        const expandedIconName = `folderExpanded-${folderName}`;
        themeJson.iconDefinitions[iconName] = {
            iconPath: `./${framework}/folder_${folderName}.svg`,
        };
        themeJson.iconDefinitions[expandedIconName] = {
            iconPath: `./${framework}/folder_${folderName}_open.svg`,
        };
        themeJson.folderNames[folderName] = iconName;
        themeJson.folderNamesExpanded[folderName] = expandedIconName;
    }
    return themeJson;
}
/**
 * Obtiene las carpetas específicas para un framework
 */
function getFrameworkSpecificFolders(framework) {
    switch (framework) {
        case "react":
            return [
                "components",
                "hooks",
                "contexts",
                "redux",
                "services",
                "pages",
                "assets",
            ];
        case "angular":
            return [
                "app",
                "components",
                "services",
                "pipes",
                "directives",
                "guards",
                "environments",
                "assets",
            ];
        case "vue":
            return [
                "components",
                "views",
                "store",
                "router",
                "composables",
                "modules",
                "assets",
            ];
        default:
            return ["components", "assets"];
    }
}
/**
 * Genera los SVGs comunes necesarios para todos los frameworks
 * @param baseDir Directorio base donde se crearán los SVGs
 */
function generateCommonSvgs(baseDir) {
    const commonDir = path.join(baseDir, "fileicons", "common");
    // Crear directorio common si no existe
    if (!fs.existsSync(commonDir)) {
        fs.mkdirSync(commonDir, { recursive: true });
    }
    // Colores base para cada framework
    const frameworkBaseColors = {
        react: "#61DAFB",
        angular: "#DD0031",
        vue: "#4FC08D",
        default: "#607D8B",
    };
    // Generar iconos de carpeta por defecto para cada framework
    for (const [framework, color] of Object.entries(frameworkBaseColors)) {
        // Icono de carpeta cerrada
        fs.writeFileSync(path.join(commonDir, `folder-${framework}.svg`), createFolderSvg(color));
        // Icono de carpeta abierta
        fs.writeFileSync(path.join(commonDir, `folder-expanded-${framework}.svg`), createFolderOpenSvg(color));
        // Icono de archivo
        fs.writeFileSync(path.join(commonDir, `file-${framework}.svg`), createFileSvg(color));
    }
    // Generar iconos para carpetas comunes
    const commonFolders = ["src", "public", "test", "docs", "dist", "build"];
    const commonColors = {
        src: "#42A5F5",
        public: "#66BB6A",
        test: "#EF5350",
        docs: "#7E57C2",
        dist: "#78909C",
        build: "#78909C", // gris azulado
    };
    for (const folderName of commonFolders) {
        const color = commonColors[folderName] || "#607D8B";
        // Icono de carpeta cerrada
        fs.writeFileSync(path.join(commonDir, `folder-${folderName}.svg`), createFolderSvg(color));
        // Icono de carpeta abierta
        fs.writeFileSync(path.join(commonDir, `folder-${folderName}-expanded.svg`), createFolderOpenSvg(color));
    }
    console.log(`SVGs comunes generados en: ${commonDir}`);
}
exports.generateCommonSvgs = generateCommonSvgs;
/**
 * Obtiene el color recomendado para un tipo de carpeta según el framework
 * (Solo para documentación y referencia cuando se creen los SVG estáticos)
 */
function getFolderColor(framework, folderName) {
    // Colores predeterminados para carpetas comunes
    const commonColors = {
        src: "#42A5F5",
        public: "#66BB6A",
        test: "#EF5350",
        docs: "#7E57C2",
        dist: "#78909C",
        build: "#78909C", // gris azulado
    };
    // Colores específicos por framework
    const frameworkColors = {
        react: {
            components: "#1976D2",
            hooks: "#4CAF50",
            contexts: "#9C27B0",
            redux: "#764ABC",
            services: "#795548",
            pages: "#00BCD4",
            assets: "#FF9800", // naranja
        },
        angular: {
            app: "#4CAF50",
            components: "#3F51B5",
            services: "#795548",
            pipes: "#607D8B",
            directives: "#FF5722",
            environments: "#FFEB3B",
            assets: "#2196F3", // azul
        },
        vue: {
            components: "#4CAF50",
            views: "#2196F3",
            store: "#FFEB3B",
            router: "#795548",
            composables: "#FF9800",
            modules: "#607D8B",
            assets: "#9C27B0", // morado
        },
    };
    // Buscar color específico del framework
    if (frameworkColors[framework]?.[folderName]) {
        return frameworkColors[framework][folderName];
    }
    // Buscar color común
    if (commonColors[folderName]) {
        return commonColors[folderName];
    }
    // Color por defecto
    return "#607D8B"; // gris azulado
}
exports.getFolderColor = getFolderColor;
/**
 * Crea el SVG para una carpeta cerrada
 */
function createFolderSvg(color) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <path d="M10,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8c0-1.1-0.9-2-2-2h-8L10,4z" fill="${color}"></path>
  </g>
</svg>`;
}
/**
 * Crea el SVG para una carpeta abierta
 */
function createFolderOpenSvg(color) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <path d="M20,6h-8l-2-2H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18H4V8h16V18z" fill="${color}" fill-opacity="0.9"></path>
    <path d="M4,8h16v10H4V8z" fill="${color}" fill-opacity="0.5"></path>
  </g>
</svg>`;
}
/**
 * Crea el SVG para un archivo
 */
function createFileSvg(color) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M16,18H8v-2h8V18z M16,14H8v-2h8V14z M13,9V3.5L18.5,9H13z" fill="${color}" fill-opacity="0.9"></path>
  </g>
</svg>`;
}
/**
 * GUÍA DE IMPLEMENTACIÓN DEL SISTEMA DE TEMAS DE ICONOS
 *
 * 1. ESTRUCTURA DE ARCHIVOS
 * ------------------------
 * Para que este sistema funcione, necesitas la siguiente estructura:
 *
 * fileicons/
 * ├── common/                 <- Carpeta con los SVGs compartidos entre temas
 * │   ├── folder-react.svg    <- Iconos base para cada framework
 * │   ├── folder-expanded-react.svg
 * │   ├── file-vue.svg
 * │   ├── folder-src.svg      <- Iconos para carpetas comunes
 * │   └── ...
 * ├── react/                  <- Carpeta con los SVGs específicos para React
 * │   ├── folder_components.svg <- Iconos específicos para carpetas
 * │   └── ...
 * ├── angular/                <- Similar para Angular
 * ├── vue/                    <- Similar para Vue
 * ├── default/                <- Iconos por defecto
 * ├── react-icon-theme.json   <- Archivos de definición de tema
 * ├── angular-icon-theme.json
 * ├── vue-icon-theme.json
 * └── default-icon-theme.json
 *
 * 2. FUNCIONAMIENTO CLAVE DEL TEMA
 * -------------------------------
 * Para que todas las carpetas tengan iconos, el tema debe incluir:
 *
 * - La propiedad "folder" que apunta a un icono por defecto (key en iconDefinitions)
 * - La propiedad "folderExpanded" para carpetas abiertas
 * - Una propiedad "folders" con una entrada wildcard "*" para asignar iconos a todas las carpetas
 * - Definiciones específicas en folderNames para carpetas especiales
 **/
//# sourceMappingURL=utils.js.map