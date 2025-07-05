import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {InputNumber} from "antd";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const MarketSwapPage = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()
  const location = useLocation();

  const [swapType, setSwapType] = useState(true)

  const [changeAmount, setChangeAmount] = useState<any>(null)
  const [rateChangeAmount, setRateChangeAmount] = useState<any>(null)
  const [rateAmount, setRateAmount] = useState(0.00001)

  const [coinState, setCoinState] = useState({
    currency: {icon: './img/coin_icon.png', coinName: MAIN_CURRENCY_COIN},
    changeCurrency: {icon: './img/usdt_icon.png', coinName: 'USDT'},
    gen: {icon: './img/coin_icon.png', coinName: MAIN_CURRENCY_COIN},
    usdt: {icon: './img/usdt_icon.png', coinName: 'USDT'}
  })

  const onChangeAmount = (e) => {
    setChangeAmount(e)
    setRateChangeAmount(e * rateAmount)
  }

  const onChangeSwap = () => {
    setSwapType(!swapType)
    setRateAmount(1 / rateAmount)
    setRateChangeAmount(changeAmount * 1 / rateAmount)
    setCoinState({
      ...coinState,
      currency: !swapType ? coinState.usdt : coinState.gen,
      changeCurrency: swapType ? coinState.usdt : coinState.gen,
    })
  }

  const initSwapType = () => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    if (type) {
      setSwapType(Number(type) === 1)
    }
  }

  useEffect(() => {
    initSwapType()
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{swapType ? t('markets_buy') : t('markets_sell')}</span>
      </div>

      <div className={styles.content_wrap}>
        <div className={styles.swap_wrap}>
          <div className={styles.swap_info_item}>
            <div className={styles.coin_icon_img}><img src={coinState.currency.icon}/></div>
            <div className={styles.coin_name}>{coinState.currency.coinName}</div>
            <div className={styles.right_icon}></div>
            <div className={styles.input_wrap_box}>
              <InputNumber placeholder={'10000'} value={changeAmount} onChange={(e) => onChangeAmount(e)} min={1} className={styles.input_wrap} />
            </div>
          </div>
          <div className={styles.center_warp}>
            <div className={styles.line_wap}></div>
            <div onClick={onChangeSwap} style={{transform: `rotateZ(${swapType ? 0 : 180}deg)`}} className={styles.swap_icon}></div>
          </div>
          <div className={styles.swap_info_item}>
            <div className={styles.coin_icon_img}><img src={coinState.changeCurrency.icon}/></div>
            <div className={styles.coin_name}>{coinState.changeCurrency.coinName}</div>
            <div className={styles.right_icon}></div>
            <div className={styles.input_wrap_box}>
              <InputNumber disabled={true} placeholder={'10000'} value={rateChangeAmount} min={0} className={styles.input_wrap} />
            </div>
          </div>

          <div className={styles.rate_text}>
            <span>1GEN={rateAmount}USDT</span>
          </div>
        </div>
        <div style={{backgroundColor: !swapType ? '#C5565A' : ''}} className={styles.confirm_btn}>
          <span>{swapType ? 'Confirm to buy' : 'Confirm to Sell'}</span>
        </div>
      </div>

    </div>
  )
}

export default MarketSwapPage
