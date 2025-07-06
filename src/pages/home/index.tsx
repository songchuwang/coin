import { useEffect, useState } from "react";
import styles from "./index.module.scss"
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import homeAnimation from "@/assets/animation/homeAnimation.json"
import rankAnimation from "@/assets/animation/rankAnimation.json"
import Lottie from "react-lottie";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { UserAuthDataType, UserInfoDataType } from "@/redux/reducers/user/userInfo.ts";
import { MiningInfoType, MiningStateType } from "@/redux/reducers/user/miningInfo.ts";
import { numberFormatToEnglish } from "@/utils/numFormat.ts";
import { useMining } from "@/hooks/useMining.ts";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {
  resetMiningState, setActivityState,
  setAssetsState, setFollowedList,
  setLoadingModalVis,
  setMiningData,
  setTaskList
} from "@/redux/actions/home.ts";
import {
  APIActivityList,
  APIAssetsInfo,
  APIMiningClaim,
  APIMiningInfo,
  APIStartMining,
  APITaskDone,
  APITaskList
} from "@/api";
import FollowPopup from "@/components/FollowPopup";
import { RewardTaskLItemType, TaskItemType, TeamInfoDataType } from "@/types";
import { getTelegramWebApp } from "@/tools/telegram.ts";
import { formatPriceIfUsdt, formatUnitByCurrency } from "@/utils/textUtils.ts";
import { MAIN_CURRENCY_COIN } from "@/config/appConfig.ts";
const Home = () => {
  const { t }: { t: (key: string, value?: any) => string } = useTranslation()

  const { startTiming } = useMining()

  const dispatch = useDispatchAction({ setLoadingModalVis, setMiningData, resetMiningState, setAssetsState, setTaskList, setFollowedList, setActivityState })

  const userAuthData: UserAuthDataType = useSelector((state: any) => state.user.userInfo.userAuthData)
  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)
  const followedList: Array<number> = useSelector((state: any) => state.user.userInfo.followedList)
  const teamStatePageData: TeamInfoDataType = useSelector((state: any) => state.home.pageState.teamState)
  const rewardTaskList: Array<RewardTaskLItemType> = useSelector((state: any) => state.home.pageState.rewardTaskList)
  const rateGENToUSDT: number = useSelector((state: any) => state.user.userInfo.rateGENToUSDT)

  const miningData: MiningInfoType = useSelector((state: any) => state.user.miningInfo.miningData)
  const miningState: MiningStateType = useSelector((state: any) => state.user.miningInfo.miningState)

  const taskList: Array<TaskItemType> = useSelector((state: any) => state.home.pageState.taskList)

  const inviteUrl: string = useSelector((state: any) => state.user.userInfo.inviteUrl)

  const [ruleVis, setRuleVis] = useState(false)

  const [followVis, setFollowVis] = useState(false)

  const [downloadRewardVis, setDownloadRewardVis] = useState(false)

  const homeIconList = [[
    {
      key: 0,
      name: 'diamond-icon',
      iconPath: './img/home/diamond-icon.png',
      navigatePath:''
    },
    {
      key: 1,
      name: 'gift-icon',
      iconPath: './img/home/gift-icon.png',
      // navigatePath:'Lotterypage'
      navigatePath:'/lotteryPage'
    },
  ], [
    {
      key: 2,
      name: 'lightning-icon',
      iconPath: './img/home/lightning-icon.png',
      navigatePath:''
    },
    {
      key: 3,
      name: 'ranking-icon',
      iconPath: './img/home/ranking-icon.png',
      navigatePath:''
    },
  ], [
    {
      key: 4,
      name: 'record-icon',
      iconPath: './img/home/record-icon.png',
      navigatePath:'/miningRecords'
    },
    {
      key: 5,
      name: 'video-icon',
      iconPath: './img/home/video-icon.png',
      navigatePath:''
    },
  ]]

  const taskListData = [
    {
      key: 0,
      title: 'Join the Telegram group',
      desc:'Register now to receive 1000USDT',
      iconPath: './img/home/telegram-icon.png',
      tips:'+1000USDT',
      navigate:''
    },
    {
      key: 1,
      title: 'Follow xcoin to claim rewards',
      desc:'Reward Task',
      iconPath: './img/home/facebook-icon.png',
      tips:'',
      navigate:''
    },
    {
      key: 2,
      title: 'Invite the A-level team reward',
      desc:'Ladder Tasks',
      iconPath: './img/home/mining-pool​-icon.png',
      tips:'',
      navigate:''
    },
    {
      key: 3,
      title: 'Join the Telegram group',
      desc:'Register now to receive 1000USDT',
      iconPath: './img/home/yotube-icon.png',
      tips:'',
      navigate:''
    },
  ]

  const [taskState, setTaskState] = useState({
    follow: {
      id: -1,
      name: '',
      profit: 300,
      isDone: false,
      profitCurrency: 2,
    },
    dailyCheck: {
      id: -1,
      name: '',
      profit: 100,
      isDone: false,
      profitCurrency: 2,
    },
    joinTGGroup: {
      id: -1,
      name: 'Join the Telegram group',
      profit: 300,
      isDone: false,
      profitCurrency: 2,
    },
    facebook: {
      id: -1,
      name: 'FB follow',
      profit: 100,
      isDone: false,
      profitCurrency: 2,
    },
    // twitter: {
    //   id: -1,
    //   name: 'Twitter follow',
    //   profit: 100,
    //   isDone: false
    // },
    meta: {
      id: -1,
      name: 'Meta post follow',
      profit: 300,
      isDone: false,
      profitCurrency: 2,
    },
    twitter: {
      id: -1,
      name: 'Twitter post follow',
      profit: 300,
      isDone: false,
      profitCurrency: 2,
    },
    youtube: {
      id: -1,
      name: 'YouTube follow',
      profit: 100,
      isDone: false,
      profitCurrency: 2,
    },
    timelypurse: {
      id: -1,
      name: 'Timelypurse',
      profit: 1000,
      isDone: false,
      profitCurrency: 1,
    }
  })

  const navigate = useNavigate()

  const lottieDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: homeAnimation,
  }

  const lottieRankOptions = {
    loop: true,
    autoplay: true,
    animationData: rankAnimation,
  }

  const gotoLanguagePage = () => {
    navigate('/languagePage')
  }

  const onStartMiningClick = () => {
    if ([0].includes(miningData.status)) {
      dispatch.setLoadingModalVis(true)
      APIStartMining().then(resp => {
        if (resp.code === 0) {
          startTiming()
          dispatch.setMiningData(resp.data)
        } else {
          message.error(resp.msg)
        }
      }).finally(() => {
        dispatch.setLoadingModalVis(false)
      })
    }
    if (miningData.status === 2) {
      dispatch.setLoadingModalVis(true)
      APIMiningClaim().then(resp => {
        if (resp.code === 0) {
          return APIMiningInfo()
        } else {
          message.error(resp.msg)
        }
      }).then(resp => {
        if (resp && resp.code === 0) {
          dispatch.resetMiningState()
          dispatch.setMiningData(resp.data)
          startTiming()
          return APIAssetsInfo()
        }
      }).then(resp => {
        if (resp && resp.code === 0) {
          dispatch.setAssetsState(resp.data)
        }
      }).finally(() => {
        dispatch.setLoadingModalVis(false)
      })
    }
  }

  const fetchTaskList = () => {

    APITaskList().then(resp => {
      if (resp.code === 0) {
        dispatch.setTaskList([...resp.data])
      }
    })
  }

  const fetchAsste = () => {
    APIAssetsInfo().then(resp => {
      if (resp.code === 0) {
        dispatch.setAssetsState(resp.data)
      }
    })
  }

  const onSignInClick = (item) => {
    if (item.isDone) {
      message.info(t('sign_hint_done_message'))
      return
    }
    dispatch.setLoadingModalVis(true)
    APITaskDone(item.id).then(resp => {
      if (resp.code === 0) {
        message.success(t('task_reward_message', { amount: item.profit, currency: MAIN_CURRENCY_COIN }))
        fetchTaskList()
        fetchAsste()
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const onJoinGroup = (item) => {
    let link = ''
    if (item.name === 'Join the Telegram group') {
      link = 'https://t.me/Gennewvip'
    } else if (item.name === 'YouTube follow') {
      link = 'https://youtube.com/@gen-web3-vip?si=zarS9MgIQ2s_Jxpf'
    } else if (item.name === 'Twitter follow') {
      link = 'https://x.com/GENnetworkcoin/status/1880635769565716939?t=Wny6QqTKtsk6F1HbrCGy6Q&s=19'
    } else if (item.name === 'FB follow') {
      link = 'https://www.facebook.com/profile.php?id=61568161914646&mibextid=ZbWKwL'
    } else if (item.name === 'Meta post follow') {
      // link = 'https://x.com/binance/status/1875059614691016874?t=ejefViQkCbTTtSRbDQalIg&s=19'
      // link = 'https://x.com/GENnetworkcoin/status/1880635769565716939?t=Wny6QqTKtsk6F1HbrCGy6Q&s=19'
      link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&hashtag=${encodeURIComponent("#Blockchain #Freecrypto #Airdrop")}&quote=${encodeURIComponent(`🚀 Join the future of mining with ${MAIN_CURRENCY_COIN}! 🌐 Secure, decentralized, and rewarding. Start mining now! ⛏️💰 `)}`
    } else if (item.name === 'Timelypurse') {
      link = 'https://casmedia.linkrall-trk.com/clk.php?offer_id=2250367&aff_id=522&aff_sub1={CLICK_ID}&source_id={SOURCE_ID}'
    }
    const webApp = getTelegramWebApp()
    if (item.isDone) {
      if (link.indexOf('https://t.me') !== -1) {
        webApp.openTelegramLink(link)
      } else {
        webApp.openLink(link)
      }

      return
    }
    dispatch.setLoadingModalVis(true)
    APITaskDone(item.id).then(resp => {
      if (resp.code === 0) {
        message.success(t('task_reward_message', { amount: item.profit, currency: formatUnitByCurrency(item.profitCurrency) }).replace(MAIN_CURRENCY_COIN, formatUnitByCurrency(item.profitCurrency)))
        if (link.indexOf('t.me') !== -1) {
          webApp.openTelegramLink(link)
        } else {
          webApp.openLink(link)
        }
        if (item.name === 'Timelypurse') {
          setDownloadRewardVis(true)
        }
        fetchTaskList()
        fetchAsste()
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const fetchPrizePoolActivityData = () => {
    APIActivityList({ pageNo: 1, pageSize: 10 }).then(resp => {
      if (resp.code === 0) {
        if (resp.data.list.length > 0) {
          dispatch.setActivityState(resp.data.list[0])
        } else {
          dispatch.setActivityState(null)
        }
      }
    })
  }

  useEffect(() => {
    if (taskList.length === 0) {
      fetchTaskList()
    }
    fetchPrizePoolActivityData()
  }, []);

  useEffect(() => {
    const taskStateNew = taskState
    const taskMap = {}
    taskList.map(item => {
      taskMap[item.name] = item
      if (item.name === 'follow') {
        taskStateNew.follow = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
        if (!followedList || (!item.isDone && followedList.length === 5)) {
          const e_a = []
          dispatch.setFollowedList([...e_a])
        }
      }
      if (item.name === 'daily-check-in') {
        taskStateNew.dailyCheck = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
      if (item.name === 'Join the Telegram group') {
        taskStateNew.joinTGGroup = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
      if (item.name === 'YouTube follow') {
        taskStateNew.youtube = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
      // if (item.name === 'Twitter follow') {
      //   taskStateNew.twitter = {
      //     id: item.id,
      //     name: item.name,
      //     profit: item.profit / 100,
      //     isDone: item.isDone
      //   }
      // }
      if (item.name === 'Twitter post follow') {
        taskStateNew.twitter = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
      if (item.name === 'FB follow') {
        taskStateNew.facebook = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
      if (item.name === 'Meta post follow') {
        taskStateNew.meta = {
          id: item.id,
          name: item.name,
          profit: item.profit / 100,
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
      if (item.name === 'Timelypurse') {
        taskStateNew.timelypurse = {
          id: item.id,
          name: item.name,
          profit: formatPriceIfUsdt(item.profitCurrency, item.profit),
          isDone: item.isDone,
          profitCurrency: item.profitCurrency
        }
      }
    })
    if (!taskMap['follow']) {
      taskStateNew.follow = {
        ...taskStateNew.follow,
        isDone: true
      }
    }
    if (!taskMap['daily-check-in']) {
      taskStateNew.dailyCheck = {
        ...taskStateNew.dailyCheck,
        isDone: true
      }
    }
    if (!taskMap['Join the Telegram group']) {
      taskStateNew.joinTGGroup = {
        ...taskStateNew.joinTGGroup,
        isDone: true
      }
    }
    if (!taskMap['YouTube follow']) {
      taskStateNew.youtube = {
        ...taskStateNew.youtube,
        isDone: true
      }
    }
    // if (!taskMap['Twitter follow']) {
    //   taskStateNew.twitter = {
    //     ...taskStateNew.twitter,
    //     isDone: true
    //   }
    // }
    if (!taskMap['Twitter post follow']) {
      taskStateNew.twitter = {
        ...taskStateNew.twitter,
        isDone: true
      }
    }
    if (!taskMap['FB follow']) {
      taskStateNew.facebook = {
        ...taskStateNew.facebook,
        isDone: true
      }
    }
    if (!taskMap['Meta post follow']) {
      taskStateNew.meta = {
        ...taskStateNew.meta,
        isDone: true
      }
    }
    if (!taskMap['Timelypurse']) {
      taskStateNew.timelypurse = {
        ...taskStateNew.timelypurse,
        isDone: true
      }
    }
    setTaskState({ ...taskStateNew })
  }, [taskList]);

  return (
    <div className={styles.page}>
      <div className={styles.pageBox}>
        <div className={styles.header}>
          <p className={styles.title}>
            NeuroX
          </p>
          <p className={styles.money}>
            18888888
          </p>
        </div>
        <div className={styles.topIcons}>
          {
            homeIconList.map(iconItems => {
              return <div className={styles.iconWrap}>
                {
                  iconItems.map(iconItem => {
                    return <img onClick={() => iconItem.navigatePath && navigate(iconItem.navigatePath)}  className={styles.iconItem} src={iconItem.iconPath} alt="" />
                  })
                }
              </div>
            })
          }
        </div>
        <div className={styles.miningFrequencyBox}>
          <div className={styles.top}>
            <div className={styles.leftSec}>
              <img src="./img/home/mining-records-icon.png" alt="" />
              <span>挖矿次数</span>
              <p>5次/8h</p>
            </div>
            <div className={styles.btn}>Claim</div>
          </div>
          <div className={styles.progress}></div>

        </div>
        {/* 任务中心 */}
        <div className={styles.task}>
          <p className={styles.title}>任务中心</p>
          {
            taskListData.map(item => {
              return (<div className={styles.box}>
                <div className={styles.left}>
                  <img src={item.iconPath} alt="" />
                </div>
                <div className={styles.center}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.desc}>{item.desc}</p>
                </div>
                <div className={styles.right}>Follow</div>
              </div>)
            })
          }
        </div>
      </div>

    </div>
  )
}

export default Home
