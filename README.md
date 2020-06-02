# autobest-common-ui 运行文档

## 本地Examples运行

`npm run dev`

运行后会自动打开window窗口

## 发布流程

首先打包 `npm run build`

打包后会生成dist文件夹，整体拷贝到服务器即可


## 组件库打包

`npm run build:lib`

会生成lib文件夹

## 发版

修改`package.json` 文件中version, 登录 `npm` (暂时Frey有权限)

并执行 `npm publish`