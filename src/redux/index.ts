
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import reducers from "./reducers";
import { legacy_createStore } from "redux";

const persistConfig = {
  key: 'imine',
  storage: storage,
  // whitelist:['LoadingReducers'],
  blacklist: ['home']
}

const persistReducers = persistReducer(persistConfig, reducers)

const store = legacy_createStore(persistReducers)

const persist = persistStore(store)

export { store, persist }
