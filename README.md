# tstopo
`tstopo` 是一个基于 Vue 3、Element Plus 和 Pinia 构建的前端应用程序。该项目使用了现代的前端工具链，包括 Vue CLI、Babel 和 ESLint，旨在为项目提供一个简洁、功能强大的 Web 界面。

## 项目介绍
`tstopo` 是一个用于展示拓扑图和模块化管理的前端应用程序，结合了 Vue.js、Element Plus UI 库和 Pinia 状态管理。

## 主要依赖
- **Vue 3**: 用于构建用户界面。
- **Element Plus**: 基于 Vue 3 的 UI 组件库，提供组件。
- **Pinia**: Vue 3 的状态管理库，提供简洁、模块化的状态管理解决方案。
- **core-js**: 提供 JavaScript Polyfill，确保兼容性。
- **color**: 颜色处理库，提供强大的颜色操作和转换功能。

## 安装
### 克隆项目
git clone https://github.com/yourusername/tstopo.git
cd tstopo

### 安装依赖
npm install

或者使用`yarn`安装：
yarn install

## 开发
在src/components文件夹下有四个SubComponent子文件夹，各个模块请在对应子文件下开发vue组件，对应关系请看项目结构
在开发过程中，您可以使用以下命令启动本地开发服务器：
npm run serve

该命令会启动开发服务器并自动打开浏览器，访问地址为 http://localhost:8080。

## 构建
要将应用程序构建为生产环境版本，可以运行以下命令：
npm run build

构建后的文件将存储在 dist/ 目录下，您可以将其部署到生产环境。

## 代码检查
此项目使用 ESLint 进行代码检查，确保代码风格一致且符合最佳实践。您可以运行以下命令来检查代码：
npm run lint

## 项目结构
tstopo/
├── public/                # 公共静态资源
├── src/                   # 源代码
│   ├── assets/            # 静态资源
│   ├── components/        # Vue 组件
|   |   ├──SubComponet_1   # 子页面1：网算一体
|   |   ├──SubComponet_2   # 子页面2：转义模块
|   |   ├──SubComponet_3   # 子页面3：网管模块
|   |   ├──SubComponet_4   # 子页面4：认知模块
|   |   ├──Homepage.vue    # 主页面
│   ├── stores/             # Pinia 状态管理
│   ├── utils/             # 工具库
│   ├── App.vue            # 主组件
│   ├── setting.js         # 主组件
│   └── main.js            # 入口文件
├── package.json           # 网站设置信息，请忽略
├── vue.config.js          # Vue CLI 配置
└── so on.                
