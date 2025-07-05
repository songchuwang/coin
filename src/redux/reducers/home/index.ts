import { combineReducers } from "redux"
import counter from "./counter.ts"
import loadingModal from './loadingModal.ts'
import pageState from "./pageState.ts";

export default combineReducers({
  counter,
  loadingModal,
  pageState
})
