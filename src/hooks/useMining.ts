import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {resetMiningState, setMiningData, setMiningState} from "@/redux/actions/home.ts";
import {store} from "@/redux";
import {MiningInfoType, MiningStateType} from "@/redux/reducers/user/miningInfo.ts";
import {formatTimeDifference} from "@/utils/timeFormat.ts";


const useMining = () => {
  let timer: NodeJS.Timeout|null = null
  let timeCount = 0
  const dispatch = useDispatchAction({ setMiningData, setMiningState, resetMiningState })

  const startTiming = () => {
    if (timer) {
      stopTimer()
    }
    timer = setInterval(timeFun, 1000)
  }

  const timeFun = () => {
    try {
      timeCount += 1
      console.log(timeCount)
      // const userData = store.getState().user.userInfo.userInfo as UserInfoDataType
      const miningData = store.getState().user.miningInfo.miningData as MiningInfoType

      if (miningData.status === 1) {
        const startTime = new Date(miningData.startTime).getTime()
        const endTime = new Date(miningData.endTime).getTime()
        const nowTime = new Date().getTime()
        const diffTime = nowTime - startTime
        const endDiffTime = endTime - nowTime
        if (endDiffTime > 0) {
          const {hours, minutes, seconds} = formatTimeDifference(nowTime, endTime)
          const speedSec = miningData.speed / (60 * 60)
          console.log(speedSec)
          const miningAmount = speedSec * (diffTime / 1000)
          const miningSetState: MiningStateType = {
            miningAmount: miningAmount,
            hours,
            minutes,
            seconds
          }
          dispatch.setMiningState(miningSetState)
        } else {
          const miningSetData: MiningInfoType = {
            ...miningData,
            status: 2
          }
          stopTimer()
          dispatch.setMiningData(miningSetData)
          const hoursNumStr = miningData.period === 0 ? '00' : `${miningData.period - 1}`
          const miningSetState: MiningStateType = {
            miningAmount: miningSetData.amount,
            hours: hoursNumStr.length === 1 ? '0' + hoursNumStr : `${hoursNumStr}`,
            minutes: '59',
            seconds: '59'
          }
          dispatch.setMiningState(miningSetState)
        }
      } else if (miningData.status === 2) {
        const startTime = new Date(miningData.startTime).getTime()
        const nowTime = new Date().getTime()
        const speedSec = miningData.speed / (60 * 60)
        const diffTime = nowTime - startTime
        const miningAmount = speedSec * (diffTime / 1000)
        const hoursNumStr = miningData.period === 0 ? '00' : `${miningData.period - 1}`
        const miningSetState: MiningStateType = {
          miningAmount: miningAmount,
          hours: hoursNumStr.length === 1 ? '0' + hoursNumStr : `${hoursNumStr}`,
          minutes: '59',
          seconds: '59'
        }
        dispatch.setMiningState(miningSetState)
        stopTimer()
      } else {
        dispatch.resetMiningState()
        stopTimer()
      }

    } catch (e) {
      console.log(e)
    }
  }

  const stopTimer = () => {
    if (timer != null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    startTiming,
    stopTimer
  }
}

export { useMining }
