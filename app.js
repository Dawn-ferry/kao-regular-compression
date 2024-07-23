const inputPath = process.env.input;
const outputPath = process.env.output;
const zipEachItem = require('./utils/zipDirectory');
if (!inputPath && !outputPath) {
  console.error('暂无路径');
  return;
}

zipEachItem(inputPath, outputPath)
  .then(() => {
    console.log('All items have been compressed into separate ZIP files.');
  })
  .catch(err => {
    console.error('Error during zipping:', err);
  });
