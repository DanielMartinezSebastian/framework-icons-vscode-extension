import * as vscode from "vscode";

// Definición mejorada para la estructura de tema de iconos
interface IconDefinitions {
  // Propiedades esenciales para que VS Code reconozca los iconos por defecto
  // Estas deben ser cadenas que referencian a las definiciones en iconDefinitions
  folder: string;
  folderExpanded: string;
  file: string; // Agregamos file como propiedad obligatoria
  
  // Definiciones específicas para carpetas y archivos
  folderNames: { [key: string]: string };
  folderNamesExpanded: { [key: string]: string };
  iconDefinitions: {
    [key: string]: {
      iconPath: string;
    };
  };
  
  // Soporte para modo light y alto contraste
  light?: {
    folder: string;
    folderExpanded: string;
    folderNames?: { [key: string]: string };
    folderNamesExpanded?: { [key: string]: string };
  };
  highContrast?: {
    folder: string;
    folderExpanded: string;
    folderNames?: { [key: string]: string };
    folderNamesExpanded?: { [key: string]: string };
  };
  
  // Propiedades opcionales
  fileExtensions?: { [key: string]: string };
  fileNames?: { [key: string]: string };
  rootFolder?: { iconPath: string };
  rootFolderExpanded?: { iconPath: string };
}

export function getIconDefinitions(framework: string): IconDefinitions {
  // Nombres de iconos por defecto - IMPORTANTE: Deben coincidir con las claves en iconDefinitions
  const defaultFolderIcon = "default_folder";
  const defaultFolderExpandedIcon = "default_folder_open";
  const defaultFileIcon = "default_file";

  // Definiciones básicas para cada framework
  const definitions: IconDefinitions = {
    // Propiedades esenciales para que VS Code reconozca los iconos por defecto
    folder: defaultFolderIcon,
    folderExpanded: defaultFolderExpandedIcon,
    file: defaultFileIcon,
    
    // Mapeos por nombre de carpeta
    folderNames: {},
    folderNamesExpanded: {},
    
    // Definiciones de iconos
    iconDefinitions: {
      [defaultFolderIcon]: {
        iconPath: `./${framework}/default_folder.svg`,
      },
      [defaultFolderExpandedIcon]: {
        iconPath: `./${framework}/default_folder_open.svg`,
      },
      [defaultFileIcon]: {
        iconPath: `./${framework}/file.svg`,
      },
    },
    
    // Soporte para modo light y high contrast
    light: {
      folder: defaultFolderIcon,
      folderExpanded: defaultFolderExpandedIcon,
      folderNames: {},
      folderNamesExpanded: {},
    },
    highContrast: {
      folder: defaultFolderIcon,
      folderExpanded: defaultFolderExpandedIcon,
      folderNames: {},
      folderNamesExpanded: {},
    },
    
    fileExtensions: {},
    fileNames: {},
  };

  // Función para agregar un ícono de carpeta correctamente
  function addFolderIcon(name: string): void {
    const iconName = `folder_${name}`;
    const expandedIconName = `folder_${name}_open`;

    // Definir los iconos correctamente
    definitions.iconDefinitions[iconName] = {
      iconPath: `./${framework}/folder_${name}.svg`,
    };

    definitions.iconDefinitions[expandedIconName] = {
      iconPath: `./${framework}/folder_${name}_open.svg`,
    };

    // Asignar a nombres de carpeta
    definitions.folderNames[name] = iconName;
    definitions.folderNamesExpanded[name] = expandedIconName;
    
    // También agregar al modo light y high contrast
    if (definitions.light && definitions.light.folderNames) {
      definitions.light.folderNames[name] = iconName;
    }
    if (definitions.light && definitions.light.folderNamesExpanded) {
      definitions.light.folderNamesExpanded[name] = expandedIconName;
    }
    if (definitions.highContrast && definitions.highContrast.folderNames) {
      definitions.highContrast.folderNames[name] = iconName;
    }
    if (definitions.highContrast && definitions.highContrast.folderNamesExpanded) {
      definitions.highContrast.folderNamesExpanded[name] = expandedIconName;
    }
  }

  // Carpetas comunes para todos los frameworks
  const commonFolders = ["src", "public", "test", "docs", "dist", "build"];
  
  // Agregar iconos para carpetas comunes en todos los frameworks
  if (framework !== "default") {
    commonFolders.forEach(folder => {
      addFolderIcon(folder);
    });
  }

  // Configurar iconos específicos según el framework
  switch (framework) {
    case "react":
      addFolderIcon("components");
      addFolderIcon("hooks");
      addFolderIcon("contexts");
      addFolderIcon("assets");
      addFolderIcon("services");
      addFolderIcon("redux");
      addFolderIcon("pages");
      
      // Alias para carpetas con nombres alternativos pero mismo icono
      definitions.folderNames["context"] = "folder_contexts";
      definitions.folderNamesExpanded["context"] = "folder_contexts_open";
      definitions.folderNames["store"] = "folder_redux";
      definitions.folderNamesExpanded["store"] = "folder_redux_open";
      break;

    case "angular":
      addFolderIcon("app");
      addFolderIcon("assets");
      addFolderIcon("environments");
      addFolderIcon("services");
      addFolderIcon("directives");
      addFolderIcon("pipes");
      addFolderIcon("components");
      addFolderIcon("guards"); // Agregando carpeta 'guards' común en Angular
      break;

    case "vue":
      addFolderIcon("components");
      addFolderIcon("views");
      addFolderIcon("store");
      addFolderIcon("assets");
      addFolderIcon("composables");
      addFolderIcon("router");
      addFolderIcon("modules");
      break;

    case "default":
      // Para el tema por defecto, no agregamos iconos específicos
      // para que todas las carpetas tengan el mismo icono
      break;

    default:
      // Iconos genéricos para frameworks desconocidos
      addFolderIcon("components");
      addFolderIcon("assets");
      break;
  }

  return definitions;
}
