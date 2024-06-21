const fs = require('fs');
const path = require('path');

// Faili loendur rekursiivseks töötlemiseks
const fileContents = new Map();

// Funktsioon, et kontrollida, kas 'require' on kolmanda osapoole moodul
function isThirdPartyModule(modulePath) {
  return !modulePath.startsWith('.') && !path.isAbsolute(modulePath);
}

// Funktsioon, mis leiab kõik lokaalsed 'require' kutsed
function findLocalRequires(fileContent) {
  const requireRegex = /require\(['"](.+?)['"]\)/g;
  const requires = [];
  let match;
  while ((match = requireRegex.exec(fileContent)) !== null) {
    requires.push(match[1]);
  }
  return requires;
}

// Rekursiivne funktsioon, et töödelda faile ja nende 'require'-itud faile
function processFile(filePath) {
  if (fileContents.has(filePath)) return; // Väldi tsüklilisi viiteid

  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  fileContents.set(filePath, fileContent);

  const requires = findLocalRequires(fileContent);
  for (const req of requires) {
    // Kui see ei ole kolmanda osapoole moodul
    if (!isThirdPartyModule(req)) {
      // Leia absoluutne tee
      let resolvedPath;
      try {
        resolvedPath = require.resolve(path.resolve(path.dirname(filePath), req));
      } catch (error) {
        console.error(`Cannot resolve: ${req} in file: ${filePath}`);
        continue;
      }
      // Rekursiivselt töötle leitud fail
      processFile(resolvedPath);
    }
  }
}

// Funktsioon, et koondada kõik failid üheks
function bundleFiles(entryFile, outputFile) {
  // Alusta projekti põhi failist (nt. app.js)
  processFile(entryFile);

  // Kirjuta kõik failid üheks
  const bundledContent = Array.from(fileContents.values()).join('\n\n// --- File separator ---\n\n');
  fs.writeFileSync(outputFile, bundledContent, 'utf-8');
  console.log(`Bundled content written to ${outputFile}`);
}

// Kasuta skripti
const entryFile = './app.js'; // Siin on põhifail
const outputFile = './bundled.js'; // Väljundfail

bundleFiles(entryFile, outputFile);
