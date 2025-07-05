import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import { UnknownAction } from "redux";

type Actions = {
  [key: string]: (...args: any[]) => UnknownAction
}

type DispatchActions = {
  [key: string]: (...args: any[]) => void
}

export default function useDispatchAction(actions: Actions): DispatchActions {
  const dispatch = useDispatch()

  const [dispatchAction, setDispatchAction] = useState({})


  useEffect(() => {
    Object.keys(actions).filter((key) => {
      setDispatchAction((preAction: DispatchActions) => {
        preAction[key] = (...args: []) => dispatch(actions[key](...args))
        return preAction
      })
    })
  }, [])

  return dispatchAction
}
