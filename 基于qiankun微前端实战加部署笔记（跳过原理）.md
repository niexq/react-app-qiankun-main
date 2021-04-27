
## 基于qiankun微前端实战加部署笔记
因业务需要，以下文字纯个人qiankun实战学习笔记，不谈原理只记操作过程，内容难免有纰漏部分，敬请不吝赐教批评指正。

![](https://i.loli.net/2021/04/23/BN6E45ZCUxtLhFX.gif)

### 预备知识点
+ 已对[qiankun](https://qiankun.umijs.org/)微前端有了初步认识;
+ 熟悉[react](https://react.docschina.org/)、[vuejs](https://cn.vuejs.org/);
+ 了解[github](https://github.com/)、[docker](https://www.docker.com/)、[jenkins](https://www.jenkins.io/)、[nginx](http://nginx.org/);

### 技术栈

#### 基座
+ 使用[create-react-app](https://github.com/facebook/create-react-app)初始化项目;
+ 安装```"qiankun": "^2.4.0"```;
+ 代码地址：[react-app-qiankun-main](https://github.com/niexq/react-app-qiankun-main);
+ 独立仓库，独立部署，独立域名：https://qiankun.xiaoqiang.tech;

#### react子应用
+ 使用[create-react-app](https://github.com/facebook/create-react-app)初始化项目;
+ 安装```"react-app-rewired": "^2.1.8"```、```"react-router-dom": "^5.2.0"```;
+ 代码地址：[react-app-qiankun-sub](https://github.com/niexq/react-app-qiankun-sub);
+ 独立仓库，独立部署，独立域名：https://react.xiaoqiang.tech;

#### vue子应用
+ 使用[vue-cli](https://github.com/vuejs/vue-cli)初始化项目，对应```"vue": "^3.0.0"```;
+ 安装```"vue-router": "^4.0.0-beta.11"```;
+ 代码地址：[vue-cli-qiankun-sub](https://github.com/niexq/vue-cli-qiankun-sub);
+ 独立仓库，独立部署，独立域名：https://vue.xiaoqiang.tech;

### 快速上手

#### 基座

+ 1.初始化项目
```bash
npm init react-app react-app-qiankun-main
```

+ 2.安装```qiankun```
```bash
yarn add qiankun # 或者 npm i qiankun -S
```

+ 3.目录结构
```js
react-app-qiankun-main
├── .env.local             // 本地环境
├── .env.development.local // 测试环境
├── .env.production.local  // 生产环境
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    └── components
          └── Loading.jsx
    └── store
          └── store.js // 主应用的全局状态
    ├── apps.js        // 子应用配置
    ├── App.css
    ├── App.js         // 基座布局，挂载子应用
    ├── App.test.js
    ├── index.css
    ├── index.js       // 主应用中注册微应用
    ├── logo.svg
    └── reportWebVitals.js
    └── setupTests.js
```

#### 基座（开撸代码）
+ 新增3个[.env](https://github.com/motdotla/dotenv)文件，主要配置不同环境的对应的域名
  + .env/.env.development.local（此处暂未区分本地和测试的域名，所有环境变量值都保持一致）
  ```js
    REACT_APP_SUB_REACT=//localhost:2233/react
    REACT_APP_SUB_VUE=//localhost:3344/vue
    PORT=1122
  ```

  + .env.production.local （生产环境）
  ```js
    REACT_APP_SUB_REACT = //qiankun.xiaoqiang.tech/react
    REACT_APP_SUB_VUE = //qiankun.xiaoqiang.tech/vue
  ```

+ 修改index.html挂载dom的默认id，防止与子应用id冲突
  ```js
    // 默认root => main-root
    <div id="main-root"></div>
  ```

+ 新增store/store.js，配置主应用的全局状态
  ```js
    import { initGlobalState } from 'qiankun';

    const initialState = {
      user: {
        name: 'qiankun'
      }
    };

    const actions = initGlobalState(initialState);

    actions.onGlobalStateChange((state, prev) => {
      for(const key in state) {
        initialState[key] = state[key];
      }
    })

    // 非官方api，https://github.com/umijs/qiankun/pull/729
    actions.getGlobalState = (key) => {
      return key ? initialState[key] : initialState;
    }

    export default actions;
  ```

+ 修改src/App.js，主要完成基座页面布局及增加挂载子应用的dom（id="subapp-viewport"）
  ```js
    function App(props) {
      // ...省略，详细可见源码
      return (
        <>
          <div className="mainapp">
            {/* 标题栏 */}
            <header className="mainapp-header">
              <ul className="mainapp-header-sidemenu">
                {/* 侧边栏 省略，详细可见源码 */}
              </ul>
            </header>
            <div className="mainapp-main">
              {/* 子应用 */}
              <main id="subapp-viewport"></main>
            </div>
          </div>
        </>
      );
    }
  ```
  
+ 增加apps.js，子应用的配置
  ```js
    import store from './store/store'
    const microApps = [
      {
        name: 'react',
        entry: process.env.REACT_APP_SUB_REACT,
        activeRule: '/react',
        container: '#subapp-viewport',
      },
      {
        name: 'vue',
        entry: process.env.REACT_APP_SUB_VUE,
        activeRule: '/vue',
        container: '#subapp-viewport',
      },
    ]

    const apps = microApps.map(item => {
      return {
        ...item,
        props: {
          routerBase: item.activeRule,
          getGlobalState: store.getGlobalState,
        }
      }
    })

    export default apps
  ```
+ 修改src/index.js，主应用中注册微（子）应用
  ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';
    import { registerMicroApps, start, setDefaultMountApp } from 'qiankun';
    import apps from './apps'

    function render({ appContent, loading }) {
      const container = document.getElementById('main-root');
      ReactDOM.render(
        <React.StrictMode>
          <App loading={loading} content={appContent} />
        </React.StrictMode>,
        container,
      )
    }

    const loader = loading => render({ loading });

    render({ loading: true });

    const microApps = apps.map((app => ({
      ...app,
      loader,
    })))
    registerMicroApps(microApps, {
      beforeLoad: app => {
        console.log('before load app.name=====>>>>>', app.name)
      },
      beforeMount: [
        app => {
          console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
        }
      ],
      afterMount: [
        app => {
          console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
        }
      ],
      afterUnmount: [
        app => {
          console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
        }
      ]
    })

    setDefaultMountApp('/react')

    start();
  ```
+ 本地启动
  ```bash
    npm start
  ```

#### react子应用

+ 1.初始化项目
```bash
npm init react-app react-app-qiankun-sub
```

+ 2.安装```react-app-rewired```、```react-router-dom```
```bash
npm i react-app-rewired --save-dev
npm i react-router-dom --save
```

+ 3.目录结构
```js
react-app-qiankun-sub
├── .env                 // 本地环境
├── config-overrides.js  // 覆盖create-react-app的webpack配置
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    └── components
          └── LibVersion.jsx
    └── pages
          └── Home.jsx
    ├── public-path.js // __webpack_public_path__
    ├── App.css
    ├── App.js         // 子应用布局
    ├── App.test.js
    ├── index.css
    ├── index.js       // 子应用入口，挂载dom导出相应的生命周期钩子
    ├── logo.svg
    └── reportWebVitals.js
    └── setupTests.js
```

#### react子应用（开撸代码）
+ 新增1个[.env](https://github.com/motdotla/dotenv)文件，主要配置本地环境
  
  此处PORT需要和基座REACT_APP_SUB_REACT端口保持一致
  ```js
    PORT=2233
  ```

+ 修改index.html挂载dom的默认id，防止与基座及其他子应用id冲突
  ```js
    // 默认root => sub-react-root
    <div id="sub-react-root"></div>
  ```

+ 新增src/public-path.js，__webpack_public_path__
  ```js
    if (window.__POWERED_BY_QIANKUN__) {
      // eslint-disable-next-line no-undef
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  ```

+ 修改src/App.js，主要完成子应用页面布局（略，见源码）
  
+ 修改src/index.js，微（子）应用导出相应的生命周期钩子
  ```js
    import './public-path';
    import React from 'react';
    import ReactDOM from 'react-dom';
    import './index.css';
    import App from './App';

    function getSubRootContainer(container) {
      return container ? container.querySelector('#sub-react-root') : document.querySelector('#sub-react-root');
    }

    function render(props) {
      const { container } = props;
      ReactDOM.render(
        <React.StrictMode>
          <App store={{...props}} />
        </React.StrictMode>,
        getSubRootContainer(container),
      );
    }

    function storeTest(props) {
      props.onGlobalStateChange((value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
      props.setGlobalState({
        ignore: props.name,
        user: {
          name: props.name,
        },
      });
    }

    if (!window.__POWERED_BY_QIANKUN__) {
      render({});
    }

    export async function bootstrap() {
      console.log('react app bootstraped');
    }

    export async function mount(props) {
      console.log('props from main framework', props);
      storeTest(props);
      render(props);
    }

    export async function unmount(props) {
      const { container } = props;
      ReactDOM.unmountComponentAtNode(getSubRootContainer(container));
    }
  ```

+ 增加config-overrides.js，覆盖create-react-app的webpack配置
  ```js
    const { name } = require('./package');
    module.exports = {
      webpack: config => {
        config.output.library = `${name}-[name]`;
        config.output.libraryTarget = 'umd';
        config.output.jsonpFunction = `webpackJsonp_${name}`;
        return config;
      },
      devServer: (configFunction) => {
        return (proxy, allowedHost) => {
          const config = configFunction(proxy, allowedHost);
          config.historyApiFallback = true;
          config.open = false;
          config.hot = false;
          config.watchContentBase = false;
          config.liveReload = false;
          config.headers = {
            'Access-Control-Allow-Origin': '*',
          };
          return config;
        }
      }
    }
  ```
+ 修改package.json
  ```js
    "scripts": {
      -   "start": "react-scripts start",
      +   "start": "react-app-rewired start",
      -   "build": "react-scripts build",
      +   "build": "react-app-rewired build",
      -   "test": "react-scripts test",
      +   "test": "react-app-rewired test",
      "eject": "react-scripts eject"
    },
  ```
+ 本地启动
  ```bash
    npm start
  ```

#### vue子应用

+ 1.初始化项目
```bash
npm install -g @vue/cli-service-global
vue create vue-cli-qiankun-sub
```

+ 2.安装```vue-router```
```bash
npm i vue-router --save
```

+ 3.目录结构
```js
vue-cli-qiankun-sub
├── .env                 // 本地环境
├── vue.config.js        // vue可选的配置文件
├── babel.config.js
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    └── components
         └── HelloWorld.vue
    └── router
          └── index.js
    └── views
          └── Home.vue
    ├── public-path.js  // __webpack_public_path__
    ├── App.vue         // 子应用布局
    └── main.js         // 子应用入口，挂载dom导出相应的生命周期钩子
```

#### vue子应用（开撸代码）
+ 新增1个[.env](https://github.com/motdotla/dotenv)文件，主要配置本地环境
  
  此处PORT需要和基座REACT_APP_SUB_VUE端口保持一致
  ```js
    PORT=3344
  ```

+ 修改index.html挂载dom的默认id，防止与基座及其他子应用id冲突
  ```js
    // 默认root => sub-vue-root
    <div id="sub-vue-roott"></div>
  ```

+ 新增src/public-path.js，__webpack_public_path__
  ```js
    if (window.__POWERED_BY_QIANKUN__) {
      // eslint-disable-next-line no-undef
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  ```

+ 修改src/App.vue，主要完成子应用页面布局（略，见源码）
  
+ 修改src/mian.js，微（子）应用导出相应的生命周期钩子
  ```js
    import './public-path';
    import { createApp } from 'vue';
    import { createRouter, createWebHistory } from 'vue-router';
    import App from './App.vue';
    import routes from './router';
    import store from './store';

    let router = null;
    let instance = null;
    let history = null;


    function render(props = {}) {
      const { container } = props;
      history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/');
      router = createRouter({
        history,
        routes,
      });

      instance = createApp(App);
      instance.use(router);
      instance.use(store);
      instance.mount(container ? container.querySelector('#sub-vue-root') : '#sub-vue-root');
    }

    if (!window.__POWERED_BY_QIANKUN__) {
      render();
    }

    export async function bootstrap() {
      console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
    }

    function storeTest(props) {
      props.onGlobalStateChange &&
        props.onGlobalStateChange(
          (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
          true,
        );
      props.setGlobalState &&
        props.setGlobalState({
          ignore: props.name,
          user: {
            name: props.name,
          },
        });
    }

    export async function mount(props) {
      storeTest(props);
      render(props);
      instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
      instance.config.globalProperties.$setGlobalState = props.setGlobalState;
    }

    export async function unmount() {
      instance.unmount();
      instance._container.innerHTML = '';
      instance = null;
      router = null;
      history.destroy();
    }
  ```

+ 增加vue.config.js配置文件
  ```js
    const path = require('path');
    const { name } = require('./package');

    function resolve(dir) {
      return path.join(__dirname, dir);
    }

    const port = 7105;

    module.exports = {
      outputDir: 'dist',
      assetsDir: 'static',
      filenameHashing: true,
      devServer: {
        hot: true,
        disableHostCheck: true,
        port,
        overlay: {
          warnings: false,
          errors: true,
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
      // 自定义webpack配置
      configureWebpack: {
        resolve: {
          alias: {
            '@': resolve('src'),
          },
        },
        output: {
          // 把子应用打包成 umd 库格式
          library: `${name}-[name]`,
          libraryTarget: 'umd',
          jsonpFunction: `webpackJsonp_${name}`,
        },
      },
    };

  ```
+ 修改package.json
  ```js
    "scripts": {
      +   "start": "vue-cli-service serve",
    },
  ```
+ 本地启动
  ```bash
    npm start
  ```

### 预览
以上操作完后，可以直接通过基座预览，子应用也可独立预览

#### 基座预览
```js
http://localhost:1122/
```

#### react子应用预览
```js
http://localhost:2233/
```

#### vue子应用预览
```js
http://localhost:3344/
```

### 部署

#### 备选方案
+ 1.单域名部署；
```js
// 基座：https://qiankun.xiaoqiang.tech
// react子应用：https://qiankun.xiaoqiang.tech/react
// vue子应用：https://qiankun.xiaoqiang.tech/vue
// 编译后服务器存储目录
react-app-qiankun
├── main
│   └── index.html
├── react
│   └── index.html
└── vue
    └── index.html
```

+ 2.多域名独立部署；（当篇笔记选择了多域名部署）
```js
// 基座：https://qiankun.xiaoqiang.tech
// 编译后服务器项目独立存储目录
react-app-qiankun-main
  └── index.html
```

```js
// react子应用：https://react.xiaoqiang.tech
// 编译后服务器项目独立存储目录
react-app-qiankun-sub
  └── index.html
```

```js
// vue子应用：https://vue.xiaoqiang.tech
// 编译后服务器项目独立存储目录
react-app-qiankun-main
└── index.html
```

#### 部署（以下只记录核心部署过程，过于简陋）
+ 前提：已购云服务器，并已安装[docker](https://help.aliyun.com/document_detail/51853.html?spm=a2c4g.11186623.4.1.20aa4c07DdFvHb)、[nginx](https://hub.docker.com/_/nginx)、[jenkins](https://www.jenkins.io/zh/doc/book/installing/)、3个独立域名及ssl证书

+ 本地编码，github存储代码，分别[新建3个公开代码库](https://github.com/new)
```js
// 基座：react-app-qiankun-main 存储到 https://github.com/niexq/react-app-qiankun-main
// react子应用：react-app-qiankun-sub 存储到 https://github.com/niexq/react-app-qiankun-sub
// vue子应用：vue-cli-qiankun-sub 存储到 https://github.com/niexq/vue-cli-qiankun-sub
```

+ [github,jenkins持续集成](https://www.cloudbees.com/blog/better-integration-between-jenkins-and-github-github-jenkins-plugin)

```js
// 详细配置步骤略
// github webHooks设置
// jenkins构建部分执行shell
BUILD_ID=dontKillMe
cd /var/jenkins_home/workspace/react-app-qiankun-main
npm install
npm run build
rm -rf /srv/www/react-app-qiankun-main
cp -rf /var/jenkins_home/workspace/react-app-qiankun-main/build /srv/www/react-app-qiankun-main/
```

+ 使用nginx代理
nginx.conf
```json

user root;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    #include /etc/nginx/conf.d/*.conf;

    server {
        listen 443;
        server_name qiankun.xiaoqiang.tech; # 你的域名
        ssl on;
        root www/react-app-qiankun-main; # 前台文件存放文件夹，可改成别的
        index index.html index.htm; # 上面配置的文件夹里面的index.html
        ssl_certificate cert/5543142_qiankun.xiaoqiang.tech.pem;   #将domain name.pem替换成您证书的文件名。
        ssl_certificate_key cert/5543142_qiankun.xiaoqiang.tech.key;   #将domain name.key替换成您证书的密钥文件名。
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
          # 用于配合 browserHistory使用
          try_files $uri $uri/ /index.html;
          # root /srv/www/react-app-qiankun-main;
          # index index.html index.htm;
        }
    }

    server {
        listen 443;
        server_name react.xiaoqiang.tech; # 你的域名
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        ssl on;
        root www/react-app-qiankun-sub; # 前台文件存放文件夹，可改成别的
        index index.html index.htm; # 上面配置的文件夹里面的index.html
        ssl_certificate cert/4325684_react.xiaoqiang.tech.pem;   #将domain name.pem替换成您证书的文件名。
        ssl_certificate_key cert/4325684_react.xiaoqiang.tech.key;   #将domain name.key替换成您证书的密钥文件名。
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
          # 用于配合 browserHistory使用
          try_files $uri $uri/ /index.html;
          # root /srv/www/react-app-qiankun-sub;
          # index index.html index.htm;
        }
    }

    server {
        listen 443;
        server_name vue.xiaoqiang.tech; # 你的域名
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        ssl on;
        root www/vue-cli-qiankun-sub; # 前台文件存放文件夹，可改成别的
        index index.html index.htm; # 上面配置的文件夹里面的index.html
        ssl_certificate cert/5556275_vue.xiaoqiang.tech.pem;   #将domain name.pem替换成您证书的文件名。
        ssl_certificate_key cert/5556275_vue.xiaoqiang.tech.key;   #将domain name.key替换成您证书的密钥文件名。
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
          # 用于配合 browserHistory使用
          try_files $uri $uri/ /index.html;
          # root /srv/www/vue-cli-qiankun-sub;
          # index index.html index.htm;
        }
    }
}

```

docker运行nginx命令，重点关注```-v 挂载目录```
```bash
docker run --name nginx4 -p 80:80 -p 443:443 -v /root/nginx/config/nginx.conf:/etc/nginx/nginx.conf -v /root/nginx/cert:/etc/nginx/cert -v /root/nginx/logs:/var/log/nginx -v /srv/www/bot:/etc/nginx/www/bot -v /srv/www/react-app-qiankun-main:/etc/nginx/www/react-app-qiankun-main -v /srv/www/react-app-qiankun-sub:/etc/nginx/www/react-app-qiankun-sub -v /srv/www/vue-cli-qiankun-sub:/etc/nginx/www/vue-cli-qiankun-sub --restart=always -d nginx:stable
```


### 总结
没有总结，遇到的问题太多，笔记总结的太杂，后期再分享出来

#### 线上预览地址：https://qiankun.xiaoqiang.tech
子应用线上也可独立预览

react子应用预览：https://react.xiaoqiang.tech

vue子应用预览：https://vue.xiaoqiang.tech


## 参考链接
[qiankun](https://qiankun.umijs.org/)

[qiankun-example](https://juejin.cn/post/6875462470593904653)

[qiankun 微前端方案实践及总结](https://juejin.cn/post/6844904185910018062)
