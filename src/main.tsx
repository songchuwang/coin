import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'antd/dist/antd.css'
import './locales'
import {Provider} from "react-redux";
import {persist, store} from "./redux";
import {PersistGate} from "redux-persist/integration/react";

import Vconsole from 'vconsole'
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
