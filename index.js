const inputFile = '/source/rss_photovoltaic_mes.sql';
const outputFile = '/output_directory/large-file.zip';
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 文件路径
// const inputFile = '/path/to/large/file';
// const outputFile = '/path/to/output/large-file.zip';

// 创建一个输出流
const output = fs.createWriteStream(outputFile);

// 创建一个zip归档器
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

// 将归档器的输出管道到文件
output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// 监听归档器的警告和错误事件
archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on('error', function (err) {
  throw err;
});

// 管道读取流到归档器
const fileStream = fs.createReadStream(inputFile);

// 在文件流结束时，调用 finalize()
fileStream.on('end', function () {
  archive.finalize();
});

archive.append(fileStream, { name: path.basename(inputFile) });

// 将归档器的输出流到输出文件
archive.pipe(output);
