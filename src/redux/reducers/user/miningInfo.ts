import {RESET_MINING_STATE, SET_MINING_DATA, SET_MINING_STATE} from "@/constants/ActionTypes.ts";

export type MiningInfoType = {
  id?: number,
  userId?: number,
  period?: number,
  startTime?: string,
  endTime?: string,
  speed?: number,
  amount?: number,
  status?: number
}

export type MiningStateType = {
  miningAmount?: number,
  hours?: string,
  minutes?: string,
  seconds?: string,
}

export type MiningInfoInitialStateType = {
  miningData?: MiningInfoType,
  miningState?: MiningStateType,
}

const initialState: MiningInfoInitialStateType = {
  miningData: null,
  miningState: {
    miningAmount: 0,
    hours: '00',
    minutes: '59',
    seconds: '59'
  }
}

const miningInfo = (state = initialState, data: { type: string, payload: any }) => {
  const hoursNumStr = state.miningData?.period === 0 ? '00' : `${state.miningData?.period - 1}`
  switch (data.type) {
    case SET_MINING_DATA:
      return {
        ...state,
        miningData: {
          ...data.payload,
          speed: data.payload.speed / 100
        }
      }
    case SET_MINING_STATE:
      return {
        ...state,
        miningState: data.payload
      }
    case RESET_MINING_STATE:
      return {
        ...state,
        miningState: {
          miningAmount: 0,
          hours: hoursNumStr.length === 1 ? '0' + hoursNumStr : hoursNumStr,
          minutes: '59',
          seconds: '59'
        }
      }
    default:
      return state
  }
}

export default miningInfo
