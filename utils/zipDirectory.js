const { readdir } = require('fs').promises;
const fs = require('fs');
const path = require('path');

module.exports = async function zipEachItem(sourceDir, outputDir) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(sourceDir, entry.name);
    let outputPath;
    if (entry.isDirectory()) {
      outputPath = path.join(outputDir, `${path.basename(entry.name)}.zip`);
    } else if (entry.isFile()) {
      const relativePath = path.relative(sourceDir, fullPath);
      const outputDirForFile = path.dirname(path.join(outputDir, relativePath));
      await fs.promises.mkdir(outputDirForFile, { recursive: true });
      outputPath = path.join(outputDir, `${path.basename(fullPath)}.zip`);
    }
    if (outputPath) {
      // await zipItem();
      await require('./zipItem')(fullPath, outputPath);
    }
  }
};
