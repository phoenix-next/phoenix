# PhoeniX

## Introduction

- 基于 Electron 的综合性学习平台，集分布式评测、轻社交、资源发布等于一身
- 拥抱 Typescript，使用 Vue3 作为前端框架，NaiveUI 作为组件库，xicons 作为图标库
- 本项目为桌面客户端，Shell 客户端位于[这里](https://github.com/phoenix-next/phoenix-shell)，而服务端位于[这里](https://github.com/phoenix-next/phoenix-server)

## Development

为了开发本项目，需要 Node 14 及以上(推荐使用最新 LTS 版本的 Node)，执行以下命令即可运行客户端：

```bash
git clone https://github.com/phoenix-next/phoenix
cd phoenix
npm ci
npm run dev
```

## Build

构建环境和开发环境的需求一致，在项目目录下执行以下命令即可构建本项目：

```bash
npm run build
```

构建完成之后，构建产物将位于`release`文件夹下。

## Mirror

若由于 GFW 等原因无法构建项目，以下是解决方案：

若 Naive-UI 等依赖库下载失败，则可使用如下命令更换 npm 源：

```bash
npm config set registry https://registry.npmmirror.com/
```

若 Electron 下载失败，则可设置 Electron 的镜像源：

```bash
npm config set ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm config set ELECTRON_CUSTOM_DIR="v{{ version }}"
```

若设置 Electron 镜像源后仍有报错 `Electron failed to install correctly, please delete node_modules/electron and try installing again`，则可进行如下操作手动安装 Electron：

1. 前往淘宝镜像 https://npmmirror.com/mirrors/electron/ 手动下载对应版本的 electron 包
2. 在 node_modules\electron\下创建 dist 文件夹，将下载的压缩包解压进刚刚创建的 dist 目录
3. 在 node_modules\electron\中创建 path.txt，内容为 electron.exe(根据平台而定，Windows 下后缀为 exe)

若 Electron-Builder 下载失败，则可设置 Electron-Builder 的镜像源：

```bash
npm config set ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
```

## Tips

- 本项目在开发过程中可以热更新(HMR)，一般不需要重启应用来查看代码的更改效果
- Vite 静态服务器需要在命令行中关闭(不能靠关闭 PhoeniX 来关闭)
- 开发过程中建议使用 vscode，并启用 Volar 的 [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussion-3561961)
- 项目的路径**不能包含中文**，否则项目可能会无法正常运行
- 打开火绒时，不能下载 Electron-Builder 的依赖，建议开发时关闭火绒。详情见[这里](https://blog.csdn.net/qiuqiang748/article/details/106902082)

## Credits

- 本项目使用的模板为[electron-vue-vite](https://github.com/caoxiemeihao/electron-vue-vite)，借鉴了[fluent-reader](https://github.com/yang991178/fluent-reader)的架构
- 没有 [Eletron](https://github.com/electron/electron) 框架和[Vue](https://github.com/vuejs/core)框架，就没有这个项目
- 感谢 [07akioni](https://github.com/07akioni)维护的[NaiveUI](https://github.com/TuSimple/naive-ui)组件库和[xicons](https://github.com/07akioni/xicons)图标库
