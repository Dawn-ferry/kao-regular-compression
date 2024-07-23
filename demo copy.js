const inputFile = '/source/rss_photovoltaic_mes.sql';
const outputFile = '/output_directory/large-file.zip';
const fs = require('fs');
const zlib = require('zlib');
const ProgressStream = require('progress-stream');
const path = require('path');

// 设置源文件和目标文件的路径
const sourceFile = path.join(__dirname, inputFile); // 10GB的文件
const targetFile = path.join(__dirname, outputFile); // 压缩后的文件

// 创建一个可读流来读取源文件
const readStream = fs.createReadStream(sourceFile);

// 创建一个progress-stream来跟踪读取进度
const progress = new ProgressStream({
  length: fs.statSync(sourceFile).size, // 获取文件总大小
  time: 100 // 可选：显示进度的频率（毫秒）
});

// 创建一个gzip压缩流
const gzip = zlib.createGzip();

// 创建一个可写流来写入压缩后的文件
const writeStream = fs.createWriteStream(targetFile);

// 将可读流通过progress-stream（用于跟踪进度），然后gzip压缩流，最后写入可写流
readStream
  .pipe(progress)
  .on('progress', function (progressData) {
    // 显示进度（这里只显示百分比）
    console.log(`压缩进度: ${Math.floor(progressData.percentage * 100)}%`);
  })
  .pipe(gzip)
  .pipe(writeStream)
  .on('finish', function () {
    console.log('文件压缩完成！');
  })
  .on('error', function (err) {
    console.error('在压缩过程中发生错误：', err);
  });

console.log('开始压缩文件...');
