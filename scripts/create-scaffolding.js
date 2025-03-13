const fs = require('fs');
const path = require('path');

const frameworks = {
  react: [
    'components',
    'hooks',
    'contexts',
    'redux',
    'services',
    'pages',
    'assets',
  ],
  angular: [
    'app',
    'components',
    'services',
    'pipes',
    'directives',
    'environments',
    'assets',
  ],
  vue: [
    'components',
    'views',
    'store',
    'router',
    'composables',
    'modules',
    'assets',
  ],
};

const baseDir = path.join(__dirname, 'frameworks-placeholder');

for (const [framework, folders] of Object.entries(frameworks)) {
  const frameworkDir = path.join(baseDir, framework);
  if (!fs.existsSync(frameworkDir)) {
    fs.mkdirSync(frameworkDir, { recursive: true });
  }
  for (const folder of folders) {
    const folderDir = path.join(frameworkDir, folder);
    if (!fs.existsSync(folderDir)) {
      fs.mkdirSync(folderDir, { recursive: true });
    }
  }
}

console.log('Scaffolding created successfully.');