const fs = require("fs");
const path = require("path");

// Configuración de colores para cada framework
const frameworkColors = {
  react: {
    default: "#61DAFB",
    components: "#1976D2", // azul
    hooks: "#4CAF50", // verde
    contexts: "#9C27B0", // morado
    assets: "#FF9800", // naranja
    services: "#795548", // marrón
    redux: "#764ABC", // púrpura
    pages: "#00BCD4", // cyan
  },
  angular: {
    default: "#DD0031",
    src: "#F44336", // rojo
    app: "#4CAF50", // verde
    assets: "#2196F3", // azul
    environments: "#FFEB3B", // amarillo
    services: "#795548", // marrón
    directives: "#FF5722", // naranja oscuro
    pipes: "#607D8B", // gris azulado
    components: "#3F51B5", // índigo
  },
  vue: {
    default: "#4FC08D",
    components: "#4CAF50", // verde
    views: "#2196F3", // azul
    store: "#FFEB3B", // amarillo
    assets: "#9C27B0", // morado
    composables: "#FF9800", // naranja
    router: "#795548", // marrón
    modules: "#607D8B", // gris azulado
  },
  default: {
    default: "#607D8B",
    src: "#607D8B", // gris azulado
    components: "#607D8B", // gris azulado
    assets: "#607D8B", // gris azulado
  },
};

// Plantilla SVG para iconos de carpeta cerrada (estilo Material Design)
function createFolderSvg(color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <path d="M10,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8c0-1.1-0.9-2-2-2h-8L10,4z" fill="${color}"></path>
  </g>
</svg>`;
}

// Plantilla SVG para iconos de carpeta abierta
function createFolderOpenSvg(color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <path d="M20,6h-8l-2-2H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18H4V8h16V18z" fill="${color}" fill-opacity="0.9"></path>
    <path d="M4,8h16v10H4V8z" fill="${color}" fill-opacity="0.5"></path>
  </g>
</svg>`;
}

// Plantilla SVG para iconos de archivo
function createFileSvg(color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M16,18H8v-2h8V18z M16,14H8v-2h8V14z M13,9V3.5L18.5,9H13z" fill="${color}" fill-opacity="0.9"></path>
  </g>
</svg>`;
}

// Generar los iconos para cada framework
function generateIcons() {
  const basePath = path.join(__dirname, "..");

  for (const [framework, colors] of Object.entries(frameworkColors)) {
    const frameworkDir = path.join(basePath, "fileicons", framework);

    // Crear el directorio si no existe
    if (!fs.existsSync(frameworkDir)) {
      fs.mkdirSync(frameworkDir, { recursive: true });
    }

    // Crear icono de archivo genérico
    fs.writeFileSync(
      path.join(frameworkDir, "file.svg"),
      createFileSvg(colors.default)
    );

    // Crear icono de carpeta por defecto (cerrada y abierta)
    fs.writeFileSync(
      path.join(frameworkDir, "default_folder.svg"),
      createFolderSvg(colors.default)
    );

    fs.writeFileSync(
      path.join(frameworkDir, "default_folder_open.svg"),
      createFolderOpenSvg(colors.default)
    );

    // Crear los iconos específicos (cerrados y abiertos)
    for (const [folderName, color] of Object.entries(colors)) {
      if (folderName !== "default") {
        fs.writeFileSync(
          path.join(frameworkDir, `folder_${folderName}.svg`),
          createFolderSvg(color)
        );

        fs.writeFileSync(
          path.join(frameworkDir, `folder_${folderName}_open.svg`),
          createFolderOpenSvg(color)
        );
      }
    }
  }

  console.log("Iconos generados exitosamente.");
}

// Ejecutar la generación
generateIcons();
