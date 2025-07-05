import {useEffect, useState} from "react";
import styles from "./index.module.scss"
import {message, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import homeAnimation from "@/assets/animation/homeAnimation.json"
import rankAnimation from "@/assets/animation/rankAnimation.json"
import Lottie from "react-lottie";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {UserAuthDataType, UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {MiningInfoType, MiningStateType} from "@/redux/reducers/user/miningInfo.ts";
import {numberFormatToEnglish} from "@/utils/numFormat.ts";
import {useMining} from "@/hooks/useMining.ts";
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
import {RewardTaskLItemType, TaskItemType, TeamInfoDataType} from "@/types";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {formatPriceIfUsdt, formatUnitByCurrency} from "@/utils/textUtils.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";
const Home = ()  => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const { startTiming } = useMining()

  const dispatch = useDispatchAction({ setLoadingModalVis, setMiningData, resetMiningState, setAssetsState, setTaskList, setFollowedList, setActivityState})

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

  const onSignInClick= (item) => {
    if (item.isDone) {
      message.info(t('sign_hint_done_message'))
      return
    }
    dispatch.setLoadingModalVis(true)
    APITaskDone(item.id).then(resp => {
      if (resp.code === 0) {
        message.success(t('task_reward_message', {amount: item.profit, currency: MAIN_CURRENCY_COIN}))
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
        message.success(t('task_reward_message', {amount: item.profit, currency: formatUnitByCurrency(item.profitCurrency)}).replace(MAIN_CURRENCY_COIN, formatUnitByCurrency(item.profitCurrency)))
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
    APIActivityList({pageNo: 1, pageSize: 10}).then(resp => {
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
    setTaskState({...taskStateNew})
  }, [taskList]);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left_wrap}>
          <span className={styles.user_text}>UID: {userAuthData.userId}</span>
          <div className={styles.level_wrap}>Lv {userInfoData.level}</div>
        </div>
        <div className={styles.header_right_wrap}>
          <div onClick={gotoLanguagePage} className={styles.language_icon}></div>
        </div>
      </div>
      <div className={styles.gen_num_wrap}>
        <div className={styles.gen_box}>
          <div className={styles.coin_icon}></div>
          <span className={styles.gen_balance_num}>{numberFormatToEnglish(miningState.miningAmount, 6)}</span>
          <span className={styles.gen_util}>{MAIN_CURRENCY_COIN}</span>
        </div>
        <span className={styles.usdt_num}>={numberFormatToEnglish(miningState.miningAmount * rateGENToUSDT, 6)}USDT</span>
      </div>
      <div className={styles.coin_big_logo_wrap}>
        <Lottie
          options={lottieDefaultOptions}
          isClickToPauseDisabled={true}
        />
        <div className={styles.rank_icon_box}>
          <div onClick={() => navigate('/function')} className={styles.rank_icon}>
            <Lottie
              options={lottieRankOptions}
              isClickToPauseDisabled={true}
            />
          </div>
          <div className={styles.lucky_bag_hint_wrap}>{t('home_rank_icon_text')}<span className={styles.right_icon_l}></span></div>
        </div>

      </div>
      <div className={styles.mining_wrap}>
        <div className={styles.mining_num}>{numberFormatToEnglish(miningData.speed, 2)} {MAIN_CURRENCY_COIN} / H</div>
        <div className={styles.mining_box}>
          <div className={styles.mining_box_header}>
            <div onClick={() => setRuleVis(true)} className={styles.info_icon}></div>
          </div>
          <div className={styles.mining_time_wrap}>
            <div className={styles.time_left_line}></div>
            <div className={styles.time_text}>{miningState.hours}H {miningState.minutes}M {miningState.seconds}S</div>
            <div className={styles.time_right_line}></div>
          </div>
          <div className={styles.hint_text_wrap}>
            <span>{t('home_leave_and_restart')}</span>
          </div>
          <div className={styles.mining_btn_wrap}>
            <div onClick={onStartMiningClick} className={`${styles.start_mining_btn} ${miningData.status === 1 && styles.mining_in_btn} ${miningData.status === 2 && styles.rewards_btn}`}>
              {
                [0].includes(miningData.status) && t('home_start_mining_coins')
              }
              {
                miningData.status === 1 && t('home_mining_in_progress')
              }
              {
                miningData.status === 2 && t('home_game_rewards')
              }
            </div>
          </div>
        </div>
      </div>
      <div className={styles.page_title}>{t('task_task_center')}</div>

      <div className={styles.task_center_wrap}>

        <div key={'task-key-joinGroup6'} className={styles.task_item_wrap}>
          <div className={styles.icon_box}><img src={'/img/home/casmedia_icon.jpg'}/></div>
          <div className={styles.center_content_wrap}>
            <div className={styles.content_title}>Timelypurse</div>
            <div
              className={styles.content_hint_text}>Register now to
              receive {taskState.timelypurse.profit} {formatUnitByCurrency(taskState.timelypurse.profitCurrency)}</div>
          </div>
          <div className={styles.right_content_wrap}>
            {/*<div onClick={() => onJoinGroup(taskState.joinTGGroup)} className={`${styles.action_btn} ${taskState.joinTGGroup.isDone && styles.action_btn_inactive}`}>{taskState.joinTGGroup.isDone ? t('common_finish') : t('task_follow')}</div>*/}
            <div onClick={() => onJoinGroup(taskState.timelypurse)}
                 className={`${styles.action_btn}`}>Download
            </div>
            <div
              className={styles.add_num}>+{taskState.timelypurse.profit} {formatUnitByCurrency(taskState.timelypurse.profitCurrency)}</div>
          </div>
        </div>

        <div key={'task-key-joinGroup'} className={styles.task_item_wrap}>
          <div className={styles.icon_box}><img src={'/img/home/follow_telegram_icon.png'}/></div>
          <div className={styles.center_content_wrap}>
            <div className={styles.content_title}>{t('task_join_group_title')}</div>
            <div
              className={styles.content_hint_text}>{t('task_join_group_sub_title', {amount: taskState.joinTGGroup.profit, currency: MAIN_CURRENCY_COIN})}</div>
          </div>
          <div className={styles.right_content_wrap}>
            {/*<div onClick={() => onJoinGroup(taskState.joinTGGroup)} className={`${styles.action_btn} ${taskState.joinTGGroup.isDone && styles.action_btn_inactive}`}>{taskState.joinTGGroup.isDone ? t('common_finish') : t('task_follow')}</div>*/}
            <div onClick={() => onJoinGroup(taskState.joinTGGroup)}
                 className={`${styles.action_btn}`}>{t('task_follow')}</div>
            <div className={styles.add_num}>+{taskState.joinTGGroup.profit} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

        <div key={'task-key-joinGroup3'} className={styles.task_item_wrap}>
          <div className={styles.icon_box}><img src={'/img/home/meta_icon.jpg'}/></div>
          <div className={styles.center_content_wrap}>
            <div className={styles.content_title}>{t('home_task_fb_post_title', {currency: MAIN_CURRENCY_COIN})}</div>
            <div className={styles.content_hint_text}>{t('home_task_fb_post_hint')}</div>
          </div>
          <div className={styles.right_content_wrap}>
            {/*<div onClick={() => onJoinGroup(taskState.twitter)} className={`${styles.action_btn} ${taskState.twitter.isDone && styles.action_btn_inactive}`}>{taskState.twitter.isDone ? t('common_finish') : t('task_follow')}</div>*/}
            <div onClick={() => onJoinGroup(taskState.meta)} className={`${styles.action_btn}`}>{t('task_follow')}</div>
            <div className={styles.add_num}>+{taskState.meta.profit} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

        <div key={'task-key-joinGroup2'} className={styles.task_item_wrap}>
          <div className={styles.icon_box}><img src={'/img/home/follow_facebook_icon.png'}/></div>
          <div className={styles.center_content_wrap}>
            <div className={styles.content_title}>{t('task_join_facebook_title', {currency: MAIN_CURRENCY_COIN})}</div>
            <div className={styles.content_hint_text}>{t('task_join_facebook_sub_title')}</div>
          </div>
          <div className={styles.right_content_wrap}>
            {/*<div onClick={() => onJoinGroup(taskState.facebook)} className={`${styles.action_btn} ${taskState.facebook.isDone && styles.action_btn_inactive}`}>{taskState.facebook.isDone ? t('common_finish') : t('task_follow')}</div>*/}
            <div onClick={() => onJoinGroup(taskState.facebook)}
                 className={`${styles.action_btn}`}>{t('task_follow')}</div>
            <div className={styles.add_num}>+{taskState.facebook.profit} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

        <div key={'task-key-joinGroup4'} className={styles.task_item_wrap}>
          <div className={styles.icon_box}><img src={'/img/home/follow_youtube_icon.png'}/></div>
          <div className={styles.center_content_wrap}>
            <div className={styles.content_title}>{t('task_join_youtube_title', {currency: MAIN_CURRENCY_COIN})}</div>
            <div className={styles.content_hint_text}>{t('task_join_youtube_sub_title')}</div>
          </div>
          <div className={styles.right_content_wrap}>
            {/*<div onClick={() => onJoinGroup(taskState.youtube)} className={`${styles.action_btn} ${taskState.youtube.isDone && styles.action_btn_inactive}`}>{taskState.youtube.isDone ? t('common_finish') : t('task_follow')}</div>*/}
            <div onClick={() => onJoinGroup(taskState.youtube)}
                 className={`${styles.action_btn}`}>{t('task_follow')}</div>
            <div className={styles.add_num}>+{taskState.youtube.profit} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

        {
          rewardTaskList.filter(key => key.type === 1).map((item) => (
            <div key={'task-reward-key-' + item.id} className={styles.task_item_wrap}>
              <div className={styles.icon_r_box}><img src={'./img/function/team.png'}/></div>
              {/*<div className={styles.icon_box}><img src={'./img/home/task_invite_icon.png'}/> </div>*/}
              <div className={styles.center_content_wrap}>
                <div className={styles.content_title}>{t('invite_task_label1')}</div>
                <div className={styles.content_hint_text}>
                  <span className={styles.hint_left_text}>{t('invite_task_hint1')}</span>

                </div>

              </div>
              <div className={`${styles.right_content_wrap} ${styles.right_r_content_wrap}`}>
                {
                  teamStatePageData.totalCountLevel1 > item.referralCountA ? (
                    <div onClick={() => {
                      navigate('/teamPage')
                    }} className={`${styles.action_btn} ${styles.action_btn_inactive}`}>{t('common_finish')}</div>
                  ) : (
                    <div onClick={() => {
                      navigate('/teamPage')
                    }} className={styles.action_btn}>{t('invite_invite')}</div>
                  )
                }
                <div className={styles.add_num}>+{item.amount / 100} {MAIN_CURRENCY_COIN}</div>
              </div>
              <div className={styles.invite_wrap}>
                <span>{teamStatePageData.totalCountLevel1 ? teamStatePageData.totalCountLevel1 > item.referralCountA ? item.referralCountA : teamStatePageData.totalCountLevel1 : 0}/{item.referralCountA}</span>
              </div>
            </div>
          ))
        }

        {
          rewardTaskList.filter(key => key.type === 2).map((item) => (
            <div key={'task-u_reward-key-' + item.id} className={styles.task_item_wrap}>
              <div className={styles.icon_u_box}><img src={'/img/accelerate/action_1_icon.png'}/></div>
              <div className={styles.center_content_wrap}>
                <div className={styles.content_title}>{t('task_upgrade_title', {amount: item.upgrade})}</div>
                <div className={styles.content_hint_text}>
                  <span className={styles.hint_left_text}>{t('task_upgrade_hint_text')}</span>
                  {/*<span className={styles.hint_right_text}>+{item.amount / 100} {MAIN_CURRENCY_COIN}</span>*/}
                </div>
              </div>
              <div className={`${styles.right_content_wrap} ${styles.right_r_content_wrap}`}>
                {
                  userInfoData.level >= item.upgrade ? (
                    <div onClick={() => {
                      navigate('/accelerate', {state: {tabType: 2}})
                    }} className={`${styles.action_btn} ${styles.action_btn_inactive}`}>{t('common_finish')}</div>
                  ) : (
                    <div onClick={() => {
                      navigate('/accelerate', {state: {tabType: 2}})
                    }} className={styles.action_btn}>{t('accelerate_upgrade')}</div>
                  )
                }
                <div className={styles.add_num}>+{item.amount / 100} {MAIN_CURRENCY_COIN}</div>
              </div>
              <div className={styles.invite_wrap}>
                <span>{userInfoData ? userInfoData.level > item.upgrade ? item.upgrade : userInfoData.level : 0}/{item.upgrade}</span>
              </div>
            </div>
          ))
        }


        {/*<div key={'task-key-follow'} className={styles.task_item_wrap}>*/}
        {/*  <div className={styles.icon_box}><img src={'./img/home/task_follow_icon.png'}/> </div>*/}
        {/*  <div className={styles.center_content_wrap}>*/}
        {/*    <div className={styles.content_title}>{t('task_item_follow_title')}</div>*/}
        {/*    <div className={styles.content_hint_text}>{t('task_item_follow_label', {currency: MAIN_CURRENCY_COIN})}</div>*/}
        {/*  </div>*/}
        {/*  <div className={styles.right_content_wrap}>*/}
        {/*    <div onClick={() => setFollowVis(true)} className={`${styles.action_btn} ${taskState.follow.isDone && styles.action_btn_inactive}`}>{taskState.follow.isDone ? t('follow_completed') : t('task_follow')}</div>*/}
        {/*    <div className={styles.add_num}>+{taskState.follow.profit} {MAIN_CURRENCY_COIN}</div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div key={'task-key-check-in'} className={styles.task_item_wrap}>
          <div className={styles.icon_box}><img src={'./img/home/task_sign_icon.png'}/></div>
          <div className={styles.center_content_wrap}>
            <div className={styles.content_title}>{t('task_item_sign_title')}</div>
            <div className={styles.content_hint_text}>{t('task_item_sign_label')}</div>
          </div>
          <div className={styles.right_content_wrap}>
            <div onClick={() => onSignInClick(taskState.dailyCheck)}
                 className={`${styles.action_btn} ${taskState.dailyCheck.isDone && styles.action_btn_inactive}`}>{t('task_sign_in')}</div>
            <div className={styles.add_num}>+{taskState.dailyCheck.profit} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

      </div>

      <div className={styles.sized_bottom_box}></div>


      <FollowPopup open={followVis} onModalCloseHandle={() => {
        setFollowVis(false)
      }}/>

      <Modal centered footer={null} closeIcon={false} open={ruleVis} onCancel={() => setRuleVis(false)}>
        <div className={styles.modal_content}>

          <div className={styles.title_wrap}>{t('home_mining_rules')}</div>

          <div className={styles.content_text}>{t('home_mining_rules_hint')}</div>

          <div onClick={() => setRuleVis(false)} className={styles.determine_btn}>{t('home_determine')}</div>
        </div>
      </Modal>
      <Modal centered footer={null} closeIcon={false} open={downloadRewardVis} onCancel={() => setDownloadRewardVis(false)}>
        <div className={styles.modal_content_2}>
          <div className={styles.modal_content_2_box}>
            <div className={styles.m_usdt_icon}></div>
            <div className={styles.m_title}>{t('prize_pool_fill_congratulations')}</div>
            <div className={styles.m_sub_title}>{t('home_task_timelypurse_hint_text')}</div>

            <div className={styles.m_amount_text}>{numberFormatToEnglish(taskState.timelypurse.profit)} {formatUnitByCurrency(taskState.timelypurse.profitCurrency)}</div>

          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Home
