const fs = require("fs");

// update `VERSION` in package.json for the library
const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
const packagePath = `dist/a-datatable/package.json`;
package = fs.readFileSync(packagePath, 'utf8');
fs.writeFileSync(packagePath, package.replace(/VERSION/g, version));
