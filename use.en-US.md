# 💫 react-app-qiankun-main

> Based on create-react-app, qiankun builds and deploys a simple main demo

## 🚀 Link
[Based on qiankun micro-front-end actual combat + rough notes on deployment (skip principle)](https://juejin.cn/post/6955861815884513288)

## ✨ Important

Please clone the sub-project and run the sub-project first, and preview the effect together with it

react-sub-project: [react-app-qiankun-sub](https://github.com/niexq/react-app-qiankun-sub)
vue-sub-project: [vue-cli-qiankun-sub](https://github.com/niexq/vue-cli-qiankun-sub)

## 🏄 Preview
![](https://i.loli.net/2021/04/23/BN6E45ZCUxtLhFX.gif)

[Clone me](https://github.com/niexq/react-app-qiankun-main), to create a new qiankun main project!

## 🌴 Use
computer env
```bash
export MY_GITHUB_ORG=zhangsan
export MY_PROJECT_NAME=qiankun-main-SOMETHING
```

clone
```bash
git clone git@github.com:niexq/react-app-qiankun-main.git

mv react-app-qiankun-main $MY_PROJECT_NAME

cd $MY_PROJECT_NAME

git remote rm origin

git remote add origin "git@github.com:$MY_GITHUB_ORG/$MY_PROJECT_NAME.git"

```

[add project .env file](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used)

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

run
```bash
npm install && npm run start
```

## Reference Link
[qiankun](https://qiankun.umijs.org/)

[qiankun-example](https://juejin.cn/post/6875462470593904653)

## 🎫 License

[MIT licensed](./LICENSE)
