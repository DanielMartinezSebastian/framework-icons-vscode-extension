const fs = require("fs");
const path = require("path");

// Verificar que los archivos compilados existen
const outDir = path.join(__dirname, "..", "out");
const mainFile = path.join(outDir, "extension.js");

console.log("Verificando estructura de archivos para empaquetado...");

// Verificar directorio out
if (!fs.existsSync(outDir)) {
  console.error(
    '❌ El directorio "out/" no existe. Ejecuta primero "npm run compile".'
  );
  process.exit(1);
}

// Verificar archivo principal
if (!fs.existsSync(mainFile)) {
  console.error(
    '❌ El archivo "out/extension.js" no existe. Compila primero con "npm run compile".'
  );
  process.exit(1);
}

// Verificar estructura de iconos
const iconDirs = ["react", "angular", "vue", "default"];
const fileiconsDir = path.join(__dirname, "..", "fileicons");

for (const dir of iconDirs) {
  const iconDir = path.join(fileiconsDir, dir);
  if (!fs.existsSync(iconDir)) {
    console.error(
      `❌ El directorio "fileicons/${dir}/" no existe. Ejecuta "npm run generate-icons".`
    );
    process.exit(1);
  }

  // Verificar iconos de carpeta predeterminados necesarios
  const requiredIcons = [
    "default_folder.svg",
    "default_folder_open.svg",
    "file.svg",
  ];
  for (const icon of requiredIcons) {
    if (!fs.existsSync(path.join(iconDir, icon))) {
      console.error(
        `❌ Falta el ícono "${icon}" en "fileicons/${dir}/". Ejecuta "npm run generate-icons".`
      );
      process.exit(1);
    }
  }
}

// Si llegamos aquí, todo está bien
console.log("✅ Estructura de archivos correcta para empaquetado.");
