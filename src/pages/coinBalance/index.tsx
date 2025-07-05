import styles from "./index.module.scss"
import ImageWidget from "@/components/ImageWidget";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {AssetsStateType, GENLogsType, ListReqParamType} from "@/types";
import {useSelector} from "react-redux";
import {numberMFormat} from "@/utils/numFormat.ts";
import {useEffect, useRef, useState} from "react";
import {APIAssetUserLogs, APIGenExchangeLogs, APIStakingOrder, APIUSDTExchangeLogs} from "@/api";
import {message} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {formatTimestamp} from "@/utils/timeFormat.ts";
import {formatPriceIfUsdt} from "@/utils/textUtils.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const CoinBalance = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const { id } = useParams();

  const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)
  const [gusdLockAmount, setGUSDLockAmount] = useState(0)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })
  const [dataList, setDataList] = useState<Array<GENLogsType>>([])
  const dataListRef = useRef<Array<GENLogsType>>([])
  const coinMap = {
    "1": {
      name: MAIN_CURRENCY_COIN,
      assetType: 2,
      icon: '/img/coin_icon.png',
      amount: assetsState.usdn ?? 0
    },
    "2": {
      name: 'USDT',
      assetType: 1,
      icon: '/img/usdt_icon.png',
      amount: ((assetsState.usdt ?? 0) / 1000000)
    },
    "3": {
      name: 'Gnet',
      icon: '/img/gnet_icon.png',
      amount: assetsState.gnet ?? 0
    },
  }

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: ListReqParamType = {
      // userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    const fetchFunc = () => {
      if (id === '1') {
        return APIGenExchangeLogs(params)
      }
      if (id === '2') {
        return APIUSDTExchangeLogs(params)
      }
      if (id === '3') {
        return APIAssetUserLogs({assetType: 3})
      }
    }
    fetchFunc().then(resp => {
      if (resp.code === 0) {
        if (resp.data.list.length <= 0) {
          setLoadingStatus(2)
          return
        }
        let nowList = dataListRef.current
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data.list)
        setDataList(nowList)
        dataListRef.current = nowList
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

  const fetchStakingPage = () => {

    APIStakingOrder({pageNo: 1, pageSize: 10000000}).then(resp => {
      if (resp.code === 0) {
        let sumAmount = 0
        for (const item of resp.data.list) {
          if (item.status === 3 && item.assetType === coinMap[id].assetType) {
            sumAmount += item.amount
          }
        }
        if (coinMap[id].name === MAIN_CURRENCY_COIN) {
          sumAmount = sumAmount / 100
        } else {
          sumAmount = sumAmount / (10 ** 6)
        }
        setGUSDLockAmount(sumAmount)
      }
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

  useEffect(() => {
    // fetchData()
    fetchStakingPage()
    initLoading()
  }, []);


  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('coin_balance', { coinName: coinMap[id].name })}</span>
      </div>
      <div className={styles.balance_num}>{numberMFormat(coinMap[id].amount + gusdLockAmount)}</div>

      {
        gusdLockAmount !== 0 && (
          <div className={styles.coin_pledge_wrap}>

            <div className={styles.coin_pledge_item}>
              <div className={styles.num_text}>{numberMFormat(gusdLockAmount)}</div>
              <div className={styles.hint_text}>{t('balance_lock_status')}</div>
            </div>

            <div className={styles.coin_pledge_item}>
              <div className={styles.num_text}>{numberMFormat(coinMap[id].amount)}</div>
              <div className={styles.hint_text}>{t('balance_available_status')}</div>
            </div>

          </div>
        )
      }

      <div className={styles.date_coin_wrap}>
        <div className={styles.date_coin_header}>{t('coin_date')}</div>
        <div className={styles.date_coin_list_wrap}>
          {
            dataList.map((item) => (
              <div key={'date-coin-key' + item.id} className={styles.date_coin_item}>
                <div className={styles.coin_icon}><ImageWidget src={coinMap[id].icon} /></div>
                <div className={styles.date_coin_info_wrap}>
                  <div className={styles.coin_title}>{item.remark}</div>
                  <div className={styles.coin_date}>{formatTimestamp(item.createTime)}</div>
                </div>
                <div className={styles.coin_action_wrap}>
                  <div className={styles.coin_num}>{id === "2" ? item.amount / 1000000 : formatPriceIfUsdt(2, item.amount)}</div>
                  <div className={styles.coin_util}>{coinMap[id].name}</div>
                </div>
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
    </div>
  )

}

export default CoinBalance
