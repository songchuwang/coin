import {combineReducers} from "redux";
import userInfo from './userInfo.ts'
import miningInfo from './miningInfo.ts';

export default combineReducers({
  userInfo,
  miningInfo
})
