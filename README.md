### 使用说明

~~~

1. 使用npm自定义命令 -- key=value
input=E:\\source ===>要打包的目录
output=E:\\output_directory ===>压缩后的目录
1.1各个平台会导致额不兼容
npm run dev -- PORT=8080 input=E:\source   output=E:\source\output_directory
1.2使用cross-env提供命令的兼容性
npx cross-env input=E:\\source output=E:\\source\output_directory node app.js

~~~