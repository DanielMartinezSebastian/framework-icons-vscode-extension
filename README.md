# Framework Icons

Una extensión de Visual Studio Code que detecta automáticamente el framework de tu proyecto (React, Angular o Vue) y personaliza los iconos de carpetas para reflejar la arquitectura típica de ese framework.

## Características

- **Detección automática de frameworks**: Reconoce React, Angular y Vue basándose en la configuración del proyecto.
- **Iconos personalizados por framework**: Asigna colores específicos a carpetas según las convenciones de cada framework.
- **Actualización dinámica**: Actualiza los iconos al cambiar de proyecto o framework.
- **Personalización**: Permite ajustar el framework manualmente mediante la configuración de VSCode.

## Framework y carpetas soportadas

### React
- `components`: 🔵 Azul
- `hooks`: 🟢 Verde
- `contexts`: 🟣 Morado
- `assets`: 🟠 Naranja
- `redux`, `services`, `pages`: Con iconos personalizados

### Angular
- `src`: 🔴 Rojo
- `app`: 🟢 Verde
- `assets`: 🔵 Azul
- `environments`: 🟡 Amarillo
- `services`, `directives`, `pipes`, `components`: Con iconos personalizados

### Vue
- `components`: 🟢 Verde
- `views`: 🔵 Azul
- `store`: 🟡 Amarillo
- `assets`: 🟣 Morado
- `composables`, `router`, `modules`: Con iconos personalizados

## Comandos

- `Framework Icons: Detect Framework`: Fuerza la detección del framework y actualiza los iconos.

## Configuración

Esta extensión proporciona las siguientes configuraciones:

- `frameworkIcons.enabled`: Activa o desactiva la extensión.
- `frameworkIcons.detectFramework`: Activa o desactiva la detección automática de framework.
- `frameworkIcons.manualFramework`: Establece manualmente el framework a usar (solo si la detección automática está desactivada).

## Estructura del proyecto

La extensión utiliza la API oficial de File Icon Theme de VS Code:

```
extension-example/
├── fileicons/
│   ├── react/
│   │   ├── default_folder.svg
│   │   ├── folder_components.svg
│   │   └── ... (más iconos SVG)
│   ├── angular/
│   │   ├── default_folder.svg
│   │   ├── folder_src.svg
│   │   └── ... (más iconos SVG)
│   ├── vue/
│   │   ├── default_folder.svg
│   │   ├── folder_components.svg
│   │   └── ... (más iconos SVG)
│   ├── react-icon-theme.json
│   ├── angular-icon-theme.json
│   └── vue-icon-theme.json
└── src/
    ├── extension.ts
    ├── frameworkDetector.ts
    ├── iconThemeProvider.ts
    └── utils.ts
```

## Instalación

### Desde VS Code Marketplace
1. Abre VS Code
2. Presiona `Ctrl+P` / `Cmd+P`
3. Escribe `ext install framework-icons`
4. Presiona Enter

### Manual
1. Descarga el archivo `.vsix` desde la sección de releases
2. Abre VS Code
3. Ve a la pestaña de extensiones
4. Haz clic en el menú (...) y selecciona "Install from VSIX..."
5. Selecciona el archivo `.vsix` descargado

### Desarrollo
1. Clona este repositorio
2. Ejecuta `npm install`
3. Ejecuta `npm run generate-icons` para generar los iconos SVG
4. Abre el proyecto en VS Code y presiona F5 para iniciar el modo de depuración
5. Para empaquetar la extensión, usa `npm run package`

## Requisitos

- Visual Studio Code v1.60.0 o superior

## Cómo funciona

La extensión examina los archivos de configuración de tu proyecto para detectar qué framework está siendo utilizado, y luego aplica un tema de iconos predefinido que resalta las carpetas importantes para ese framework usando colores distintivos.

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios que te gustaría hacer.

## Licencia

MIT
