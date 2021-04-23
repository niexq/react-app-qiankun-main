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
