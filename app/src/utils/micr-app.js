import {
  registerMicroApps,
  initGlobalState,
  start,
  MicroAppStateActions,
} from "qiankun";

const initialState = {}
const actions = initGlobalState(initialState)
// actions.onGlobalStateChange((state, prevState) => {
//   console.log("主应用观察者：token 改变前的值为 ", prevState.token);
//   console.log(
//     "主应用观察者：登录状态发生改变，改变后的 token 的值为 ",
//     state.token
//   );
// });

const micrApp = {
  init: () => {
    registerMicroApps(
      [
        {
          name: 'design', //这里的name一定要和微应用这配置的output中的library相互对应，因为name是主应用找到微应用对外暴露的生命周期函数的主要凭证
          entry: process.env.VUE_APP_QIANKUN_ENTRY, //这是微应用的入口地址
          // entry: `http://localhost:8081/newpc/`,
          container: '#design-view', //这是在主应用中微应用的渲染承载容器
          activeRule: '/wxapp/pcmall/design' //这是进行路由监听，一旦匹配，就会加载微应用并进行挂载，这里也要主要在微应用中需要设置路由base的时候要相互对应，后面会提到
          //   props: {
          //     sysConfig: {
          //       mode: "pc",
          //       token: store.getters.token,
          //       pageid: id,
          //     },
          //   },
        }
      ],
      {
        beforeLoad: [
          (app) => {
            console.log('before load', app)
          }
        ], // 挂载前回调
        beforeMount: [
          (app) => {
            console.log('before mount', app)
          }
        ], // 挂载后回调
        afterUnmount: [
          (app) => {
            console.log('after unload', app)
          }
        ] // 卸载后回调
      }
    )
    start()
  }
}

export { micrApp, actions }
