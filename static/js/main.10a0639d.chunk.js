(this["webpackJsonpreact-app-qiankun-main"]=this["webpackJsonpreact-app-qiankun-main"]||[]).push([[0],{140:function(e,n,a){},180:function(e,n,a){"use strict";a.r(n);var t=a(14),i=a(12),c=a.n(i),o=a(66),r=a.n(o),l=(a(78),a(72)),u=a(1),s=function(e){var n=e.loading;return Object(u.jsx)(u.Fragment,{children:n&&Object(u.jsx)("h4",{className:"mainapp-loading",children:"loading..."})})},d=a(67),p={user:{name:"qiankun"}},b=Object(d.b)(p);b.onGlobalStateChange((function(e,n){for(var a in e)p[a]=e[a]})),b.getGlobalState=function(e){return e?p[e]:p};var m=b,h=[{name:"react",entry:"//qiankun.xiaoqiang.tech/react",activeRule:"/react",container:"#subapp-viewport"},{name:"vue",entry:"//qiankun.xiaoqiang.tech/vue",activeRule:"/vue",container:"#subapp-viewport"}].map((function(e){return Object(t.a)(Object(t.a)({},e),{},{props:{routerBase:e.activeRule,getGlobalState:m.getGlobalState}})})),v=a(68),j=a.n(v);a(140);var g=function(e){var n,a=e.loading,t=Object(i.useState)(null===h||void 0===h||null===(n=h[0])||void 0===n?void 0:n.activeRule),c=Object(l.a)(t,2),o=c[0],r=c[1],d=m.getGlobalState();return Object(i.useEffect)((function(){var e,n,a=null===(e=window)||void 0===e||null===(n=e.location)||void 0===n?void 0:n.pathname,t=h.find((function(e){return null===a||void 0===a?void 0:a.includes(e.activeRule)}));t&&r(null===t||void 0===t?void 0:t.activeRule)}),[]),Object(u.jsx)(u.Fragment,{children:Object(u.jsxs)("div",{className:"mainapp",children:[Object(u.jsxs)("header",{className:"mainapp-header",children:[Object(u.jsxs)("div",{className:"mainapp-header-github",children:[Object(u.jsx)("a",{class:"mainapp-header-github-logo",href:"https://github.com/niexq/react-app-qiankun-main","data-hotkey":"g d","aria-label":"Homepage ","data-ga-click":"Header, go to dashboard, icon:logo",children:Object(u.jsx)("svg",{class:"octicon octicon-mark-github v-align-middle",height:"32",viewBox:"0 0 16 16",version:"1.1",width:"32","aria-hidden":"true",children:Object(u.jsx)("path",{"fill-rule":"evenodd",d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"})})}),Object(u.jsx)("span",{className:"mainapp-header-github-title",children:"QianKunDemo"})]}),Object(u.jsx)("ul",{className:"mainapp-header-sidemenu",children:h.map((function(e){return Object(u.jsx)("li",{className:(n=e.activeRule,j()("mainapp-header-sidemenu-sub",{"mainapp-header-sidemenu-sub-active":o===n})),onClick:function(){return n=null,a=e.activeRule,e.activeRule,r(a),void window.history.pushState({},n,a);var n,a},children:e.name},"".concat(e.container,"_").concat(e.activeRule));var n}))}),Object(u.jsx)("span",{className:"mainapp-header-store",children:"\u57fa\u5ea7\u4e2d\u663e\u793a-\u4e3b\u5e94\u7528\u7684\u6570\u636e\uff1a".concat(JSON.stringify(d))})]}),Object(u.jsxs)("div",{className:"mainapp-main",children:[Object(u.jsx)(s,{loading:a}),Object(u.jsx)("main",{id:"subapp-viewport"})]})]})})},f=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,184)).then((function(n){var a=n.getCLS,t=n.getFID,i=n.getFCP,c=n.getLCP,o=n.getTTFB;a(e),t(e),i(e),c(e),o(e)}))},O=a(183),x=a(182);function k(e){var n=e.appContent,a=e.loading,t=document.getElementById("main-root");r.a.render(Object(u.jsx)(c.a.StrictMode,{children:Object(u.jsx)(g,{loading:a,content:n})}),t)}var w=function(e){return k({loading:e})};k({loading:!0});var C=h.map((function(e){return Object(t.a)(Object(t.a)({},e),{},{loader:w})}));Object(O.b)(C,{beforeLoad:function(e){console.log("before load app.name=====>>>>>",e.name)},beforeMount:[function(e){console.log("[LifeCycle] before mount %c%s","color: green;",e.name)}],afterMount:[function(e){console.log("[LifeCycle] after mount %c%s","color: green;",e.name)}],afterUnmount:[function(e){console.log("[LifeCycle] after unmount %c%s","color: green;",e.name)}]}),Object(x.a)("/react"),Object(O.c)(),f()},78:function(e,n,a){}},[[180,1,2]]]);
//# sourceMappingURL=main.10a0639d.chunk.js.map