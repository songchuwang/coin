import styles from "./index.module.scss"
import {InputNumber, message, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Popup} from "antd-mobile";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {CheckOutlined, LoadingOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {
  ServicePackageType, ServiceSubmitReqType,
  UserWalletAddressReqType,
  UserWalletAddressType,
  WithdrawInfoType, WithdrawLimitInfoType,
  WithdrawSubmitReqType
} from "@/types";
import {
  APIAssetsInfo,
  APIGoogleAuthCode, APIMiningInfo, APIStakingOrder,
  APISubmitWithdraw, APIUserInfo,
  APIUserWalletAddressList,
  APIWithdrawInfo, APIWithdrawInviteLink,
  APIWithdrawLimitInfo, APIWithdrawNFTBuy
} from "@/api";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {useSelector} from "react-redux";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {
  resetMiningState,
  setAssetsState,
  setLevelUpgradeList,
  setLoadingModalVis, setMiningData,
  setServicePackageList,
  setUserInfoData
} from "@/redux/actions/home.ts";
import {numberFormatToEnglish} from "@/utils/numFormat.ts";
import ImageWidget from "@/components/ImageWidget";
import {formatPriceIfUsdt, formatUnitByCurrency, textCopyToClipboard} from "@/utils/textUtils.ts";
import {formatHoursToDay} from "@/utils/timeFormat.ts";
import {jumpHelpLink} from "@/utils/jumpLinkUtils.ts";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const Withdraw = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const navigate = useNavigate()

  const dispatch = useDispatchAction({ setServicePackageList, setLevelUpgradeList, setLoadingModalVis, setUserInfoData, setMiningData, resetMiningState, setAssetsState })

  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)
  // const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)

  const supportName: string = useSelector((state: any) => state.app.appSetting.supportName)

  const [selectAddressVis, setSelectAddressVis] = useState(false)

  const listLoadingRef = useRef(false)

  const [usdtFreezeNum, setUSDTFreezeNum] = useState(0)

  const [selectedAddress, setSelectedAddress] = useState<UserWalletAddressType>({
    id: -1
  })

  const [loadingStatus, setLoadingStatus] = useState(0)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })
  const [addressList, setAddressList] = useState<Array<UserWalletAddressType>>([])

  const [usdtAmount, setUSDTAmount] = useState(null)

  const [isAuthed, setIsAuthed] = useState(true)

  const [withdrawInfo, setWithdrawInfo] = useState<WithdrawInfoType>({
    enabled: false,
    withdrawFee: 0
  })

  const [serviceVis, setServiceVis] = useState(false)

  const [instructionVis, setInstructionVis] = useState(false)

  const [detailsLoading, setDetailsLoading] = useState(true)

  const [withdrawBuyRuleVis, setWithdrawBuyRuleVis] = useState(false)

  const [withdrawMiniVis, setWithdrawMiniVis] = useState(false)

  const [isHide, setIsHide] = useState(false)

  const [inviteUrl, setInviteUrl] = useState('')

  const [serviceInfo, setServiceInfo] = useState<ServicePackageType>(null)

  const [withdrawLimitInfo, setWithdrawLimitInfo] = useState<WithdrawLimitInfoType>(null)

  const buyServiceSubmit = () => {
    dispatch.setLoadingModalVis(true)
    const reqData: ServiceSubmitReqType = {
      id: serviceInfo.id,
      num: 1,
      price: serviceInfo.price
    }
    APIWithdrawNFTBuy(reqData).then(resp => {
      if (resp.data) {
        message.success(t('common_purchase_success'))
        setServiceVis(false)
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
        // fetchServiceList()
        fetchWithdrawLimitInfo()
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

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: UserWalletAddressReqType = {
      userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    APIUserWalletAddressList(params).then(resp => {
      if (resp.code === 0) {
        if (selectedAddress.id === -1 && resp.data.list.length > 0) {
          setSelectedAddress(resp.data.list[0])
        }
        if (resp.data.list.length <= 0) {
          setLoadingStatus(2)
          return
        }
        let nowList = addressList
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data.list)
        setAddressList(nowList)
        if ((params.pageNo * params.pageSize) >= resp.data.list.length) {
          setLoadingStatus(2)
        }
        listParamsRef.current.current += 1
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      listLoadingRef.current = false
    })
  }

  const fetchWithdrawLimitInfo = () => {
    // dispatch.setLoadingModalVis(true)
    APIWithdrawLimitInfo().then(resp => {
      if (resp.code === 0) {
        setWithdrawLimitInfo(resp.data)
        setServiceInfo(resp.data.nft)
        setDetailsLoading(false)
      }
    }).finally(() => {
      // dispatch.setLoadingModalVis(false)
    })
  }

  const initLoading = () => {
    const ob = new IntersectionObserver(() => {
      if (!listLoadingRef.current) {
        // console.log('执行了')
        fetchData()
      }
    }, {
      rootMargin: '0px',
      threshold: 0.5
    })
    const loadingMore = document.getElementById("moreLoading")
    if (loadingMore) {
      ob.observe(loadingMore)
    }
  }

  const gotoRecord = () => {
    navigate('/withdrawRecord')
  }

  const onClickSelectAddress = () => {
    setSelectAddressVis(true)
    setTimeout(() => {
      initLoading()
    }, 500)
  }

  const onAddressClick = (item: UserWalletAddressType) => {
    setSelectedAddress(item)
    setTimeout(() => {
      setSelectAddressVis(false)
    }, 200)
  }

  const onSubmitWithdraw = () => {
    if (!isAuthed) {
      navigate('/securitySettingPage')
      return;
    }
    if (withdrawLimitInfo.limitType === 2) {
      return;
    }
    // if (withdrawLimitInfo.limitType === 1) {
    //   setServiceVis(true)
    //   return;
    // }
    if (!selectedAddress.address) {
      setSelectAddressVis(true)
      message.warning("Please select address")
      return;
    }
    if (usdtAmount <= withdrawInfo.withdrawFee) {
      message.warning(t('withdraw_minimum_USDT', {num: withdrawInfo.withdrawFee}))
      return
    }
    // if (usdtAmount > (assetsState.usdt / 1000000)) {
    if (usdtAmount > usdtFreezeNum) {
      message.warning(t('withdraw_insufficient_balance'))
      return;
    }
    dispatch.setLoadingModalVis(true)
    const reqParams: WithdrawSubmitReqType = {
      nonce: new Date().getTime().toString(),
      timestamp: new Date().getTime(),
      address: selectedAddress.address,
      amount: Math.round(usdtAmount * 1000000),
      userId: userInfoData.userId,
      type: 1
    }
    APISubmitWithdraw(reqParams).then(resp => {
      if (resp.code === 0 && resp.data) {
        message.success(t('common_operation_successful'))
        return APIAssetsInfo()
      } else if (resp.code === 11023) {
        setWithdrawMiniVis(true)
        setTimeout(() => {
          setIsHide(!isHide)
        }, 1000)
      } else {
        message.error(resp.msg)
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setAssetsState(resp.data)
        fetchWithdrawLimitInfo()
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const fetchWithdrawInfo = () => {
    APIWithdrawInfo().then(resp => {
      if (resp.code === 0) {
        setWithdrawInfo({
          ...resp.data,
          withdrawFee: resp.data.withdrawFee / (10 ** 6)
        })
      }
    })
  }

  const fetchGoogleAuth = () => {
    APIGoogleAuthCode().then(resp => {
      if (resp.code === 0) {
        setIsAuthed(resp.data.hasAuthed)
      }
    })
  }

  const onBuyModalInfoClick = () => {
    setWithdrawBuyRuleVis(true)
  }

  const fetchInviteLink = () => {
    APIWithdrawInviteLink().then(resp => {
      if (resp.code === 0) {
        setInviteUrl(resp.data)
      }
    })
  }

  const changeHide = () => {
    setTimeout(() => {
      console.log("正在执行")
      if (withdrawMiniVis) {
        setIsHide(!isHide)
      }
    }, 3000)
  }

  const onInviteClick = () => {
    const shareUrl = `https://t.me/share/url?url=${inviteUrl}&text=${encodeURIComponent(`Join ${MAIN_CURRENCY_COIN} now, easily obtain ${MAIN_CURRENCY_COIN} tokens and start your asset appreciation journey!`)}`
    const webApp = getTelegramWebApp()
    webApp.openTelegramLink(shareUrl)
  }

  const fetchStakingPage = () => {
    APIStakingOrder({pageNo: 1, pageSize: 10000000}).then(resp => {
      if (resp.code === 0) {
        // let sumGENAmount = 0
        let sumUSDTAmount = 0
        for (const item of resp.data.list) {
          // if (item.status === 3 && item.assetType === 2) {
          //   sumGENAmount += (item.amount / 100)
          // }
          if (item.status === 3 && item.assetType === 1) {
            sumUSDTAmount += (item.amount / (10 ** 6))
          }
        }
        setUSDTFreezeNum(sumUSDTAmount)
      }
    })
  }

  useLayoutEffect(() => {
    fetchStakingPage()
  }, []);

  useEffect(() => {
    // initLoading()
    fetchData()
    fetchWithdrawInfo()
    fetchGoogleAuth()
    fetchWithdrawLimitInfo()
    fetchInviteLink()
  }, []);

  useEffect(() => {
    changeHide()
  }, [isHide]);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left_wrap}>
          <div className={styles.coin_icon}></div>
          <span className={styles.gen_text}>{MAIN_CURRENCY_COIN}</span>
        </div>
        <div className={styles.header_right_wrap}>
          <div onClick={gotoRecord} className={styles.record_btn}>
            <span>{t('withdraw_record')}</span>
          </div>
        </div>
      </div>

      {
        !isAuthed && (
          <div className={styles.security_wrap}>
            <div className={styles.auth_icon}></div>
            <div onClick={() => navigate('/securitySettingPage')} className={styles.add_text}>{t('withdraw_security_settings')}</div>
          </div>
        )
      }


      <div className={styles.balance_box}>
        <div className={styles.box_title}>{t('withdraw_can_propose_balance')}</div>
        <div className={styles.balance_wrap}>
          {/*<span className={styles.balance_num}>{numberFormatToEnglish(assetsState?.usdt / 1000000, 6)}</span>*/}
          <span className={styles.balance_num}>{numberFormatToEnglish(usdtFreezeNum, 6)}</span>
          <span className={styles.balance_util}>USDT</span>
        </div>
        <div onClick={onClickSelectAddress} className={styles.wallet_wrap}>
          <span>{selectedAddress.id !== -1 ? selectedAddress.address : 'Click Select Address'}</span>
        </div>
      </div>

      <div className={styles.action_box}>
        <div className={styles.input_box}>
          <InputNumber placeholder={'0'} value={usdtAmount} onChange={(e) => setUSDTAmount(e)} min={0.0001} className={styles.input_wrap} addonBefore={<div className={styles.input_addon}>USDT</div>} />
        </div>
        <div className={styles.info_wrap}>
          <div className={styles.label_text}>{t('withdraw_amount_received')}</div>
          <div className={styles.value_text}>{(!usdtAmount || (usdtAmount - withdrawInfo.withdrawFee) < 0) ? 0 : numberFormatToEnglish(usdtAmount - withdrawInfo.withdrawFee, 5)}USDT</div>
        </div>
        <div className={styles.info_wrap}>
          <div className={styles.label_text}>{t('withdraw_service_charge')}</div>
          <div className={styles.value_text}>{withdrawInfo.withdrawFee}USDT</div>
        </div>

        <div onClick={onSubmitWithdraw} className={styles.withdraw_btn}>
          <span>{t('withdraw_withdraw')}</span>
        </div>

        <div onClick={() => setInstructionVis(true)} className={styles.withdraw_i_btn}>
          <span>{t('withdraw_instructions')}</span>
        </div>
      </div>

      <div className={styles.hint_text_wrap}>
        <div className={styles.hint_text}>{t('common_tips')}</div>
        <div className={styles.hint_text}>{t('exchange_hint_text1')}</div>
        <div className={styles.hint_text}>{t('exchange_hint_text2')}</div>
        <div className={styles.hint_text}>{t('exchange_hint_text3')}</div>
      </div>

      <div className={styles.bottom_wrap}>
        {
          userInfoData.rechargeAmount > 0 && (
            <div onClick={() => jumpHelpLink(supportName)} className={styles.help_box_wrap}>
              <div className={styles.help_icon}></div>
              <div className={styles.help_text}>Get Help：@{supportName}</div>
            </div>
          )
        }

      </div>

      <Popup visible={selectAddressVis} onMaskClick={() => setSelectAddressVis(false)} onClose={() => setSelectAddressVis(false)} className={styles.popup_sty}>
        <div className={styles.popup_content}>
          <div className={styles.popup_title}>{t('withdraw_select_address')}</div>
          <div className={styles.language_list}>
            <div onClick={() => navigate('/collectionPage')} className={styles.add_btn_wrap}>{t('withdraw_add_address')}</div>
            {
              addressList.map((item) => (
                <div onClick={() => onAddressClick(item)} key={'address-key-' + item.id} className={`${styles.address_item} ${selectedAddress.id === item.id && styles.address_item_active}`}>
                  <span>{item.address}</span>
                  <div className={styles.check_icon}><CheckOutlined /></div>
                </div>
              ))
            }

            {
              loadingStatus !== 2 && (
                <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
              )
            }
          </div>
        </div>
      </Popup>

      <Modal centered footer={null} closeIcon={false} open={serviceVis} onCancel={() => setServiceVis(false)}>
        <div className={styles.upgrade_modal}>
          {
            (detailsLoading || !serviceInfo) ? (
              <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
            ) : (
              <>
                <div className={styles.img_box}><ImageWidget src={serviceInfo?.imageUrl ?? ''}/></div>
                {/*<span className={styles.m_title}>{t('accelerate_mining')}</span>*/}
                <span className={styles.m_hint_text}>{t('withdraw_nft_hint_text')}</span>

                <div className={styles.m_content_wrap}>
                  <div className={styles.label_wrap}>
                    <div className={styles.label_text}>{t('accelerate_daily_output')}</div>
                    <div className={styles.value_text}>{formatPriceIfUsdt(2, serviceInfo.speed)} {formatUnitByCurrency(serviceInfo.profitCurrency)}/{t('common_day')}</div>
                  </div>
                  <div className={styles.label_wrap}>
                    <div className={styles.label_text}>{t('accelerate_price')}</div>
                    <div className={styles.value_text}>{formatPriceIfUsdt(serviceInfo.priceCurrency, serviceInfo.price)} {formatUnitByCurrency(serviceInfo.priceCurrency)}</div>
                  </div>
                  <div className={styles.label_wrap}>
                    <div className={styles.label_text}>{t('accelerate_validity')}</div>
                    <div className={styles.value_text}>{formatHoursToDay(serviceInfo.validity)} {t('common_day')}</div>
                  </div>
                  <div className={styles.label_wrap}>
                    <div className={styles.label_text}>{t('nft_max_count_label')}</div>
                    <div className={styles.value_text}>{t('nft_max_count_value', {count: serviceInfo.maxCount})}</div>
                  </div>
                  {/*<div className={styles.label_wrap}>*/}
                  {/*  <div className={styles.label_text}>{t('accelerate_quantity')}</div>*/}
                  {/*  <div className={styles.count_wrap}>*/}
                  {/*    <div onClick={buyActionSubClick} className={styles.action_btn}><img src={'./img/accelerate/action_sub_icon.png'} /></div>*/}
                  {/*    <div className={styles.num_wrap}>{buyCount}</div>*/}
                  {/*    <div onClick={buyActionAddClick} className={styles.action_btn}><img src={'./img/accelerate/action_plus_icon.png'} /></div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
                <div className={styles.hint_tips_wrap}>
                  <div>{t('withdraw_nft_tip_text', {currency: MAIN_CURRENCY_COIN})}</div>
                  {/*  <div>{t('service_hint_text1', {amount: serviceInfo.type === 2 ? serviceInfo.maxCount : '-'})}</div>*/}
                  {/*  <div>{t('service_hint_text2', {amount: serviceInfo.profit / 100})}</div>*/}
                  {/*  <div>{t('service_hint_text3', {days: formatHoursToDay(serviceInfo.validity), rota: serviceInfo.iconText})}</div>*/}
                </div>
                <div onClick={buyServiceSubmit} className={styles.m_buy_btn}>
                  <span>{t('accelerate_buy')}</span>
                </div>


                <div onClick={onBuyModalInfoClick} className={styles.info_icon}><QuestionCircleOutlined /></div>
              </>
            )
          }

        </div>

      </Modal>

      <Modal centered footer={null} closeIcon={false} open={withdrawBuyRuleVis} onCancel={() => setWithdrawBuyRuleVis(false)}>
        <div className={styles.modal_content}>

          <div className={styles.title_wrap}>{t('common_tips')}</div>

          <div className={styles.content_text}>{t('withdraw_nft_help_text', {currency: MAIN_CURRENCY_COIN})}</div>

          <div onClick={() => setWithdrawBuyRuleVis(false)} className={styles.determine_btn}>{t('home_determine')}</div>
        </div>
      </Modal>
      <Modal centered footer={null} closeIcon={false} open={instructionVis} onCancel={() => setInstructionVis(false)}>
        <div className={styles.modal_content}>

          <div className={styles.title_wrap}>{t('withdraw_i_dialog_title', {currency: MAIN_CURRENCY_COIN})}</div>

          <div className={styles.content_text}>{t('withdraw_i_dialog_content_1', {amount: 0.01})}</div>
          <div className={styles.content_text}>{t('withdraw_i_dialog_content_2')}</div>
          <div className={styles.content_text}>{t('withdraw_i_dialog_content_3')}</div>

          <div onClick={() => setInstructionVis(false)} className={styles.determine_btn}>{t('home_determine')}</div>
        </div>
      </Modal>
      <Modal centered footer={null} closeIcon={false} open={withdrawMiniVis} onCancel={() => setWithdrawMiniVis(false)}>
        {
          withdrawMiniVis && (
            <div className={styles.modal_card_wrap}>
              {/*<div className={styles.c_c_title_1}>{t('prize_pool_title1')}</div>*/}
              {/*<div className={styles.c_c_title_1} dangerouslySetInnerHTML={{__html: t('prize_pool_title_text', {amount: `${formatPriceIfUsdt(1, activityState?.totalPrize ?? 0)}U`})}}></div>*/}
              {/*<PrizePoolTimeWidget/>*/}
              <div className={styles.c_c_title}>{t('withdraw_mini_dialog_title')}</div>
              <div className={styles.c_c_sub_title}>{t('withdraw_mini_dialog_subtitle')}</div>
              <div className={styles.c_c_box_wrap}>

                <div className={styles.c_c_box_1}>
                  <div className={styles.c_c_box_2}>
                    <div className={styles.c_c_box_2}></div>
                  </div>
                </div>

                <div className={`${styles.avatar_box} ${styles.avatar_1}`}>
                  <div style={{width: isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar1.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_2}`}>
                  <div style={{width: !isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar2.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_3}`}>
                  <div style={{width: isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar3.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_4}`}>
                  <div style={{width: !isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar4.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_5}`}>
                  <div style={{width: isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar5.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_6}`}>
                  <div style={{width: !isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar6.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_7}`}>
                  <div style={{width: !isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar7.png'} /></div>
                </div>
                <div className={`${styles.avatar_box} ${styles.avatar_8}`}>
                  <div style={{width: isHide ? '100%' : '0'}} className={styles.avatar_box_d}><img src={'/img/prizePool/avatar8.png'} /></div>
                </div>

              </div>

              <div className={styles.invite_url_wrap}>
                <div className={styles.invite_url_text}>{inviteUrl}</div>
                <div onClick={() => textCopyToClipboard(inviteUrl)} className={styles.copy_btn}>{t('common_copy')}</div>
              </div>

              <div className={styles.tips_text_wrap}>{t('common_tips')}:{t('prize_pool_tips_text')}</div>

              <div onClick={onInviteClick} className={styles.invite_btn}>{t('common_invite_a_friend')}</div>

              {/*<div onClick={() => setPrizeRuleVis(true)} className={styles.info_icon}></div>*/}
            </div>
          )
        }
      </Modal>

    </div>
  )

}

export default Withdraw
