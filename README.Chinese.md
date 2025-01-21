# What's This ?
这是一个用于自定义练习的软件。本项目名称为`prac`，其它相关内容将会存放在另外的以`prac-*`开头的仓库中。

# 重要
从v0.0.5版本开始，原仓库拆分为另一个仓库，本仓库为原仓库的prac子目录，原先的另外内容放入prac-others仓库
在打包为Android APK时，需要声明CAMERA和NFC权限。
从v0.2.5版本开始完善目录中的在指定目录存储课程的相关功能，该版本尚未完全完成此功能；由于历史原因，此功能放在MenuFs.jsx中。
从v0.3.0版本开始，构建为Android时，请修改相应的环境变量。
当选择多个文件时，仅能选择两个，请使用同名不同后缀名进行命名，例如主文件为x.json，另一个文件则请命名为x.meta.json，该文件中应该含有meta字段，两个文件的meta字段将会合并。

# 开发缘由
第一，许多软件不能自定义练习题；
第二，许多软件的各种数学、格式等不够美观；
第三，本软件完全开放源代码。

# 许可协议
GPL

# 开发思路
本软件主要以Web和基于WebView的APP为目标平台，在本软件中，主要分为单次练习和课程。
其中，课程由若干个单次练习组成，每次可进行一个单次练习的练习。

# 开发调试
WebApp
```
yarn start
HTTPS=true yarn start // 在HTTPS模式下调试
```
Android
```
yarn build
npx cap sync
npx cap run android
```
或者
```
yarn debug
```

# 备注
当前版本的一些功能还有待完善。
暂时请不要使用discuss字段。
