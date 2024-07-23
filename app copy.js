const Koa = require('koa');
const app = new Koa();
// 引入Node.js的fs模块，用于文件系统的操作，如创建写入流等。
const fs = require('fs');
// 引入archiver模块，用于创建和管理文件归档（如ZIP文件）。
const archiver = require('archiver');
// 引入node-schedule模块，用于在Node.js中安排周期性执行的任务。
// const schedule = require('node-schedule');

// 定义一个函数zipDirectory，用于将指定目录（sourceDir）压缩到指定的输出文件（out）中。完成后调用回调函数（如果有）。
function zipDirectory(sourceDir, out, callback) {
  // 使用fs.createWriteStream创建一个写入流，用于将压缩后的数据写入到指定的输出文件（out）。
  let output = fs.createWriteStream(out);

  // 使用archiver模块创建一个归档实例，这里指定了归档类型为'zip'，并设置了压缩级别为9（最高）。
  let archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
  });

  // 监听输出流的'close'事件，当文件写入完成且流关闭时触发。这里打印了压缩后的总字节数，并调用了回调函数（如果有）。
  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes'); // 打印压缩后的总字节数
    console.log('archiver has been finalized and the output file descriptor has closed.'); // 打印流关闭的消息
    if (callback) callback(); // 如果提供了回调函数，则调用它
  });

  // 监听归档实例的'error'事件，如果在压缩过程中发生错误，则抛出异常。
  archive.on('error', function (err) {
    throw err; // 抛出错误
  });

  // 使用pipe方法将归档实例与输出流连接起来，这样归档中的数据就可以被写入到输出文件中了。
  archive.pipe(output);

  // 使用archive.directory方法将指定目录（sourceDir）下的所有文件和子目录添加到归档中。第二个参数为false，表示不递归子目录中的文件（但实际上，根据archiver的文档，这个参数通常被忽略，因为归档总是递归的）。
  archive.directory(sourceDir, false);

  // 调用archive.finalize方法来完成归档的创建过程。这将会结束归档的写入，并触发'close'事件（如果之前已经设置了监听器）。
  archive.finalize();
}

console.log('Starting to zip files...'); // 打印开始压缩的消息

// 注意：确保Node.js应用有足够的权限来访问和写入这些路径
zipDirectory(
  'E:\\source_folder',
  'E:\\output_folder\\archive_' + new Date().toISOString().replace(/:/g, '-').slice(0, 19) + '.zip',
  function () {
    // 压缩完成后打印消息
    console.log('Zip completed!');
  }
);

// 打印一条消息，表明已经安排了压缩任务。
console.log('Scheduled zip job.');

// 使用schedule.scheduleJob方法安排一个周期性任务，这里设置的是每天凌晨1点执行。
// const job = schedule.scheduleJob('0 1 * * *', function () {

// 响应
app.use((ctx, next) => {
  console.log(111);
  ctx.body = 'Hello Koa';
});
app.on('error', (err, ctx) => {
  console.log(err);
  ctx.body = 'Server Error: ' + err;
});
app.listen(3000, () => {
  console.log('http://127.0.0.1:3000');
});
