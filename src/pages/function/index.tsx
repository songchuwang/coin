import styles from "./index.module.scss"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ImageWidget from "@/components/ImageWidget";
import {message, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {numberFormatToEnglish, numberKMFormat, numberMFormat} from "@/utils/numFormat.ts";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setActivityState, setLoadingModalVis, setRankList} from "@/redux/actions/home.ts";
import {APIRankList} from "@/api";
import {PrizeActivityItemType, RankItemType} from "@/types";
import {useSelector} from "react-redux";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {formatTimestampToDHMSNumState} from "@/utils/timeFormat.ts";
import {formatPriceIfUsdt} from "@/utils/textUtils.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";


const Function = () => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const navigate = useNavigate()

  const dispatch = useDispatchAction({ setLoadingModalVis, setRankList, setActivityState })

  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)

  const rankList: Array<RankItemType> = useSelector((state: any) => state.home.pageState.rankList)

  const activityState: PrizeActivityItemType = useSelector((state: any) => state.user.userInfo.activityState)

  const [ruleVis, setRuleVis] = useState(false)

  const [prizeRuleVis, setPrizeRuleVis] = useState(false)

  const [myRankNum, setMyRankNum] = useState('--')

  const [tabRankIndex, setTabRankIndex] = useState(0)

  // const gotoLanguagePage = () => {
  //   navigate('/languagePage')
  // }

  // const gotoActionPage = (id: number) => {
  //   if (id === 1) {
  //     navigate('/teamPage')
  //   }
  //   if (id === 2) {
  //     navigate('/problemFeedbackPage')
  //   }
  //   if (id === 3) {
  //     navigate('/introductionPage')
  //   }
  //   if (id === 4) {
  //     navigate('/devRouterPage')
  //   }
  //   if (id === 5) {
  //     navigate('/tokenAllocationPage')
  //   }
  //   if (id === 6) {
  //     // message.info(t('upgrade_text'))
  //     navigate('/exchangePage')
  //   }
  //   if (id === 7) {
  //     // message.info(t('upgrade_text'))
  //     navigate('/collectionPage')
  //   }
  //   if (id === 8) {
  //     navigate('/invitePage')
  //   }
  // }
  //
  // const [actionList] = useState([
  //   //
  //   // {
  //   //   id: 2,
  //   //   img: './img/function/problem.png',
  //   //   name: t('function_problem_feedback')
  //   // },
  //   // {
  //   //   id: 3,
  //   //   img: './img/function/platform.png',
  //   //   name: t('function_platform_introduction')
  //   // },
  //   // {
  //   //   id: 4,
  //   //   img: './img/function/development.png',
  //   //   name: t('function_development_route')
  //   // },
  //   // {
  //   //   id: 5,
  //   //   img: './img/function/speech.png',
  //   //   name: t('function_white_paper')
  //   // },
  //   // {
  //   //   id: 1,
  //   //   img: './img/function/team.png',
  //   //   name: t('function_team_background')
  //   // },
  //   // {
  //   //   id: 6,
  //   //   img: './img/function/usdn.png',
  //   //   name: t('function_USDNUSDT')
  //   // },
  //   // {
  //   //   id: 7,
  //   //   img: './img/function/privacy.png',
  //   //   name: t('function_privacy_policy')
  //   // },
  //   // {
  //   //   id: 8,
  //   //   img: './img/function/invite.png',
  //   //   name: t('function_invite')
  //   // },
  // ])

  const fetchData = (type: number) => {
    dispatch.setRankList([])
    dispatch.setLoadingModalVis(true)
    APIRankList(type).then(resp => {
      if (resp.code === 0) {
        dispatch.setRankList(resp.data)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }


  const onActivityInvite = () => {
    if (activityState) {
      navigate('/prizePoolPage')
    } else {
      message.warn(t('prize_pool_activity_end'))
    }
  }

  const onTabIndexChange = (index: number, type: number) => {
    setTabRankIndex(index)
    fetchData(type)
  }

  useEffect(() => {
    fetchData(3)
  }, []);

  useEffect(() => {
    let nowRankNum = rankList.length + '+'
    rankList.map((item) => {
      if (item.userId === userInfoData.userId) {
        nowRankNum = item.rank
      }
    })
    setMyRankNum(nowRankNum)
  }, [rankList]);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left_wrap}>
          <div className={styles.coin_icon}></div>
          <span className={styles.gen_text}>{MAIN_CURRENCY_COIN}</span>
        </div>
        {/*<div className={styles.header_right_wrap}>*/}
        {/*  <div onClick={gotoLanguagePage} className={styles.language_icon}></div>*/}
        {/*</div>*/}
      </div>
      {/*<div className={styles.airdrop_box}>*/}
      {/*  <div className={styles.ardrop_wrap}>*/}
      {/*    {*/}
      {/*      prizeLoading ? (*/}
      {/*        <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>*/}
      {/*      ) : (*/}
      {/*        <>*/}
      {/*          <div className={styles.ardrop_top_wrap}>*/}
      {/*            <div className={styles.airdrop_left_line}></div>*/}
      {/*            <div className={styles.airdrop_title} dangerouslySetInnerHTML={{__html: t('prize_pool_title_text', {amount: `${formatPriceIfUsdt(1, activityState?.totalPrize ?? 0)}U`})}}></div>*/}
      {/*            <div className={styles.airdrop_right_line}></div>*/}
      {/*          </div>*/}
      {/*          <PrizePoolTimeWidget />*/}
      {/*          <div className={styles.airdrop_bottom_wrap}>*/}
      {/*            <div onClick={onActivityInvite} className={styles.airdrop_invite_btn}>*/}
      {/*              <span>{t('function_invite')}</span>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <div onClick={() => setPrizeRuleVis(true)} className={styles.info_icon}></div>*/}
      {/*        </>*/}
      {/*      )*/}
      {/*    }*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className={styles.action_wrap}>*/}
      {/*  {*/}
      {/*    actionList.map((item, index) => (*/}
      {/*      <div onClick={() => gotoActionPage(item.id)} key={'action-key-' + index} className={styles.action_item}>*/}
      {/*        <img className={styles.icon_img} src={item.img} />*/}
      {/*        <span className={styles.action_text}>{item.name}</span>*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  }*/}
      {/*</div>*/}

      <div className={styles.leaderboard_wrap}>
        <span className={styles.title}>{t('function_team_leaderboard')}</span>
        {/*<div className={styles.hint_wrap}>*/}
        {/*  <span className={styles.hint_text}>{t('function_team_leaderboard_hint')}</span>*/}
        {/*  <span onClick={() => setRuleVis(true)} className={styles.info_icon}></span>*/}
        {/*</div>*/}
        <div className={styles.rank_type_tab_wrap_box}>
          <div className={styles.rank_type_tab_wrap}>
            <div className={`${styles.rank_type_tab_item} ${tabRankIndex === 0 && styles.rank_type_tab_item_active}`} onClick={() => onTabIndexChange(0, 3)}><span>{t('rank_tab_invites')}</span></div>
            <div className={`${styles.rank_type_tab_item} ${tabRankIndex === 1 && styles.rank_type_tab_item_active}`} onClick={() => onTabIndexChange(1, 2)}><span>{t('rank_tab_income')}</span></div>
            <div className={`${styles.rank_type_tab_item} ${tabRankIndex === 2 && styles.rank_type_tab_item_active}`} onClick={() => onTabIndexChange(2, 1)}><span>{MAIN_CURRENCY_COIN}</span></div>
            <div className={styles.tab_type_bg_ac_wrap}>
              <div style={{width: `calc(100% / 3 * ${tabRankIndex})`}} className={styles.tab_type_bg_box}></div>
              <div className={styles.tab_type_bg_ac}></div>
            </div>
          </div>

        </div>

        <div className={styles.top_three_wrap}>
          <div className={styles.top_three_item}>
            <div className={styles.top_header_wrap_2}>
              <div className={styles.header_img}><ImageWidget src={rankList[1] ? rankList[1].avatar : '/img/default_avatar.png'} /></div>
            </div>
            {/*<div className={styles.username}>{rankList[1] ? rankList[1].userName : '--'}</div>*/}
            <div className={styles.amount_num}>{rankList[1] ? numberKMFormat(rankList[1].rankVal) : '--'} {tabRankIndex === 0 && t('common_person')} {tabRankIndex === 1 && 'USDT'} {tabRankIndex === 2 && MAIN_CURRENCY_COIN}</div>
          </div>

          <div className={`${styles.top_three_item} ${styles.top_three_item_one}`}>
            <div className={styles.top_header_wrap_1}>
              <div className={styles.header_img}><ImageWidget src={rankList[0] ? rankList[0].avatar : '/img/default_avatar.png'} /></div>
            </div>
            {/*<div className={styles.username1}>{rankList[0] ? rankList[0].userName : '--'}</div>*/}
            <div className={styles.amount_num}>{rankList[0] ? numberKMFormat(rankList[0].rankVal) : '--'} {tabRankIndex === 0 && t('common_person')} {tabRankIndex === 1 && 'USDT'} {tabRankIndex === 2 && MAIN_CURRENCY_COIN}</div>
          </div>

          <div className={styles.top_three_item}>
            <div className={styles.top_header_wrap_3}>
              <div className={styles.header_img}><ImageWidget src={rankList[2] ? rankList[2].avatar : '/img/default_avatar.png'} /></div>
            </div>
            {/*<div className={styles.username}>{rankList[2] ? rankList[2].userName : '--'}</div>*/}
            <div className={styles.amount_num}>{rankList[2] ? numberKMFormat(rankList[2].rankVal) : '--'} {tabRankIndex === 0 && t('common_person')} {tabRankIndex === 1 && 'USDT'} {tabRankIndex === 2 && MAIN_CURRENCY_COIN}</div>
          </div>
        </div>
      </div>

      <div className={styles.rank_box}>
        <div className={styles.rank_wrap}>
          {
            rankList.map((item, index) => (
              <div key={'rank-item-key-' + index} className={`${styles.rank_item_wrap}`}>
                <div className={styles.rank_item_left}>
                  <div className={styles.rank_num}>
                    {
                      index === 0 && (
                        <div className={styles.rank_one_icon}></div>
                      )
                    }
                    {
                      index === 1 && (
                        <div className={styles.rank_two_icon}></div>
                      )
                    }
                    {
                      index === 2 && (
                        <div className={styles.rank_three_icon}></div>
                      )
                    }
                    {
                      index > 2 && (
                        <div className={styles.rank_more_num}>{item.rank}</div>
                      )
                    }
                  </div>
                  <div className={styles.header_img}><ImageWidget src={item.avatar}/></div>
                  <div className={styles.rank_username}>{item.userName}</div>
                </div>
                <div className={styles.rank_item_right}>
                  <span className={styles.amount_num}>{numberKMFormat(item.rankVal)} {tabRankIndex === 0 && t('common_person')} {tabRankIndex === 1 && 'USDT'} {tabRankIndex === 2 && MAIN_CURRENCY_COIN}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className={styles.sized_box}></div>

      <div className={styles.my_rank_wrap}>
        <div className={styles.my_rank_num}>{myRankNum}</div>
        <div className={styles.header_img}><ImageWidget src={userInfoData?.avatar === '' ? './img/default_avatar.png' : userInfoData.avatar}/></div>
        <div className={styles.user_name_wrap}>{userInfoData?.nickName}</div>
        <div className={styles.rank_item_right}>
          {tabRankIndex === 0 && (
            <span className={styles.amount_num}>{numberMFormat(userInfoData?.referralCountA + userInfoData?.referralCountB)} {t('common_person')}</span>
          )}
          {tabRankIndex === 1 && (
            <span className={styles.amount_num}>{numberMFormat(formatPriceIfUsdt(1, userInfoData?.withdrawAmount))} USDT</span>
          )}
          {tabRankIndex === 2 && (
            <span className={styles.amount_num}>{numberMFormat(userInfoData?.usdn)} {MAIN_CURRENCY_COIN}</span>
          )}
        </div>
      </div>

      <Modal centered footer={null} closeIcon={false} open={prizeRuleVis} onCancel={() => setPrizeRuleVis(false)}>
        <div className={styles.modal_content}>
          <div className={styles.modal_title}>{t('prize_pool_rule_title')}</div>
          {
            activityState && (
              <>
                <div className={styles.hint_text_left}>{t('prize_pool_rule_text1', {num: formatTimestampToDHMSNumState(activityState?.endTime - activityState?.startTime).day + 1})}</div>
                <div className={styles.hint_text_left}>{t('prize_pool_rule_text2', {num: activityState?.minReferral})}</div>
              </>
            )
          }

          <div className={styles.hint_text_left}>{t('prize_pool_rule_text3')}</div>
          <div className={styles.hint_text_left}>{t('prize_pool_rule_text4')}</div>
          <div onClick={onActivityInvite} className={styles.determine_btn}>{t('function_invite')}</div>
        </div>
      </Modal>

      <Modal centered footer={null} closeIcon={false} open={ruleVis} onCancel={() => setRuleVis(false)}>
        <div className={styles.modal_content}>
          <div className={styles.modal_title}>{t('common_tips')}</div>
          <div className={styles.hint_text}>{t('function_tips_text')}</div>
          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_1st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(3000000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_2st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(2000000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_3st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(1000000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_4st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(500000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_11st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(300000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_21st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(200000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div className={styles.rule_item}>
            <span className={styles.rule_one}>{t('function_51st_place')}</span>
            <span className={styles.rule_two}>{t('function_receive')} </span>
            <span className={styles.rule_num}>{numberFormatToEnglish(100000, 0)} </span>
            <span className={styles.rule_two}>{MAIN_CURRENCY_COIN} </span>
          </div>

          <div onClick={() => setRuleVis(false)} className={styles.determine_btn}>{t('home_determine')}</div>
        </div>
      </Modal>
    </div>
  )
}

export default Function
