import fs from 'fs';

fs.writeFileSync(
  './dist/cjs/package.json',
  `{
  "type": "commonjs"
}`
);

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
delete packageJson.scripts;
delete packageJson.prettier;
delete packageJson.packageManager;
delete packageJson.devDependencies;
fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));

fs.copyFileSync('./README.md', './dist/README.md');
fs.copyFileSync('./LICENSE', './dist/LICENSE');
