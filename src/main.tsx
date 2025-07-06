import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'antd/dist/antd.css'
import './locales'
import { Provider } from "react-redux";
import { persist, store } from "./redux";
import { PersistGate } from "redux-persist/integration/react";

import Vconsole from 'vconsole'
if (!window.Telegram) {
  window.Telegram = {
    WebApp: {
      initData: "",
      // 添加完整的用户信息模拟
      initDataUnsafe: {
        user: {
          id: 123456789,
          is_bot: false,
          username: "test_user", // 关键：添加 username 属性
          first_name: "测试用户",
          last_name: "模拟用户"
        }
      },
      hide: () => console.log("Telegram.WebApp.hide() simulated"),
      show: () => console.log("Telegram.WebApp.show() simulated"),
      // 添加 onEvent 方法
      onEvent: (eventName: string, eventHandler: Function) => {
        console.log(`Telegram.WebApp.onEvent(${eventName}) called`);

        // 添加一些基本的事件模拟逻辑
        switch (eventName) {
          case 'themeChanged':
            // 模拟主题变更事件
            setTimeout(() => {
              console.log('模拟 themeChanged 事件触发');
              eventHandler({ theme_params: { bg_color: '#18222d' } });
            }, 2000);
            break;
          case 'viewportChanged':
            // 模拟视口变化事件
            setTimeout(() => {
              console.log('模拟 viewportChanged 事件触发');
              eventHandler({ is_state_stable: true });
            }, 1500);
            break;
          default:
            console.warn(`未实现的事件类型: ${eventName}`);
        }
      },
      ready: () => console.log("Telegram.WebApp.ready() simulated"),
      setHeaderColor: () => console.log("Telegram.WebApp.ready() setHeaderColor"),
      // 添加下面这行关键代码 👇
      expand: () => console.log("Telegram.WebApp.expand() simulated"),
      // 根据实际需要扩展其他方法
      showPopup: (options) => console.log("显示弹窗", options),
      showConfirm: (msg, callback) => {
        const result = confirm(msg);
        if (callback) callback(result);
      },
      setBackgroundColor: (color) =>
        console.log("模拟设置背景色", color),
      setBottomBarColor: (color) =>
        console.log("模拟设置背景色", color),
      disableVerticalSwipes: (color) =>
        console.log("模拟设置背景色", color),
      enableClosingConfirmation: (color) =>
        console.log("模拟设置背景色", color),
      // 其他可能需要的方法
      close: () => console.log("关闭应用")
    }
  };
}
//开发环境增加调试面板
if (import.meta.env['VITE_APP_ENV'] === 'development') {
  new Vconsole()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  //
  // </React.StrictMode>,
  <Provider store={store}>
    <PersistGate persistor={persist}>
      {/*<TonConnectUIProvider manifestUrl={WALLETCONNECTMAMIFESTURL}>*/}
      {/*  <App />*/}
      {/*</TonConnectUIProvider>*/}
      <App />
    </PersistGate>
  </Provider>,
)
