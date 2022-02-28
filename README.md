# PhoeniX

## Introduction

- 基于 Electron 的综合性学习平台，集分布式评测、轻社交、资源发布等于一身
- 拥抱 Typescript，使用 Vue3 作为前端框架，NaiveUI 作为组件库，xicons 作为图标库
- 本项目为桌面客户端，Shell 客户端位于[这里](https://github.com/phoenix-next/phoenix-shell)，而服务端位于[这里](https://github.com/phoenix-next/phoenix-server)

## Development

为了开发本项目，需要 Node 14 及以上(推荐使用最新 LTS 版本的 Node)，执行以下命令即可运行客户端：

```sh
git clone https://github.com/phoenix-next/phoenix
cd phoenix
npm install
npm run dev
```

另外，还有几点需要注意：

1. 本项目在开发过程中可以热更新(HMR)，不需要重启应用来查看代码的更改效果
2. Vite 静态服务器需要在命令行中关闭(不能靠关闭 PhoeniX 来关闭)
3. 开发过程中建议使用 vscode，并启用 Volar 的 [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussion-3561961)

## Build

构建环境和开发环境的需求一致，在项目目录下执行以下命令即可构建本项目：

```sh
npm run build
```

构建完成之后，构建产物将位于`release`文件夹下。

## Mirror

若由于 GFW 等原因无法构建项目，以下是解决方案：

首先，使用如下命令更换 npm 源：

```sh
npm config set registry https://registry.npmmirror.com/
```

其次，对于 Electron 镜像源，需要单独设置(使用华为或者阿里的 Electron 镜像均可)：

```sh
# 华为Electron镜像的设置方法，缺点是华为镜像更新不够及时
npm config set ELECTRON_MIRROR="https://mirrors.huaweicloud.com/electron/"
# 阿里Electron镜像的设置方法
npm config set ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm config set ELECTRON_CUSTOM_DIR="v{{ version }}"
```

## Credits

- 本项目使用的模板为[electron-vue-vite](https://github.com/caoxiemeihao/electron-vue-vite)，借鉴了[fluent-reader](https://github.com/yang991178/fluent-reader)的架构
- 没有 [Eletron](https://github.com/electron/electron) 框架和[Vue](https://github.com/vuejs/core)框架，就没有这个项目
- 感谢 [07akioni](https://github.com/07akioni)维护的[NaiveUI](https://github.com/TuSimple/naive-ui)组件库和[xicons](https://github.com/07akioni/xicons)图标库
