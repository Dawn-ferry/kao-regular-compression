// 异步函数来压缩子目录或文件
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
module.exports = async function zipItem(sourcePath, outputPath) {
  const stats = await fs.promises.stat(sourcePath);
  console.log('stats', stats.isFile());
  if (stats.isDirectory()) {
    const output = fs.createWriteStream(outputPath);

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    archive.pipe(output);
    archive.directory(sourcePath, false);
    archive
      .finalize()
      .then(() => {
        console.log(archive.pointer() + ' total bytes');
        console.log(`${sourcePath} has been compressed to ${outputPath}`);
      })
      .catch(err => {
        throw err;
      });
  } else if (stats.isFile()) {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    archive.pipe(output);
    archive.append(fs.createReadStream(sourcePath), { name: path.basename(sourcePath) });
    archive
      .finalize()
      .then(() => {
        console.log(`${sourcePath} has been compressed to ${outputPath}`);
      })
      .catch(err => {
        throw err;
      });
  }
};
