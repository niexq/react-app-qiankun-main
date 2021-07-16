# 💫 react-app-qiankun-main

> Based on create-react-app, qiankun builds and deploys a simple main demo （react main demo）

[ 简体中文 ](./README.md) | English

## 🚀 Based on qiankun micro-front-end actual combat + rough notes on deployment (skip principle)
Due to business needs, the following text is purely personal qiankun practical study notes, not to talk about the principle, only the operation process, the content will inevitably have omissions, please feel free to criticize and correct.

![](https://i.loli.net/2021/04/23/BN6E45ZCUxtLhFX.gif)

### ✨ Target scene
![](https://i.loli.net/2021/04/27/RQycNgEzJBv5Som.png)

### 📝 Preliminary knowledge points
+ Have a preliminary understanding of [qiankun](https://qiankun.umijs.org/) micro front end;
+ Familiar with [react](https://react.docschina.org/)、[vue](https://cn.vuejs.org/);
+ Understand [github](https://github.com/)、[docker](https://www.docker.com/)、[jenkins](https://www.jenkins.io/)、[nginx](http://nginx.org/);

### 🔧 Technology stack

#### 🍔 React main application
+ Use [create-react-app](https://github.com/facebook/create-react-app) to initialize the project;
+ Install ```"qiankun": "^2.4.0"```;
+ Repositorie address：[react-app-qiankun-main](https://github.com/niexq/react-app-qiankun-main);
+ Independent repositorie, independent deployment, independent domain name：https://qiankun.xiaoqiang.tech;

#### 🍟 React sub application
+ Use [create-react-app](https://github.com/facebook/create-react-app) to initialize the project;
+ Install ```"react-app-rewired": "^2.1.8"```、```"react-router-dom": "^5.2.0"```;
+ Repositorie address：[react-app-qiankun-sub](https://github.com/niexq/react-app-qiankun-sub);
+ Independent repositorie, independent deployment, independent domain name：https://react.xiaoqiang.tech;

#### 🌮 Vue sub application
+ Use [vue-cli](https://github.com/vuejs/vue-cli) to initialize the project，correspond```"vue": "^3.0.0"```;
+ Install ```"vue-router": "^4.0.0-beta.11"```;
+ Repositorie address：[vue-cli-qiankun-sub](https://github.com/niexq/vue-cli-qiankun-sub);
+ Independent repositorie, independent deployment, independent domain name：https://vue.xiaoqiang.tech;

### 🚴‍♂️ Get started quickly

#### 🍔 React main application

+ 1.Initialize the project
```bash
npm init react-app react-app-qiankun-main
```

+ 2.Install ```qiankun```
```bash
yarn add qiankun # Or npm i qiankun -S
```

+ 3.Directory Structure

```js
react-app-qiankun-main
├── .env.local             // Local environment
├── .env.development.local // Develop environment
├── .env.production.local  // Production environment
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── components
    │     └── Loading.jsx
    ├── store
    │     └── store.js    // The global state of the main application
    ├── apps.js           // Sub-application configuration
    ├── App.css
    ├── App.js            // Base layout, mount sub-applications
    ├── App.test.js
    ├── index.css
    ├── index.js          // Register the micro application in the main application
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js
```

#### 🍔 React main application（go code）
+ Added 3 [.env](https://github.com/motdotla/dotenv) files，Mainly configure the corresponding domain names for different environments
  + .env/.env.development.local（There is no distinction between local and develop domain names here, and all environment variable values remain the same）

  ```js
    REACT_APP_SUB_REACT=//localhost:2233/react
    REACT_APP_SUB_VUE=//localhost:3344/vue
    PORT=1122
  ```

  + .env.production.local （Production environment）

  ```js
    REACT_APP_SUB_REACT = https://react.xiaoqiang.tech
    REACT_APP_SUB_VUE = https://vue.xiaoqiang.tech
  ```

+ Modify the default id of the ```index.html``` mounted dom to prevent conflicts with sub-application id

  ```js
    // default root => main-root
    <div id="main-root"></div>
  ```

+ Added [store/store.js](https://github.com/niexq/react-app-qiankun-main/blob/main/src/store/store.js)，Configure the global state of the main application

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

    // unofficial api，https://github.com/umijs/qiankun/pull/729
    actions.getGlobalState = (key) => {
      return key ? initialState[key] : initialState;
    }

    export default actions;
  ```

+ Modify [src/App.js](https://github.com/niexq/react-app-qiankun-main/blob/main/src/App.js)，Mainly complete the base page layout and increase the dom of the sub-application（id="subapp-viewport"）

  ```js
    function App(props) {
      // ...Omit, see the source code for details
      return (
        <>
          <div className="mainapp">
            {/* title */}
            <header className="mainapp-header">
              <ul className="mainapp-header-sidemenu">
                {/* Sidebar Omitted, see the source code for details */}
              </ul>
            </header>
            <div className="mainapp-main">
              {/* sub application */}
              <main id="subapp-viewport"></main>
            </div>
          </div>
        </>
      );
    }
  ```
  
+ Added [apps.js](https://github.com/niexq/react-app-qiankun-main/blob/main/src/apps.js)，Sub-application configuration

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
+ Modify [src/index.js](https://github.com/niexq/react-app-qiankun-main/blob/main/src/index.js)，Register the micro (sub) application in the main application

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
+ Local start
  ```bash
    npm start
  ```

#### 🍟 React sub application

+ 1.Initialize the project
```bash
npm init react-app react-app-qiankun-sub
```

+ 2.Install ```react-app-rewired```、```react-router-dom```
```bash
npm i react-app-rewired --save-dev
npm i react-router-dom --save
```

+ 3.Directory Structure

```js
react-app-qiankun-sub
├── .env                 // Local environment
├── config-overrides.js  // Override the webpack configuration of create-react-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── components
    │     └── LibVersion.jsx
    ├── pages
    │     └── Home.jsx
    ├── public-path.js // __webpack_public_path__
    ├── App.css
    ├── App.js         // Sub-application layout
    ├── App.test.js
    ├── index.css
    ├── index.js       // Sub-application entrance, mount dom to export the corresponding life cycle hook
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js
```

#### 🍟 React sub application（go code）
+ Added 1 [.env](https://github.com/motdotla/dotenv) files，Mainly configure the local environment
  
  Here PORT needs to be consistent with the main application ```REACT_APP_SUB_REACT``` port

  ```js
    PORT=2233
  ```

+ Modify the default id of the ```index.html``` mounted dom to prevent conflicts with the id of the base and other sub-applications

  ```js
    // default root => sub-react-root
    <div id="sub-react-root"></div>
  ```

+ Added [src/public-path.js](https://github.com/niexq/react-app-qiankun-sub/blob/main/src/public-path.js)，__webpack_public_path__

  ```js
    if (window.__POWERED_BY_QIANKUN__) {
      // eslint-disable-next-line no-undef
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  ```

+ Modify [src/App.js](https://github.com/niexq/react-app-qiankun-sub/blob/main/src/App.js)，Mainly complete the sub-application page layout (omitted, see source code)
  
+ Modify [src/index.js](https://github.com/niexq/react-app-qiankun-sub/blob/main/src/index.js)Micro (sub) applications export the corresponding life cycle hooks

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

+ Added [config-overrides.js](https://github.com/niexq/react-app-qiankun-sub/blob/main/config-overrides.js)，Override the webpack configuration of create-react-app

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
+ Modify ````package.json```

  ```json
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
+ Local start
  ```bash
    npm start
  ```

#### 🌮 Vue sub application

+ 1.Initialize the project
```bash
npm install -g @vue/cli-service-global
vue create vue-cli-qiankun-sub
```

+ 2.Install ```vue-router```
```bash
npm i vue-router --save
```

+ 3.Directory Structure

```js
vue-cli-qiankun-sub
├── .env                 // Local environment
├── vue.config.js        // Vue optional configuration file
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
    ├── components
    │    └── HelloWorld.vue
    ├── router
    │     └── index.js
    ├── views
    │     └── Home.vue
    ├── public-path.js  // __webpack_public_path__
    ├── App.vue         // Sub-application layout
    └── main.js         // Sub-application entrance, mount dom to export the corresponding life cycle hook
```

#### 🌮 Vue sub application（go code）
+ Added 1 [.env](https://github.com/motdotla/dotenv) files，Mainly configure the local environment
  
Here PORT needs to be consistent with the main application ```REACT_APP_SUB_VUE``` port

  ```js
    PORT=3344
  ```

+ Modify the default id of the ```index.html``` mounted dom to prevent conflicts with the id of the base and other sub-applications

  ```js
    // default root => sub-vue-root
    <div id="sub-vue-root"></div>
  ```

+ Added [src/public-path.js](https://github.com/niexq/vue-cli-qiankun-sub/blob/main/src/public-path.js)，__webpack_public_path__

  ```js
    if (window.__POWERED_BY_QIANKUN__) {
      // eslint-disable-next-line no-undef
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  ```

+ Modify [src/App.vue](https://github.com/niexq/vue-cli-qiankun-sub/blob/main/src/App.vue)，Mainly complete the sub-application page layout (omitted, see source code)
  
+ Modify [src/mian.js](https://github.com/niexq/vue-cli-qiankun-sub/blob/main/src/main.js)，Micro (sub) applications export the corresponding life cycle hooks

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

+ Added [vue.config.js](https://github.com/niexq/vue-cli-qiankun-sub/blob/main/vue.config.js) Configuration file

  ```js
    const path = require('path');
    const { name } = require('./package');

    function resolve(dir) {
      return path.join(__dirname, dir);
    }

    const port = process.env.PORT;

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
      // Custom webpack configuration
      configureWebpack: {
        resolve: {
          alias: {
            '@': resolve('src'),
          },
        },
        output: {
          // Package the sub-application into umd library format
          library: `${name}-[name]`,
          libraryTarget: 'umd',
          jsonpFunction: `webpackJsonp_${name}`,
        },
      },
    };

  ```
+ Modify ```package.json```

  ```json
    "scripts": {
      +   "start": "vue-cli-service serve",
    },
  ```
+ Local start
  ```bash
    npm start
  ```

### 🏄 Online preview
以上操作完后，可以直接通过基座预览，子应用也可独立预览

#### Main application preview

```js
http://localhost:1122/
```

#### React sub application preview

```js
http://localhost:2233/
```

#### Vue sub application preview

```js
http://localhost:3344/
```

### 🔨 Deploy
![](https://i.loli.net/2021/04/27/g3iASuJNbG5pU7F.jpg)

#### Deploy options
+ 1.Single domain deployment；

```js
// Main application：https://qiankun.xiaoqiang.tech
// React sub application：https://qiankun.xiaoqiang.tech/react
// Vue sub application：https://qiankun.xiaoqiang.tech/vue
// Server storage directory after compilation
react-app-qiankun
├── main
│   └── index.html
├── react
│   └── index.html
└── vue
    └── index.html
```

+ 2.Multi-domain independent deployment; (multi-domain deployment was selected in the note)

```js
// Main application：https://qiankun.xiaoqiang.tech
// Independent storage directory of the server project after compilation
react-app-qiankun-main
  └── index.html
```

```js
// React sub application：https://react.xiaoqiang.tech
// Independent storage directory of the server project after compilation
react-app-qiankun-sub
  └── index.html
```

```js
// Vue sub application：https://vue.xiaoqiang.tech
// Independent storage directory of the server project after compilation
vue-cli-qiankun-sub
└── index.html
```

#### Deployment (the following is only a preliminary record of the deployment process, too simple)
+ Prerequisite: Cloud server has been purchased and installed [docker](https://help.aliyun.com/document_detail/51853.html?spm=a2c4g.11186623.4.1.20aa4c07DdFvHb)、[nginx](https://hub.docker.com/_/nginx)、[jenkins](https://www.jenkins.io/zh/doc/book/installing/)、3 independent domain names and ssl certificates

+ Local coding, github storage code, respectively [Create 3 new public code repositories](https://github.com/new)

```js
// Main application：react-app-qiankun-main Store to https://github.com/niexq/react-app-qiankun-main
// React sub application：react-app-qiankun-sub Store to https://github.com/niexq/react-app-qiankun-sub
// Vue sub application：vue-cli-qiankun-sub Store to https://github.com/niexq/vue-cli-qiankun-sub
```

+ [github,jenkins CI](https://www.cloudbees.com/blog/better-integration-between-jenkins-and-github-github-jenkins-plugin)

```js
// Detailed configuration steps omitted
// github webHooks Setup
// Jenkins builds partial execution shell
BUILD_ID=dontKillMe
cd /var/jenkins_home/workspace/react-app-qiankun-main
npm install
npm run build
rm -rf /srv/www/react-app-qiankun-main
cp -rf /var/jenkins_home/workspace/react-app-qiankun-main/build /srv/www/react-app-qiankun-main/
```

+ Use nginx proxy
nginx.conf

```nginx

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
        server_name qiankun.xiaoqiang.tech; # Your domain name
        ssl on;
        root www/react-app-qiankun-main; # The web file storage folder can be changed to something else
        index index.html index.htm; # Index.html in the folder configured above
        ssl_certificate cert/5543142_qiankun.xiaoqiang.tech.pem;   #Replace domain name.pem with the file name of your certificate.
        ssl_certificate_key cert/5543142_qiankun.xiaoqiang.tech.key;   #Replace domain name.key with the key file name of your certificate.
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
          # For use with browserHistory
          try_files $uri $uri/ /index.html;
          # root /srv/www/react-app-qiankun-main;
          # index index.html index.htm;
        }
    }

    server {
        listen 443;
        server_name react.xiaoqiang.tech; # Your domain name
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        ssl on;
        root www/react-app-qiankun-sub; # The web file storage folder can be changed to something else
        index index.html index.htm; # Index.html in the folder configured above
        ssl_certificate cert/4325684_react.xiaoqiang.tech.pem;   #Replace domain name.pem with the file name of your certificate.
        ssl_certificate_key cert/4325684_react.xiaoqiang.tech.key;   #Replace domain name.key with the key file name of your certificate.
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
          # For use with browserHistory
          try_files $uri $uri/ /index.html;
          # root /srv/www/react-app-qiankun-sub;
          # index index.html index.htm;
        }
    }

    server {
        listen 443;
        server_name vue.xiaoqiang.tech; # Your domain name
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        ssl on;
        root www/vue-cli-qiankun-sub; # The web file storage folder can be changed to something else
        index index.html index.htm; # Index.html in the folder configured above
        ssl_certificate cert/5556275_vue.xiaoqiang.tech.pem;   #Replace domain name.pem with the file name of your certificate.
        ssl_certificate_key cert/5556275_vue.xiaoqiang.tech.key;   #Replace domain name.key with the key file name of your certificate.
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        location / {
          # For use with browserHistory
          try_files $uri $uri/ /index.html;
          # root /srv/www/vue-cli-qiankun-sub;
          # index index.html index.htm;
        }
    }
}

```

docker runs nginx commands, focusing on ```-v mount directory```
```bash
docker run --name nginx -p 80:80 -p 443:443 -v /root/nginx/config/nginx.conf:/etc/nginx/nginx.conf -v /root/nginx/cert:/etc/nginx/cert -v /root/nginx/logs:/var/log/nginx -v /srv/www/react-app-qiankun-main:/etc/nginx/www/react-app-qiankun-main -v /srv/www/react-app-qiankun-sub:/etc/nginx/www/react-app-qiankun-sub -v /srv/www/vue-cli-qiankun-sub:/etc/nginx/www/vue-cli-qiankun-sub --restart=always -d nginx:stable
```


### 🌴 summary
There is no summary, there are too many problems encountered, and the summary of the notes is too complicated, so I will organize and share later

#### Online preview address：https://qiankun.xiaoqiang.tech

#### Sub-applications can also be previewed independently online

React sub application preview：https://react.xiaoqiang.tech

Vue sub application preview：https://vue.xiaoqiang.tech

Source address：https://github.com/niexq/react-app-qiankun-main

## 🧩 Reference link

[qiankun](https://qiankun.umijs.org/)

[qiankun-example](https://juejin.cn/post/6875462470593904653)

[qiankun Practice and summary of micro front-end solutions](https://juejin.cn/post/6844904185910018062)

### 💯 Is it feasible to skip the cumbersome steps above?

[Wise choice](./use.en-US.md)

## 🏆 Written at the end

Those who can persist to the end are the warriors, ```Thanks for reading```, welcome ```star``` to encourage