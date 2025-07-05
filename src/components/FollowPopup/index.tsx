import styles from "./index.module.scss"
import {Popup} from "antd-mobile";
import {useTranslation} from "react-i18next";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {useSelector} from "react-redux";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setAssetsState, setFollowedList, setTaskList} from "@/redux/actions/home.ts";
import {APIAssetsInfo, APITaskDone, APITaskList} from "@/api";
import {TaskItemType} from "@/types";
import {message} from "antd";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const FollowPopup = ({open, onModalCloseHandle}) => {

  const {t}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()

  const dispatch = useDispatchAction({setFollowedList, setTaskList, setAssetsState})

  const followedList: Array<number> = useSelector((state: any) => state.user.userInfo.followedList)

  const taskList: Array<TaskItemType> = useSelector((state: any) => state.home.pageState.taskList)

  const followList = [
    {
      id: 1,
      name: 'Facebook',
      icon: './img/home/follow_facebook_icon.png',
      link: 'https://www.facebook.com/profile.php?id=61568161914646&mibextid=ZbWKwL',
      isTg: false,
    },
    {
      id: 2,
      name: 'Twitter',
      icon: './img/home/follow_x_icon.png',
      link: 'https://x.com/GENnetworkcoin',
      isTg: false,
    },
    {
      id: 3,
      name: 'Telegram Channel',
      icon: './img/home/follow_telegram_icon.png',
      link: 'https://t.me/Gennewvip',
      isTg: true,
    },
    {
      id: 4,
      name: 'Telegram Group',
      icon: './img/home/follow_telegram_icon.png',
      link: 'https://t.me/+Ywjcne3IKk80NDZl',
      isTg: true,
    },
    {
      id: 5,
      name: 'Youtube',
      icon: './img/home/follow_youtube_icon.png',
      link: 'https://youtube.com/@gen-web3-vip?si=SUyJg99xdAESYWIH',
      isTg: false,
    },
  ]

  const onFollowLinkClick = async (item) => {
    try {
      console.log(followedList)
      if (!followedList.includes(item.id)) {
        const nowFollowedList = followedList
        nowFollowedList.push(item.id)
        dispatch.setFollowedList([...nowFollowedList])
        if (nowFollowedList.length === followList.length) {
          let taskId = 0
          let amount = 0
          taskList.map(item => {
            if (item.name === 'follow') {
              taskId = item.id
              amount = item.profit
            }
          })
          message.success(t('task_reward_message', {amount: amount / 100, currency: MAIN_CURRENCY_COIN}))
          await APITaskDone(taskId)
          fetchTaskList()
          fetchAsste()
        }
      }
      const webApp = getTelegramWebApp()
      if (item.isTg) {
        webApp.openTelegramLink(item.link)
      } else {
        webApp.openLink(item.link)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const fetchAsste = () => {
    APIAssetsInfo().then(resp => {
      if (resp.code === 0) {
        dispatch.setAssetsState(resp.data)
      }
    })
  }

  const fetchTaskList = async () => {

    try {
      const resp = await APITaskList()
      if (resp.code === 0) {
        dispatch.setTaskList([...resp.data])
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Popup visible={open} onMaskClick={onModalCloseHandle} className={styles.popup_sty} onClose={onModalCloseHandle}>
      <div className={styles.popup_content}>

        <div className={styles.popup_title}>{t('follow_popup_title')}</div>

        {
          followList.map((item, index) => (
            <div key={'popup-follow-key-' + index} className={styles.follow_item_wrap}>
              <div className={styles.follow_icon}><img src={item.icon} /> </div>
              <div className={styles.follow_name}>{item.name}</div>
              <div onClick={() => onFollowLinkClick(item)} className={`${styles.follow_btn} ${(followedList?.includes(item.id)) && styles.follow_btn_inactive}`}>{followedList?.includes(item.id) ? t('follow_completed') : t('task_follow')}</div>
            </div>
          ))
        }


        <div onClick={onModalCloseHandle} className={styles.close_icon}></div>

      </div>
    </Popup>
  )
}

export default FollowPopup
