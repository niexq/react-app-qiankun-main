# 💫 react-app-qiankun-main

> 基于create-react-app，qiankun构建并部署的测试用例（react主应用）

## 🚀 具体配置链接
[基于qiankun微前端实战+部署粗略笔记（跳过原理）](https://juejin.cn/post/6955861815884513288)

## ✨ 重要步骤

请先克隆子项目并运行子项目，一起预览效果

react子应用: [react-app-qiankun-sub](https://github.com/niexq/react-app-qiankun-sub)
vue子应用: [vue-cli-qiankun-sub](https://github.com/niexq/vue-cli-qiankun-sub)

## 🏄 预览
![](https://i.loli.net/2021/04/23/BN6E45ZCUxtLhFX.gif)

[克隆我](https://github.com/niexq/react-app-qiankun-main), 创建新的qiankun主应用项目!

## 🌴 使用

本地电脑环境
```bash
export MY_GITHUB_ORG=zhangsan
export MY_PROJECT_NAME=qiankun-main-SOMETHING
```

克隆
```bash
git clone git@github.com:niexq/react-app-qiankun-main.git

mv react-app-qiankun-main $MY_PROJECT_NAME

cd $MY_PROJECT_NAME

git remote rm origin

git remote add origin "git@github.com:$MY_GITHUB_ORG/$MY_PROJECT_NAME.git"

```

[新增项目 .env 文件](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used)

.env
```js
REACT_APP_SUB_REACT=//localhost:2233/react
REACT_APP_SUB_VUE=//localhost:3344/vue
PORT=1122
```

.env.production.local
```js
REACT_APP_SUB_REACT = //mywebsite.com/react
REACT_APP_SUB_VUE = //mywebsite.com/vue
```

安装及启动命令
```bash
npm install && npm run start
```

## 🎫 License

[MIT licensed](./LICENSE)
