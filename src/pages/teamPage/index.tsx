
import styles from "./index.module.scss"
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {APITeamInfoData} from "@/api";
import {useEffect, useState} from "react";
import {TeamInfoDataType} from "@/types";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis, setTeamInfoData} from "@/redux/actions/home.ts";
import {numberKMFormat} from "@/utils/numFormat.ts";
import {textCopyToClipboard} from "@/utils/textUtils.ts";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {Modal} from "antd";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const TeamPage = () => {

  const inviteUrl: string = useSelector((state: any) => state.user.userInfo.inviteUrl)

  const {t}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()

  const dispatch = useDispatchAction({setTeamInfoData, setLoadingModalVis})

  const teamStatePageData: TeamInfoDataType = useSelector((state: any) => state.home.pageState.teamState)

  const [teamState, setTeamState] = useState<any>({
    userId: 0,
    totalCount: 0,
    totalCountLevel1: 0,
    totalCountLevel2: 0,
    commissionCount: 0,
    commissionUsers: 0,
    commissionAmount: 0,
    commissionCountLevel1: 0,
    commissionUsersLevel1: 0,
    commissionAmountLevel1: 0,
    amountLevel1: 0,
    commissionCountLevel2: 0,
    commissionUsersLevel2: 0,
    commissionAmountLevel2: 0,
    amountLevel2: 0,
    svipCount: 0,
    svipUsers: 0,
    svipAmount: 0,
    svipCountLevel1: 0,
    svipUsersLevel1: 0,
    svipAmountLevel1: 0,
    svipCountLevel2: 0,
    svipUsersLevel2: 0,
    svipAmountLevel2: 0,
    miningCount: 0,
    miningUsers: 0,
    miningAmount: 0,
    commissionAmountNFT: 0,
    commissionAmountNFTLevel1: 0,
    commissionAmountNFTLevel2: 0
  })

  const [ruleVis, setRuleVis] = useState(false)

  const navigate = useNavigate()

  const fetchData = () => {
    if (!teamStatePageData) {
      dispatch.setLoadingModalVis(true)
      APITeamInfoData().then(resp => {
        if (resp.code === 0) {
          dispatch.setTeamInfoData(resp.data)
        }
      }).finally(() => {
        dispatch.setLoadingModalVis(false)
      })
    }
  }

  const onInviteClick = () => {
    const shareUrl = `https://t.me/share/url?url=${inviteUrl}&text=${encodeURIComponent(`Join ${MAIN_CURRENCY_COIN} now, easily obtain ${MAIN_CURRENCY_COIN} tokens and start your asset appreciation journey!`)}`
    const webApp = getTelegramWebApp()
    webApp.openTelegramLink(shareUrl)
  }

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    if (teamStatePageData) {
      setTeamState({...teamStatePageData})
    }
  }, [teamStatePageData]);

  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <span>{t('team_page_title')}</span>
      </div>

      <div className={styles.team_upgrade_wrap}>
        <div className={styles.title_wrap_3}>{t('team_my_friends')}</div>
        <div className={styles.team_friend_wrap}>
          <div className={styles.team_friend_item_wrap}>
            <div className={styles.friend_rate_text}>10%</div>
            <div className={styles.friend_label_text}>{t('team_friends')}</div>
            <div className={styles.friend_invite_wrap}>
              <div className={styles.friend_icon}><img src={'/img/tab/tab_team_ac.png'}/> </div>
              <div className={styles.friend_num}>{teamState?.totalCountLevel1 ?? 0}</div>
            </div>
          </div>
          <div className={`${styles.team_friend_item_wrap} ${styles.team_friend_item_wrap_2}`}>
            <div className={styles.friend_rate_text}>2%</div>
            <div className={styles.friend_label_text}>{t('team_friends_invites')}</div>
            <div className={styles.friend_invite_wrap}>
              <div className={styles.friend_icon}><img src={'/img/tab/tab_team_ac.png'}/> </div>
              {/*<div className={styles.friend_icon}><img src={'/img/function/team.png'}/> </div>*/}
              <div className={styles.friend_num}>{teamState?.totalCountLevel2 ?? 0}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.team_upgrade_wrap}>
        <div className={styles.title_wrap_2}>{t('team_today_earning')}</div>
        <div className={styles.num_wrap}>
          <div className={styles.num_info_item}>
            {/*<div className={styles.num_text}>$ {numberKMFormat((teamState?.commissionAmount ?? 0) / 1000000)}</div>*/}
            <div className={styles.num_text}><div className={styles.icon_box}><img src={'/img/usdt_icon.png'} /> </div> {numberKMFormat((teamState?.commissionAmountNFT ?? 0) / 1_000_000)}</div>
            <div className={styles.hint_text} dangerouslySetInnerHTML={{__html: 'Total U'}}></div>
          </div>
          <div className={styles.num_info_item}>
            {/*<div className={styles.num_text}>$ {numberKMFormat((teamState?.commissionAmount ?? 0) / 1000000)}</div>*/}
            <div className={styles.num_text}><div className={styles.icon_box}><img src={'/img/coin_icon.png'} /> </div> {numberKMFormat((teamState?.commissionAmount ?? 0) / 100)}</div>
            <div className={styles.hint_text} dangerouslySetInnerHTML={{__html: `Total ${MAIN_CURRENCY_COIN}`}}></div>
          </div>
          {/*<div className={styles.num_info_item}>*/}
          {/*  <div className={styles.num_text}>{numberKMFormat(teamState?.commissionCount ?? 0)}</div>*/}
          {/*  <div className={styles.hint_text} dangerouslySetInnerHTML={{__html: t('team_SVIP_amount')}}></div>*/}
          {/*</div>*/}
          {/*<div className={styles.num_info_item}>*/}
          {/*  <div className={styles.num_text}>{numberKMFormat(teamState?.commissionUsers ?? 0)}</div>*/}
          {/*  <div className={styles.hint_text} dangerouslySetInnerHTML={{__html: t('team_SVIP_personnel')}}></div>*/}
          {/*</div>*/}
        </div>

        <div onClick={() => navigate('/teamRecordPage/1')} className={styles.team_upgrade_wrap}>
          <div className={styles.friend_reward_item_wrap}>
            <div className={styles.f_text}>{t('team_friends')}</div>
            <div className={styles.f_right_wrap}>
              <div className={styles.f_right_item_wrap}>
                <div className={styles.coin_icon}><img src={'/img/coin_icon.png'}/> </div>
                <div className={styles.coin_num_text}>{numberKMFormat((teamState?.commissionAmountLevel1 ?? 0) / 100)}</div>
              </div>
              <div className={styles.f_right_item_wrap}>
                <div className={styles.coin_icon}><img src={'/img/usdt_icon.png'}/> </div>
                <div className={styles.coin_num_text}>{numberKMFormat((teamState?.commissionAmountNFTLevel1 ?? 0) / 1_000_000)}</div>
              </div>
            </div>
            <div className={styles.f_right_icon}></div>
          </div>
        </div>

        <div onClick={() => navigate('/teamRecordPage/2')} className={styles.team_upgrade_wrap}>
          <div className={styles.friend_reward_item_wrap}>
            <div className={styles.f_text}>{t('team_friends_invites')}</div>
            <div className={styles.f_right_wrap}>
              <div className={styles.f_right_item_wrap}>
                <div className={styles.coin_icon}><img src={'/img/coin_icon.png'}/> </div>
                <div className={styles.coin_num_text}>{numberKMFormat((teamState?.commissionAmountLevel2 ?? 0) / 100)}</div>
              </div>
              <div className={styles.f_right_item_wrap}>
                <div className={styles.coin_icon}><img src={'/img/usdt_icon.png'}/> </div>
                <div className={styles.coin_num_text}>{numberKMFormat((teamState?.commissionAmountNFTLevel2 ?? 0) / 1_000_000)}</div>
              </div>
            </div>
            <div className={styles.f_right_icon}></div>
          </div>
        </div>

      </div>
      <div className={styles.bottom_wrap}>
        <div onClick={onInviteClick} className={styles.invite_btn}>{t('function_invite')}</div>
        <div onClick={() => textCopyToClipboard(inviteUrl)} className={styles.copy_btn}>{t('collection_copy')}</div>
      </div>

      <div onClick={() => setRuleVis(true)} className={styles.info_icon}></div>


      <Modal centered footer={null} closeIcon={false} open={ruleVis} onCancel={() => setRuleVis(false)}>
        <div className={styles.modal_content}>

          <div className={styles.title_wrap}>{t('team_dialog_title', {currency: MAIN_CURRENCY_COIN})}</div>

          <div className={styles.content_text} dangerouslySetInnerHTML={{__html: t('team_dialog_content')}}></div>

          <div onClick={() => setRuleVis(false)} className={styles.determine_btn}>{t('home_determine')}</div>
        </div>
      </Modal>

      <div className={styles.sized_box}></div>

    </div>
  )
}

export default TeamPage
