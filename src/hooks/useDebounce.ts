import {useCallback, useEffect, useRef} from "react";

export interface UseRefParams {
  fn: (_args: any) => void;
  timer: ReturnType<typeof setTimeout> | null;
}

export const useDebounce = (fn: (_args: any) => void, delay = 2000) => {
  const { current } = useRef<UseRefParams>({fn, timer: null})
  useEffect(() => {
    current.fn = fn
  }, [current, fn])
  return useCallback(
    (args: any) => {
      if (current.timer) {
        clearTimeout(current.timer)
      }
      current.timer = setTimeout(() => {
        current.fn(args)
      }, delay)
    },
    [current, delay]
  )
}
