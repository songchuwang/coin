import styles from "./index.module.scss"
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setAssetsState, setFreezeBalance} from "@/redux/actions/home.ts";
import {AssetsStateType, FreezeBalanceStateType} from "@/types";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {APIAssetsInfo, APIStakingOrder} from "@/api";
import {Modal, Skeleton} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {numberMFormat} from "@/utils/numFormat.ts";
import {jumpHelpLink} from "@/utils/jumpLinkUtils.ts";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const Minister = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const dispatch = useDispatchAction({ setAssetsState, setFreezeBalance })

  const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)
  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)
  const rateGENToUSDT: number = useSelector((state: any) => state.user.userInfo.rateGENToUSDT)
  const freezeBalanceState: FreezeBalanceStateType = useSelector((state: any) => state.user.userInfo.freezeBalanceState)

  const supportName: string = useSelector((state: any) => state.app.appSetting.supportName)

  const [withdrawOpen, setWithdrawOpen] = useState(false)

  const navigate = useNavigate()

  const [stateLoading, setStateLoading] = useState(true)

  const gotoCoinBalance = (id: number) => {
    // if (id === 2) {
    //   message.info(t('upgrade_text'))
    //   return
    // }
    navigate(`/coinBalance/${id}`)
  }

  const gotoRecharge = () => {
    // message.info(t('upgrade_text'))
    navigate('/recharge')
  }

  const gotoWithdraw = () => {
    // message.info(t('upgrade_text'))
    navigate('/withdraw')
    // APIWithdrawInfo().then(resp => {
    //   if (resp.data.enabled) {
    //     navigate('/withdraw')
    //   } else {
    //     setWithdrawOpen(true)
    //   }
    // })

  }

  const gotoLanguagePage = () => {
    navigate('/languagePage')
  }

  const gotoBillPage = () => {
    // message.info(t('upgrade_text'))
    navigate('/billPage')
  }

  // const gotoPledge = () => {
  //   // message.info(t('upgrade_text'))
  //   // navigate('/exchangePage')
  //   navigate('/teamPage')
  // }

  const gotoExange = () => {
    navigate('/exchangePage')
  }

  const gotoNodeApply = () => {
    // message.info(t('upgrade_text'))
    // navigate('/nodeApplyPage')
    navigate('/collectionPage')
  }

  const gotoNode = () => {
    // message.info(t('upgrade_text'))
    navigate('/nodeList')
  }

  const fetchData = () => {
    if (assetsState) {
      setStateLoading(false)
      return
    }
    setStateLoading(true)
    APIAssetsInfo().then(resp => {
      if (resp.code === 0) {
        dispatch.setAssetsState(resp.data)
        setStateLoading(false)
      }
    })
  }

  const fetchStakingPage = () => {

    APIStakingOrder({pageNo: 1, pageSize: 10000000}).then(resp => {
      if (resp.code === 0) {
        let sumGENAmount = 0
        let sumUSDTAmount = 0
        for (const item of resp.data.list) {
          if (item.status === 3 && item.assetType === 2) {
            sumGENAmount += (item.amount / 100)
          }
          if (item.status === 3 && item.assetType === 1) {
            sumUSDTAmount += (item.amount / (10 ** 6))
          }
        }
        dispatch.setFreezeBalance(({
          usdn: sumGENAmount,
          usdt: sumUSDTAmount
        }) as FreezeBalanceStateType)
      }
    })
  }

  useEffect(() => {
    fetchStakingPage()
    fetchData()
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left_wrap}>
          <span className={styles.wallet_text}>{t('wallet_wallet')}</span>
        </div>
        {/* <div className={styles.header_right_wrap}>
          <div onClick={gotoLanguagePage} className={styles.language_icon}></div>
        </div> */}
      </div>

      <div className={styles.gen_num_wrap}>
        <div className={styles.gen_box}>
          <div className={styles.coin_icon}></div>
          {
            stateLoading ? (
              <div className={styles.skeleton_box}><Skeleton.Button style={{width: '100%', height: '100%'}} block={true} active /></div>
            ) : (
              <span className={styles.gen_balance_num}>{numberMFormat(assetsState.usdn)}</span>
            )
          }
          <span className={styles.gen_util}>{MAIN_CURRENCY_COIN}</span>
        </div>
        <span className={styles.usdt_num}>={stateLoading ? '-' : numberMFormat(rateGENToUSDT * assetsState.usdn)}USDT</span>
      </div>

      <div className={styles.action_wrap}>
        <div onClick={() => navigate('/introductionPage')} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/platform_ind_icon.png'} />
          <span className={styles.action_name}>{t('function_platform_introduction')}</span>
        </div>
        <div onClick={() => navigate('/devRouterPage')} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/dev_route_icon.png'} />
          <span className={styles.action_name}>{t('function_development_route')}</span>
        </div>
        <div onClick={() => navigate('/tokenAllocationPage')} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/white_paper_icon.png'} />
          <span className={styles.action_name}>{t('function_white_paper')}</span>
        </div>
        <div onClick={gotoBillPage} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/bill_icon.png'} />
          <span className={styles.action_name}>{t('wallet_bill')}</span>
        </div>
        <div onClick={gotoRecharge} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/recharge_icon.png'} />
          <span className={styles.action_name}>{t('wallet_recharge')}</span>
        </div>
        <div onClick={gotoWithdraw} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/propose_icon.png'} />
          <span className={styles.action_name}>{t('wallet_propose')}</span>
        </div>
        {/*<div onClick={gotoPledge} className={styles.action_item}>*/}
        {/*  <img className={styles.action_icon} src={'./img/minister/pledge_icon.png'} />*/}
        {/*  <span className={styles.action_name}>{t('earn_earn')}</span>*/}
        {/*</div>*/}
        <div onClick={gotoNode} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/node_list_icon.png'} />
          <span className={styles.action_name}>{t('me_node')}</span>
        </div>
        <div onClick={gotoNodeApply} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/node_icon.png'} />
          <span className={styles.action_name}>{t('collection_address')}</span>
        </div>
        <div onClick={gotoExange} className={styles.action_item}>
          <img className={styles.action_icon} src={'./img/minister/usdnusdt.png'} />
          <span className={styles.action_name}>{t('function_USDNUSDT', {currency: MAIN_CURRENCY_COIN})}</span>
        </div>
      </div>

      <div className={styles.line_wrap}></div>

      <div className={styles.coin_list_wrap}>
        {
          !stateLoading && (
            <>
              <div onClick={() => gotoCoinBalance(1)} className={styles.coin_item_wrap}>
                <div className={styles.left_wrap}>
                  <img className={styles.coin_icon} src={'./img/coin_icon.png'} />
                  <span className={styles.coin_name}>{MAIN_CURRENCY_COIN}</span>
                </div>
                <div className={styles.right_wrap}>
                  <span className={styles.num_text}>{numberMFormat(assetsState.usdn + freezeBalanceState.usdn)}</span>
                  <div className={styles.right_icon}></div>
                </div>
              </div>
              {/*<div onClick={() => gotoCoinBalance(3)} className={styles.coin_item_wrap}>*/}
              {/*  <div className={styles.left_wrap}>*/}
              {/*    <img className={styles.coin_icon} src={'./img/gnet_icon.png'} />*/}
              {/*    <span className={styles.coin_name}>Gnet</span>*/}
              {/*  </div>*/}
              {/*  <div className={styles.right_wrap}>*/}
              {/*    <span className={styles.num_text}>{numberMFormat(assetsState.gnet)}</span>*/}
              {/*    <div className={styles.right_icon}></div>*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div onClick={() => gotoCoinBalance(2)} className={styles.coin_item_wrap}>
                <div className={styles.left_wrap}>
                  <img className={styles.coin_icon} src={'./img/usdt_icon.png'} />
                  <span className={styles.coin_name}>USDT</span>
                </div>
                <div className={styles.right_wrap}>
                  <span className={styles.num_text}>{numberMFormat((assetsState.usdt / 1000000) + freezeBalanceState.usdt)}</span>
                  <div className={styles.right_icon}></div>
                </div>
              </div>
            </>
          )
        }
        {
          stateLoading && (
            <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
          )
        }
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

      <div className={styles.sized_bottom_box}></div>

      <Modal centered footer={null} closeIcon={false} open={withdrawOpen} onCancel={() => setWithdrawOpen(false)}>
        <div className={styles.modal_content}>
          <div className={styles.title_wrap}>{t('withdraw_dialog_title')}</div>
          <div className={styles.content_text}>{t('withdraw_dialog_hint_1', {currency: MAIN_CURRENCY_COIN})}</div>
          <div className={styles.content_text}>{t('withdraw_dialog_hint_2')}</div>
          <div className={styles.content_text}>{t('withdraw_dialog_hint_3')}</div>

          <div onClick={() => setWithdrawOpen(false)} className={styles.determine_btn}>{t('withdraw_dialog_btn_text')}</div>
        </div>
      </Modal>

    </div>
  )
}

export default Minister
