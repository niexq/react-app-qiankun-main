import { useEffect, useState } from 'react';
import Loading from './components/Loading';
import apps from './apps';
import store from './store/store'
import classNames from 'classnames';
import './App.css';

function App(props) {
  const { loading } = props;
  const [activeUrl, setActiveUrl] = useState(apps?.[0]?.activeRule);
  const storeState = store.getGlobalState();
  useEffect(() => {
    const path = window?.location?.pathname;
    const activeMenu = apps.find(item => path?.includes(item.activeRule));
    if(activeMenu) {
      setActiveUrl(activeMenu?.activeRule);
    }
  }, [])
  const push = (title, href) => {
    setActiveUrl(href);
    window.history.pushState({}, title, href);
  }
  const getMenuClassName = (activeRule) => {
    return classNames('mainapp-header-sidemenu-sub', {
      'mainapp-header-sidemenu-sub-active': activeUrl === activeRule,
    });
  }
  return (
    <>
      <div className="mainapp">
        {/* 标题栏 */}
        <header className="mainapp-header">
          <div className='mainapp-header-github'>
            <a class="mainapp-header-github-logo" href="https://github.com/niexq/react-app-qiankun-main" data-hotkey="g d" aria-label="Homepage " data-ga-click="Header, go to dashboard, icon:logo">
              <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </a>
            <span className="mainapp-header-github-title">QianKunDemo</span>
          </div>
          <ul className="mainapp-header-sidemenu">
            {/* 侧边栏 */}
            {apps.map((menu) => (
              <li key={`${menu.container}_${menu.activeRule}`} className={getMenuClassName(menu.activeRule)} onClick={() => push(null, menu.activeRule, menu.activeRule)}>{menu.name}</li>
            ))}
          </ul>
          <span className='mainapp-header-store'>{`基座中显示-主应用的数据：${JSON.stringify(storeState)}`}</span>
        </header>
        <div className="mainapp-main">
          {/* 子应用 */}
          <Loading loading={loading} />
          <main id="subapp-viewport"></main>
        </div>
      </div>
    </>
  );
}

export default App;
