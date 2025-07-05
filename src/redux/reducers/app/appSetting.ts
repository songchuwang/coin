import {ADD_BOOT_ID, SET_SUPPORT_NAME} from "@/constants/ActionTypes.ts";

type initialStateType = {
  bootVisIdList: Array<number>,
  supportName: string,
}

const initialState:initialStateType = {
  bootVisIdList: [1],
  supportName: ''
}

const appSetting = (state = initialState, data: { type: string, payload: any }) => {
  const nowBotIdList = state.bootVisIdList
  switch (data.type) {
    case ADD_BOOT_ID:
      nowBotIdList.push(data.payload)
      return {
        ...state,
        bootVisIdList: [...nowBotIdList]
      }
    case SET_SUPPORT_NAME:
      return {
        ...state,
        supportName: data.payload
      }
    default:
      return state
  }

}

export default appSetting
