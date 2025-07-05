import {ADD_TO_NUMBER} from "@/constants/ActionTypes.ts";

const initialState = {
  count: 0
}

const counter = (state = initialState, data: { type: string, payload: number }) => {
  switch (data.type) {
    case ADD_TO_NUMBER:
      return {
        ...state,
        count: state.count + data.payload
      }
    default:
      return state
  }
}

export default counter
