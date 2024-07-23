const fs = require('fs');
const path = require('path');
// 引入archiver模块，用于创建和管理文件归档
const archiver = require('archiver');
const { readdir } = require('fs').promises;
const Koa = require('koa');
const app = new Koa();

let inputPath = process.env.input;
let outputPath = process.env.output;
if (!inputPath && !outputPath) {
  console.error('暂无路径');
  return;
}

// 异步函数来压缩子目录或文件
async function zipItem(sourcePath, outputPath) {
  // from[需要压缩文件的路径]   to[压缩后的文件路径]
  const stats = await fs.promises.stat(sourcePath);
  // 如果是目录，则压缩整个目录
  if (stats.isDirectory()) {
    // 使用fs.createWriteStream创建一个写入流，用于将压缩后的数据写入到指定的输出文件（out）。
    const output = fs.createWriteStream(outputPath);
    // 使用archiver模块创建一个归档实例，这里指定了归档类型为'zip'，并设置了压缩级别为9（最高）。
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // 使用pipe方法将归档实例与输出流连接起来，这样归档中的数据就可以被写入到输出文件中了。
    archive.pipe(output);
    archive.directory(sourcePath, false); // 第二个参数为false，表示不包含源目录本身
    archive
      .finalize()
      .then(() => {
        console.log(archive.pointer() + ' total bytes'); // 打印压缩后的总字节数
        console.log(`${sourcePath} has been compressed to ${outputPath}`);
      })
      .catch(err => {
        throw err;
      });
  } else if (stats.isFile()) {
    // 如果是文件，则只压缩该文件
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
}

async function zipEachItem(sourceDir, outputDir) {
  // from[需要压缩文件的路径]   to[压缩后的文件路径]
  // 异步读取目录的内容
  const entries = await readdir(sourceDir, { withFileTypes: true });
  console.log('entries', entries);

  for (const entry of entries) {
    const fullPath = path.join(sourceDir, entry.name);
    console.log('fullPath', fullPath);
    let outputPath;

    // ${entry.name} 是一个目录
    if (entry.isDirectory()) {
      // 对于子目录，生成ZIP文件名
      outputPath = path.join(outputDir, `${path.basename(entry.name)}.zip`);
      // outputPath = path.join(path.dirname(sourceDir), `${文件名前缀名字}_${entry.name}.zip`);
    } else if (entry.isFile()) {
      // 计算相对路径
      // from：起始路径（或基路径）  const sourceDir = '/a/b/c';
      // to：目标路径 const fullPath = '/a/b/c/d/e/f.txt';
      //  输出: d/e/f.txt
      const relativePath = path.relative(sourceDir, fullPath);
      // 文件路径 /a/b/c/d/e/f.txt ==> /a/b/c/d/e
      const outputDirForFile = path.dirname(path.join(outputDir, relativePath));
      await fs.promises.mkdir(outputDirForFile, { recursive: true });
      // console.log(`${outputDirForFile} 目录已创建（或已存在）`);
      // outputPath = path.join(outputDirForFile, `${path.basename(fullPath)}.zip`);
      // 使用简化的文件名（不包含完整目录结构）
      outputPath = path.join(outputDir, `${path.basename(fullPath)}.zip`);
    }
    console.log('outputPath----------', outputPath);

    if (outputPath) {
      await zipItem(fullPath, outputPath);
    }
  }
}

// 调用函数
// zipEachItem('./source', './output_directory')
zipEachItem(inputPath, outputPath)
  .then(() => {
    console.log('All items have been compressed into separate ZIP files.');
  })
  .catch(err => {
    console.error('Error during zipping:', err);
  });
// 响应
// app.use((ctx, next) => {
//   console.log(111);
//   ctx.body = 'Hello Koa';
// });
app.on('error', (err, ctx) => {
  console.log(err);
  ctx.body = 'Server Error: ' + err;
});
app.listen(8001, () => {
  console.log('http://127.0.0.1:8001');
});
