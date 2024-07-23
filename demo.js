const inputFile = '/source/rss_photovoltaic_mes.sql';
const outputFile = '/output_directory/large-file.zip';
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// 源文件和目标文件的路径
const sourceFilePath = path.join(__dirname, inputFile); // 10GB的文件
const targetFilePath = path.join(__dirname, outputFile); // 压缩后的文件

// 创建一个可读流来读取源文件
const sourceStream = fs.createReadStream(sourceFilePath);

// 创建一个gzip压缩流
const gzip = zlib.createGzip();

// 创建一个可写流来写入压缩后的文件
const targetStream = fs.createWriteStream(targetFilePath);

// 将源文件的流通过gzip压缩流，然后写入到目标文件
sourceStream
  .pipe(gzip)
  .pipe(targetStream)
  .on('finish', function () {
    console.log('文件压缩完成！');
  })
  .on('error', function (err) {
    console.error('在压缩过程中发生错误：', err);
  });
