import {combineReducers} from "redux";
import home from "./home";
import user from "./user"
import app from "./app"

const _reducers = combineReducers({
  home,
  user,
  app
})

_reducers.prototype

function reducers(state: any, action: any) {
  return _reducers(state, action)
}

export default reducers
