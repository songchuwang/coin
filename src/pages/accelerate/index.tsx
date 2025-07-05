import styles from "./index.module.scss"
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import ImageWidget from "@/components/ImageWidget";
import {message, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {useSelector} from "react-redux";
import {MiningInfoType} from "@/redux/reducers/user/miningInfo.ts";
import {
  LevelUpgradeReqType,
  LevelUpgradeType,
} from "@/types";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {
  resetMiningState, setAssetsState,
  setLevelUpgradeList,
  setLoadingModalVis,
  setMiningData,
  setServicePackageList,
  setUserInfoData
} from "@/redux/actions/home.ts";
import {
  APIAssetsInfo,
  APILevelUpgradeList, APILevelUpgradeSubmit,
  APIMiningInfo, APIUserInfo
} from "@/api";
import {LoadingOutlined} from "@ant-design/icons";
import {formatPriceIfUsdt, formatUnitByCurrency, textCopyToClipboard} from "@/utils/textUtils.ts";
import {numberKMFormat} from "@/utils/numFormat.ts";
import Vconsole from "vconsole";
import {getTelegramUserData} from "@/tools/telegram.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";


const Accelerate = () => {

  const {t, i18n}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()

  const location = useLocation();
  const { tabType } = location.state || {};

  const dispatch = useDispatchAction({ setServicePackageList, setLevelUpgradeList, setLoadingModalVis, setUserInfoData, setMiningData, resetMiningState, setAssetsState })

  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)
  // const referralCode: string = useSelector((state: any) => state.user.userInfo.referralCode)
  const miningData: MiningInfoType = useSelector((state: any) => state.user.miningInfo.miningData)
  // const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)

  const levelUpgradeList: Array<LevelUpgradeType> = useSelector((state: any) => state.home.pageState.levelUpgradeList)

  const navigate = useNavigate()

  const [tabIndex, setTabIndex] = useState(1)

  const [upgradeVis, setUpgradeVis] = useState(false)
  // const [serviceVis, setServiceVis] = useState(false)
  //
  // const [buyCount, setBuyCount] = useState(1)
  const [fetchLevelLoading, setFetchLevelLoading] = useState(false)


  // const [detailsLoading, setDetailsLoading] = useState(true)


  // const [serviceInfo, setServiceInfo] = useState<ServicePackageType>()
  const [levelBuyInfo, setLevelBuyInfo] = useState<LevelUpgradeType>()

  let clickNum = 0

  // const gotoLanguagePage = () => {
  //   navigate('/languagePage')
  // }

  const gotoUpdatePage = () => {
    navigate('/updateAccount')
  }

  // const buyActionSubClick = () => {
  //   if (buyCount < 2) return
  //   setBuyCount((prev) => prev - 1)
  // }
  //
  // const buyActionAddClick = () => {
  //   setBuyCount((prev) => prev + 1)
  // }

  const levelVisClick = (item: LevelUpgradeType) => {
    setUpgradeVis(true)
    // setDetailsLoading(true)
    setLevelBuyInfo(item)
  }

  // const buyServiceSubmit = () => {
  //   dispatch.setLoadingModalVis(true)
  //   const reqData: ServiceSubmitReqType = {
  //     id: serviceInfo.id,
  //     num: buyCount,
  //     price: serviceInfo.price
  //   }
  //   APIServiceBuySubmit(reqData).then(resp => {
  //     if (resp.data) {
  //       message.success(t('common_purchase_success'))
  //       setServiceVis(false)
  //       return APIMiningInfo()
  //     } else {
  //       message.error(resp.msg)
  //     }
  //   }).then(resp => {
  //     if (resp && resp.code === 0) {
  //       dispatch.setMiningData(resp.data)
  //       return APIUserInfo()
  //     }
  //   }).then(resp => {
  //     if (resp && resp.code === 0) {
  //       dispatch.setUserInfoData(resp.data)
  //       fetchServiceList()
  //       return APIAssetsInfo()
  //     }
  //   }).then(resp => {
  //     if (resp && resp.code === 0) {
  //       dispatch.setAssetsState(resp.data)
  //     }
  //   }).finally(() => {
  //     dispatch.setLoadingModalVis(false)
  //   })
  // }

  const buyLevelSubmit = () => {
    dispatch.setLoadingModalVis(true)
    const reqData: LevelUpgradeReqType = {
      level: levelBuyInfo.level
    }
    APILevelUpgradeSubmit(reqData).then(resp => {
      if (resp.data) {
        message.success(t('common_purchase_success'))
        setUpgradeVis(false)
        return APIMiningInfo()
      } else {
        message.error(resp.msg)
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setMiningData(resp.data)
        return APIUserInfo()
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setUserInfoData(resp.data)
        fetchLevelList()
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

  // const formatInviterName = (str: string) => {
  //   if (!str) {
  //     return '-'
  //   }
  //   if (str.length <= 6) {
  //     return '*'.repeat(str.length);
  //   }
  //
  //   // 获取前面的部分，保留原字符，后六位替换为 *
  //   const visiblePart = str.slice(0, -6);
  //   const maskedPart = '*'.repeat(6);
  //
  //   return visiblePart + maskedPart;
  // }

  const fetchLevelList = () => {
    setFetchLevelLoading(true)
    APILevelUpgradeList().then(resp => {
      if (resp.code === 0) {
        dispatch.setLevelUpgradeList(resp.data)
      }
    }).finally(() => {
      setFetchLevelLoading(false)
    })
  }

  const onClickConsole = () => {
    clickNum += 1
    if (clickNum === 5) {
      const userInfo = {
        userName: userInfoData.nickName,
        userId: userInfoData.userId,
        miniId: getTelegramUserData().id
      }
      textCopyToClipboard(JSON.stringify(userInfo))
      new Vconsole()
    }
  }

  const gotoNFTRecord = () => {
    navigate('/nodeRecord', {state: {tabType: 2}})
  }

  useEffect(() => {

    if (tabType === 2) {
      setTabIndex(1)
    }
    if (!levelUpgradeList.length) {
      fetchLevelList()
    }
    console.log(i18n)
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <div className={styles.header_left_wrap}>
          <div className={styles.coin_icon}></div>
          <span className={styles.gen_text}>{MAIN_CURRENCY_COIN}</span>
        </div>
        <div className={styles.header_right_wrap}>
          <div onClick={gotoNFTRecord} className={styles.record_btn}>
            <span>{t('common_record')}</span>
          </div>
          {/*<div onClick={gotoLanguagePage} className={styles.language_icon}></div>*/}
        </div>
      </div>

      <div className={styles.user_info_box}>

        <div onClick={onClickConsole} className={styles.head_img}><ImageWidget src={userInfoData?.avatar === '' ? './img/default_avatar.png' : userInfoData.avatar} /></div>
        <div className={styles.userInfo_wrap}>
          <div className={styles.username}>{userInfoData.nickName}</div>
          <div className={styles.uid_text}>UID：{userInfoData.userId}</div>
          {/*<div className={styles.uid_text}>{t('accelerate_invite_by', { name: formatInviterName(userInfoData.inviterName) })}</div>*/}
          <div className={styles.uid_text}>{t('accelerate_invite_by', { name: userInfoData.inviterName ?? '-' })}</div>
        </div>

        <div onClick={gotoUpdatePage} className={styles.setting_icon}></div>

      </div>

      <div className={styles.action_info_wrap}>
        <div className={styles.action_info_item}>
          <div className={styles.top_wrap}>
            <img className={styles.action_icon} src={'./img/accelerate/action_1_icon.png'} />
            <span className={styles.action_title}>{t('accelerate_level')}</span>
          </div>
          <div className={styles.value_text}>Lv {userInfoData.level}</div>
        </div>
        <div className={styles.action_info_item}>
          <div className={styles.top_wrap}>
            <img className={styles.action_icon} src={'./img/accelerate/action_2_icon.png'} />
            <span className={styles.action_title}>{t('accelerate_duration')}</span>
          </div>
          <div className={styles.value_text}>{miningData.period}H</div>
        </div>
        <div className={styles.action_info_item}>
          <div className={styles.top_wrap}>
            <img className={styles.action_icon} src={'./img/accelerate/action_3_icon.png'} />
            <span className={styles.action_title}>{t('accelerate_speed')}</span>
          </div>
          <div className={styles.value_wrap}>
            {/*<span className={styles.num_text}>{userInfoData.speed}</span>*/}
            <span className={styles.num_text}>{numberKMFormat(userInfoData.speed)}</span>
            <span className={styles.num_util}>{MAIN_CURRENCY_COIN}/H</span>
          </div>
        </div>
      </div>

      <div className={styles.upgrade_wrap}>
        <div className={styles.u_header}>
          <div className={styles.h_top_wrap}>
            <div onClick={() => setTabIndex(1)} className={`${styles.h_top_item} ${tabIndex === 1 && styles.h_top_item_active}`}>{t('accelerate_upgrade')}</div>
            {/*<div className={styles.h_top_item}></div>*/}
          </div>
          <div className={styles.h_bottom_wrap}>
            {/*<div style={{width: `${tabIndex * 50}%`}} className={styles.h_bottom_box}></div>*/}
            <div className={styles.h_bottom_line}>
              <div className={styles.h_bottom_line_line}></div>
            </div>
          </div>
        </div>
        {/*<div style={{transform: ` translateX(-${tabIndex * 50}%)`}} className={styles.u_content_wrap}>*/}
        <div className={styles.u_content_wrap}>
          <div className={styles.u_content_item}>
            {/*<div className={styles.u_header_wrap}>*/}
            {/*  <div className={styles.u_header_item}>{t('accelerate_level')}</div>*/}
            {/*  <div className={styles.u_header_item}>{t('accelerate_mining_speed')}</div>*/}
            {/*  <div className={styles.u_header_item}>{t('accelerate_pay_coins')}</div>*/}
            {/*  <div className={styles.u_header_item}>{t('accelerate_duration')}</div>*/}
            {/*</div>*/}
            {
              tabIndex === 1 && levelUpgradeList.map((item) => item.level > userInfoData.level && (
                <div key={'level-new-key-' + item.level} className={styles.service_item}>
                  <div className={styles.u_c_i_top}>
                    <div className={styles.svip_img}>
                      <ImageWidget src={item?.icon ?? ''}/>
                    </div>
                    <div className={styles.top_right_wrap}>
                      <div className={`${styles.title_wrap} ${styles.upgrade_title_wrap}`}>
                        <div className={styles.level_icon}></div>
                        <span className={`${styles.title_text} ${styles.upgrade_text}`}>{t('accelerate_level_num', {num: item.level})}</span>
                      </div>
                      <div className={`${styles.hint_text_wrap} ${styles.hint_text_wrap_upgrade}`}>
                        <span className={`${styles.hint_label} ${styles.hint_label_upgrade}`}>{t('accelerate_speed')}</span>
                        <span className={`${styles.hint_value} ${styles.hint_value_upgrade}`}>{formatPriceIfUsdt(2, item.speed)}{MAIN_CURRENCY_COIN}/H</span>
                      </div>
                      <div className={`${styles.hint_text_wrap} ${styles.hint_text_wrap_upgrade}`}>
                        <span className={`${styles.hint_label} ${styles.hint_label_upgrade}`}>{t('accelerate_pay_coins')}</span>
                        <span className={`${styles.hint_value} ${styles.hint_value_upgrade}`}>{formatPriceIfUsdt(item.priceCurrency, item.price)} {formatUnitByCurrency(item.priceCurrency)}</span>
                      </div>
                      {/*<div className={styles.hint_text_wrap}>*/}
                      {/*  <span className={styles.hint_label}>{t('invite_invite')}</span>*/}
                      {/*  <span className={styles.hint_value}>{1} {t('common_person')}</span>*/}
                      {/*</div>*/}
                      <div className={`${styles.hint_text_wrap} ${styles.hint_text_wrap_upgrade}`}>
                        <span className={`${styles.hint_label} ${styles.hint_label_upgrade}`}>{t('accelerate_duration')}</span>
                        <span className={`${styles.hint_value} ${styles.hint_value_upgrade}`}>{item.period}H</span>
                      </div>
                    </div>
                  </div>
                  <div style={{backgroundColor: '#23D09A'}} onClick={() => levelVisClick(item)} className={styles.u_c_buy_btn}>
                    <span>{t('common_pay')}</span>
                  </div>
                </div>
              ))
            }
            {/*{*/}
            {/*  tabIndex === 1 && levelUpgradeList.map((item) => item.level > userInfoData.level && (*/}
            {/*    <div onClick={() => levelVisClick(item)} key={'level-key-'+ item.level} className={styles.content_row_wrap}>*/}
            {/*      <div className={styles.content_col_wrap}>{t('accelerate_level_num', {num: item.level})}</div>*/}
            {/*      <div className={styles.content_col_wrap}>{formatPriceIfUsdt(2, item.speed)}{MAIN_CURRENCY_COIN}/H</div>*/}
            {/*      <div className={styles.content_col_wrap}>{formatPriceIfUsdt(item.priceCurrency, item.price)} {formatUnitByCurrency(item.priceCurrency)}</div>*/}
            {/*      <div className={styles.content_col_wrap}>{item.period}H</div>*/}
            {/*      <div className={styles.left_icon}></div>*/}
            {/*    </div>*/}
            {/*  ))*/}
            {/*}*/}
            {
              userInfoData?.isMax && (
                <div className={styles.is_max_text}>{t('accelerate_is_max_level')}</div>
              )
            }

            {
              fetchLevelLoading && (
                <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
              )
            }
          </div>
        </div>
      </div>

      <div className={styles.sized_box}></div>

      {/*<Modal centered footer={null} closeIcon={false} open={serviceVis} onCancel={() => setServiceVis(false)}>*/}
      {/*  <div className={styles.upgrade_modal}>*/}
      {/*    {*/}
      {/*      detailsLoading ? (*/}
      {/*        <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>*/}
      {/*      ) : (*/}
      {/*        <>*/}
      {/*          <div className={styles.img_box}><ImageWidget src={serviceInfo.imageUrl}/></div>*/}
      {/*          <span className={styles.m_title}>{t('accelerate_mining')}</span>*/}
      {/*          <span className={styles.m_hint_text}>{t('accelerate_mining')}</span>*/}

      {/*          <div className={styles.m_content_wrap}>*/}
      {/*            <div className={styles.label_wrap}>*/}
      {/*              <div className={styles.label_text}>{t('accelerate_daily_output')}</div>*/}
      {/*              <div className={styles.value_text}>{formatPriceIfUsdt(2, serviceInfo.speed)} {formatUnitByCurrency(serviceInfo.profitCurrency)}/{t('common_day')}</div>*/}
      {/*            </div>*/}
      {/*            <div className={styles.label_wrap}>*/}
      {/*              <div className={styles.label_text}>{t('accelerate_price')}</div>*/}
      {/*              <div className={styles.value_text}>{formatPriceIfUsdt(serviceInfo.priceCurrency, serviceInfo.price)} {formatUnitByCurrency(serviceInfo.priceCurrency)}</div>*/}
      {/*            </div>*/}
      {/*            <div className={styles.label_wrap}>*/}
      {/*              <div className={styles.label_text}>{t('accelerate_validity')}</div>*/}
      {/*              <div className={styles.value_text}>{formatHoursToDay(serviceInfo.validity)} {t('common_day')}</div>*/}
      {/*            </div>*/}
      {/*            <div className={styles.label_wrap}>*/}
      {/*              <div className={styles.label_text}>{t('accelerate_quantity')}</div>*/}
      {/*              <div className={styles.count_wrap}>*/}
      {/*                <div onClick={buyActionSubClick} className={styles.action_btn}><img src={'./img/accelerate/action_sub_icon.png'} /></div>*/}
      {/*                <div className={styles.num_wrap}>{buyCount}</div>*/}
      {/*                <div onClick={buyActionAddClick} className={styles.action_btn}><img src={'./img/accelerate/action_plus_icon.png'} /></div>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <div onClick={buyServiceSubmit} className={styles.m_buy_btn}>*/}
      {/*            <span>{t('accelerate_buy')}</span>*/}
      {/*          </div>*/}

      {/*          <div className={styles.hint_tips_wrap}>*/}
      {/*            <div>{t('common_tips')}</div>*/}
      {/*            <div>{t('service_hint_text1', {amount: serviceInfo.type === 2 ? serviceInfo.maxCount : '-'})}</div>*/}
      {/*            <div>{t('service_hint_text2', {amount: serviceInfo.profit / 100})}</div>*/}
      {/*            <div>{t('service_hint_text3', {days: formatHoursToDay(serviceInfo.validity), rota: serviceInfo.iconText})}</div>*/}
      {/*          </div>*/}
      {/*        </>*/}
      {/*      )*/}
      {/*    }*/}

      {/*  </div>*/}

      {/*</Modal>*/}


      <Modal centered footer={null} closeIcon={false} open={upgradeVis} onCancel={() => setUpgradeVis(false)}>
        <div className={styles.upgrade_modal}>
          {/*<div className={styles.img_box}><ImageWidget src={''}/></div>*/}
          {
            levelBuyInfo && (
              <>
                <span className={styles.m_title}>Level upgrade</span>
                <span className={styles.m_hint_text}>{t('accelerate_level_num', {num: levelBuyInfo.level})}</span>

                <div className={styles.m_content_wrap}>
                  <div className={styles.label_wrap}>
                    <div className={styles.label_text}>{t('accelerate_daily_output')}</div>
                    <div className={styles.value_text}>{formatPriceIfUsdt(2, levelBuyInfo.speed)}{MAIN_CURRENCY_COIN}/H</div>
                  </div>
                  <div className={styles.label_wrap}>
                    <div className={styles.label_text}>{t('accelerate_price')}</div>
                    <div className={styles.value_text}>{formatPriceIfUsdt(levelBuyInfo.priceCurrency, levelBuyInfo.price)} {formatUnitByCurrency(levelBuyInfo.priceCurrency)}</div>
                  </div>
                </div>
                <div onClick={buyLevelSubmit} className={styles.m_buy_btn}>
                  <span>{t('accelerate_buy')}</span>
                </div>
              </>
            )
          }
        </div>
      </Modal>

    </div>
  )
}

export default Accelerate
