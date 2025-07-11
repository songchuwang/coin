import {BrowserRouter, useLocation, useNavigate, useRoutes} from "react-router-dom";
import {Layout} from "antd";
import routers from "@/config/routers.tsx";
import BackgroundStar from "@/components/BackgroundStar";
import InitPage from "@/components/InitPage";
import {useEffect, useRef, useState} from "react";
import {getTelegramUserData, getTelegramWebApp, initTelegram} from "@/tools/telegram.ts";
import {LoginParamsType} from "@/types";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import NavigateBar from "@/components/NavigateBar";
import {
  APIAPPConfig,
  APIAssetsInfo,
  APIGetInviteUrl,
  APIMiningInfo,
  APIRewardTaskList, APITeamInfoData,
  APIUserInfo,
  APIUserLogin
} from "@/api";
import {
  setAssetsState, setInitLoading, setInviteUrl,
  setLoginUserInfo,
  setMiningData,
  setRateGENToUSDT,
  setReferralCode, setRewardTaskList, setSupportName, setTeamInfoData,
  setUserInfoData
} from "@/redux/actions/home.ts";
import {setToken} from "@/tools/token.ts";
import {useMining} from "@/hooks/useMining.ts";
import LoadingModal from "@/components/LoadingModal";
import BootPage from "@/components/BootPage";
import {useSelector} from "react-redux";

function AppRouters () {

  const navigate = useNavigate()
  const location = useLocation()

  const whiteList = ["/", '/home', '/accelerate', '/minister', '/teamPage', '/markets']

  const initTGBack = () => {
    const webApp = getTelegramWebApp()
    webApp.onEvent("backButtonClicked", () => {
      navigate(-1)
    })
  }

  const initTGBackL = () => {
    const webApp = getTelegramWebApp()
    if (whiteList.includes(location.pathname)) {
      webApp.BackButton?.hide();
    } else {
      webApp.BackButton?.show()
    }
  }

  useEffect(() => {
    initTGBack()
  }, []);

  useEffect(() => {
    initTGBackL()
  }, [location.pathname]);

  return useRoutes(routers as any)
}
function App() {

  const dispatch = useDispatchAction({ setLoginUserInfo, setUserInfoData, setMiningData, setRateGENToUSDT, setReferralCode, setAssetsState, setInviteUrl, setTeamInfoData, setRewardTaskList, setInitLoading, setSupportName })

  const bootIdList: Array<number> = useSelector((state: any) => state.app.appSetting.bootVisIdList)
  const initLoading: boolean = useSelector((state: any) => state.home.pageState.initLoading)

  // const [loading, setLoading] = useState(true)

  const { startTiming } = useMining()

  // const { startKLine } = userKLineData();

  const [progressNum, setProgressNum] = useState(0)

  const aloneRequestNum = 100 / 5

  const allProgressRef = useRef(0)

  const onUserLogin = async () => {
    // setLoading(true)
    dispatch.setInitLoading(true)
    // const tgUser = getTelegramUserData()
    const tgUser = {
      id: 1224383828,
      first_name: 'Hu',
      last_name: 'Robert',
      username: 'roberthucode',
    }
    console.log('小程序id:', tgUser);
    
    const tgId = localStorage.getItem('tgId')
    if (tgUser?.id.toString() !== tgId) {
      localStorage.clear()
    }
    localStorage.setItem('tgId', tgUser?.id.toString())
    const webApp = getTelegramWebApp()
    console.log(webApp)
    const userParams: LoginParamsType = {
      miniId: tgUser?.id,
      // firstName: tgUser.first_name,
      // lastName: tgUser.last_name,
      username: tgUser?.username,
      avatar: '',
      password: '0027rootss',
      // referralCode: '',
      // initData: webApp.initData
      initData: 'project test'
    }

    let pageLoading = true

    APIUserLogin(userParams, {
      onUploadProgress(e) {
        console.log("aa:", 1)
        allProgressRef.current += e.loaded / e.total * aloneRequestNum
        setProgressNum(allProgressRef.current)
      }
    }).then(resp => {
      if (resp.code === 0) {
        dispatch.setLoginUserInfo({ ...resp.data })
        setToken(resp.data.accessToken)
        return APIMiningInfo()
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        // if (resp.data.status === 1) {
        //   startTiming()
        // }
        console.log("aa:", 2)
        allProgressRef.current += aloneRequestNum
        setProgressNum(allProgressRef.current)
        dispatch.setMiningData(resp.data)
        startTiming()
        // startKLine()
        return APIUserInfo()
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        console.log("aa:", 3)
        allProgressRef.current += aloneRequestNum
        setProgressNum(allProgressRef.current)
        dispatch.setUserInfoData(resp.data)
        // const reteReqData: RateReqParamsType = {
        //   nonce: new Date().getTime().toString(),
        //   userId: resp.data.userId,
        //   type: 1,
        //   amount: 100
        // }
        pageLoading = false
        commonFetch()
      }
    }).then(() => {
      console.log("aa:", allProgressRef.current)
      allProgressRef.current += aloneRequestNum
      setProgressNum(allProgressRef.current)
    }).finally(() => {
      dispatch.setInitLoading(pageLoading)
    })
  }

  const commonFetch = async () => {
    // APIReferralCode().then(resp => {
    //   if (resp.code === 0) {
    //     dispatch.setReferralCode(resp.data.code)
    //   }
    // })
    await APIAssetsInfo().then(resp => {
      if (resp.code === 0) {
        dispatch.setAssetsState(resp.data)
      }
    })
    await APIGetInviteUrl().then(resp => {
      if (resp.code === 0) {
        dispatch.setInviteUrl(resp.data)
      }
    })

    await APITeamInfoData().then(resp => {
      if (resp.code === 0) {
        dispatch.setTeamInfoData(resp.data)
      }
    })

    await APIRewardTaskList().then(resp => {
      if (resp.code === 0) {
        dispatch.setRewardTaskList(resp.data)
      }
    })

    await APIAPPConfig({name: 'support'}).then(resp => {
      if (resp.code === 0) {
        dispatch.setSupportName(resp.data.data1)
      }
    })

  }




  useEffect(() => {
    initTelegram()
    onUserLogin()
  }, []);

  useEffect(() => {
    // 阻止双指缩放
    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 添加事件监听器
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('gesturestart', (e) => e.preventDefault());

    // 清除事件监听器
    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('gesturestart', (e) => e.preventDefault());
    };
  }, []);

  return (
    <Layout className={'app-style'} style={{width: '100%', height: '100%', position: 'relative', overflow: "hidden auto", background: '#1D3944'}}>
      <BackgroundStar />
      {
        bootIdList.includes(getTelegramUserData()?.id) && (
          <InitPage loading={initLoading} progress={progressNum} />
        )
      }
      {
        (bootIdList.length > 0 && !bootIdList.includes(getTelegramUserData() ? getTelegramUserData().id : 1)) && (
          <BootPage />
        )
      }
      <LoadingModal />
      {
        !initLoading && (
          <BrowserRouter>
            <AppRouters />
            <NavigateBar />
          </BrowserRouter>
        )
      }
    </Layout>
  )
}

export default App
