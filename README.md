# PhoeniX

## Introduction

- 基于 Electron 的综合性学习平台，集分布式评测、轻社交、资源发布等于一身
- 使用 Vue3 + TS + NaiveUI 制作，技术栈较新
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

其次，对于 Electron 镜像源，需要单独设置(使用华为或者阿里的 Electron 镜像均可，其优缺点也列在了下方)：

```sh
# 华为Electron镜像的设置方法，缺点是华为镜像更新不够及时
npm config set electron_mirror https://mirrors.huaweicloud.com/electron/
# 阿里Electron镜像的设置方法，缺点是日常使用和构建时需要不同的配置
npm config set electron_mirror https://npmmirror.com/mirrors/electron/ # 一般情况下的镜像配置
npm config set electron_mirror https://npmmirror.com/mirrors/electron/v # 构建时需要的镜像配置
```

## Credits

- 本项目使用的模板为[electron-vue-vite](https://github.com/caoxiemeihao/electron-vue-vite)
- 没有 [eletron](https://github.com/electron/electron) 项目及其社区，就没有这个项目
