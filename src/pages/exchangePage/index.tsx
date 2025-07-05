
import styles from "./index.module.scss"
import {Button, InputNumber, message} from "antd";
import {useTranslation} from "react-i18next";
import {AssetsStateType, GENToUSDTReqType} from "@/types";
import {useSelector} from "react-redux";
import {numberFormatToEnglish} from "@/utils/numFormat.ts";
import {useState} from "react";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {APIAssetsInfo, APIGENtoUSDT, APIUSDTtoGEN} from "@/api";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setAssetsState, setLoadingModalVis} from "@/redux/actions/home.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const ExchangePage = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const dispatch = useDispatchAction({ setLoadingModalVis, setAssetsState })

  const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)
  const rateGENToUSDT: number = useSelector((state: any) => state.user.userInfo.rateGENToUSDT)
  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)

  const [genAmount, setGENAmount] = useState<any>(null)

  const [exchangeType, setExchangeType] = useState<boolean>(false)

  const onElementClick = () => {
    if (!genAmount) {
      return message.warning(t('exchange_zero_error_text'))
    }
    const assetsAmount = exchangeType ? assetsState.usdt / (10 ** 6) : assetsState.usdn
    if (genAmount > assetsAmount) {
      message.warning(t('withdraw_insufficient_balance'))
      return
    }
    const reqData: GENToUSDTReqType = {
      nonce: new Date().getTime().toString(),
      userId: userInfoData.userId,
      type: exchangeType ? 2 : 1,
      amount: (genAmount ?? 0) * (exchangeType ? (10 ** 6) : 100),
    }
    dispatch.setLoadingModalVis(true)
    const fetchAPI = () => {
      if (exchangeType) {
        return APIUSDTtoGEN(reqData)
      }
      return APIGENtoUSDT(reqData)
    }
    fetchAPI().then(resp => {
      if (resp.data) {
        return APIAssetsInfo()
      } else {
        message.error(resp.msg)
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        message.success(t('common_operation_successful'))
        dispatch.setAssetsState(resp.data)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }



  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <span>USDT</span>
      </div>

      <div className={styles.exchange_box}>
        <div className={styles.exchange_wrap}>

          <div className={styles.top_wrap}>

            <div className={styles.t_left_wrap}>
              {
                !exchangeType && (
                  <>
                    <div className={styles.label_text}>{MAIN_CURRENCY_COIN}</div>
                    <div className={styles.hint_text}>1{MAIN_CURRENCY_COIN}={numberFormatToEnglish(rateGENToUSDT, 8)}USDT</div>
                  </>
                )
              }
              {
                exchangeType && (
                  <>
                    <div className={styles.label_text}>USDT</div>
                    <div className={styles.hint_text}>1USDT={numberFormatToEnglish(1 / rateGENToUSDT)}{MAIN_CURRENCY_COIN}</div>
                  </>
                )
              }
            </div>

            {
              !exchangeType ? (
                <div className={styles.balance_num}>{numberFormatToEnglish(assetsState?.usdn)}</div>
              ) : (
                <div className={styles.balance_num}>{numberFormatToEnglish(assetsState?.usdt / 1000000)}</div>
              )
            }


          </div>

          <div className={styles.center_wrap}>
            <InputNumber placeholder={'0'} min={0.01} value={genAmount} onChange={(e) => setGENAmount(e)} className={styles.input_wrap} />
            <div onClick={() => setGENAmount(exchangeType ? assetsState?.usdt / 1000000 : assetsState?.usdn)} className={styles.all_btn}>{t('exchange_all')}</div>
          </div>

          <div onClick={() => setExchangeType(!exchangeType)} className={styles.exchange_icon}></div>

        </div>

        <div className={styles.echange_num_wrap}>
          <div className={styles.t_left_wrap}>
            <div className={styles.label_text}>{!exchangeType ? "USDT": MAIN_CURRENCY_COIN}</div>
            <div className={styles.hint_text}>{t('exchange_can_propose_balance')}</div>
          </div>
          {
            !exchangeType ? (
              <div className={styles.balance_num}>{numberFormatToEnglish(rateGENToUSDT * genAmount, 6)}</div>
            ) : (
              <div className={styles.balance_num}>{numberFormatToEnglish((1 / rateGENToUSDT) * genAmount, 6)}</div>
            )
          }



        </div>

      </div>

      <Button onClick={onElementClick} type={"primary"} className={styles.element_btn}>{t('exchange_element')}</Button>



    </div>
  )
}

export default ExchangePage
