import {SET_LOADING_MODAL_VIS} from "@/constants/ActionTypes.ts";


export type LoadingModalInitialStateType = {
  loading: boolean
}

const initialState: LoadingModalInitialStateType = {
  loading: false
}

const loadingModal = (state = initialState, data: { type: string, payload: any }) => {
  switch (data.type) {
    case SET_LOADING_MODAL_VIS:
      return {
        ...state,
        loading: data.payload
      }
    default:
      return state
  }
}

export default loadingModal
