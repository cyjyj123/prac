# What's This ?
这是一个用于自定义练习的软件。本项目名称为`prac`，其它相关内容将会存放在另外的以`prac-*`开头的仓库中。

# 开发缘由
第一，许多软件不能自定义练习题；
第二，许多软件的各种数学、格式等不够美观；
第三，本软件完全开放源代码。

# 目录结构
本软件主要使用React开发，其代码位于`prac`子目录，App版使用`capcitor`，其位于`app`子目录中，静态资源使用`prac\build`。

关于练习文件的格式请参阅`format.md`和`examples`目录中的样例。

# 许可协议
GPL

# 开发调试
主要内容均位于`prac`子目录中
```
cd prac
```
调式web
```
npm start
```
调试Android版
```
npm build
npx cap sync
npx cap run android
```
或者
```
npm run debug
```

# 备注
当前版本的一些功能还有待完善。