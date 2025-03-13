const fs = require("fs");
const path = require("path");

// Verifica que los archivos JSON de tema tengan la estructura correcta
function checkThemeFiles() {
  const themesDir = path.join(__dirname, "..", "fileicons");
  const themeFiles = [
    "react-icon-theme.json",
    "angular-icon-theme.json",
    "vue-icon-theme.json",
    "default-icon-theme.json",
  ];

  console.log("Verificando archivos de tema de iconos...");

  for (const file of themeFiles) {
    const filePath = path.join(themesDir, file);

    try {
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Archivo de tema no encontrado: ${file}`);
        continue;
      }

      // Lee y parsea el archivo JSON
      const themeContent = JSON.parse(fs.readFileSync(filePath, "utf8"));

      // Verifica campos obligatorios
      const requiredFields = [
        "iconDefinitions",
        "folderNames",
        "folderNamesExpanded",
        "folders",
        "foldersExpanded",
        "file",
        "rootFolder",
        "rootFolderExpanded",
      ];

      const missingFields = requiredFields.filter(
        (field) => !themeContent.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        console.error(
          `❌ Campos requeridos faltantes en ${file}: ${missingFields.join(
            ", "
          )}`
        );
      } else {
        console.log(`✅ Estructura correcta en ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error al procesar ${file}: ${error.message}`);
    }
  }
}

// Ejecutar la verificación
checkThemeFiles();
