import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import ImageWidget from "@/components/ImageWidget";
import {GENLogsType, ListReqParamType} from "@/types";
import {APIGenExchangeLogs, APIUSDTExchangeLogs} from "@/api";
import {message} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {formatTimestamp} from "@/utils/timeFormat.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const BillPage = () => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const [tabIndex, setTabIndex] = useState(0)

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })
  const [dataList, setDataList] = useState<Array<GENLogsType>>([])
  const dataListRef = useRef<Array<GENLogsType>>([])


  const fetchData = (id: number) => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: ListReqParamType = {
      // userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    const fetchFunc = () => {
      if (id === 0) {
        return APIGenExchangeLogs(params)
      }
      if (id === 1) {
        return APIUSDTExchangeLogs(params)
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

  const initLoading = () => {
    const ob = new IntersectionObserver(() => {
      if (!listLoadingRef.current) {
        // console.log('执行了')
        fetchData(tabIndex)
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

  const onClickTab = (num: number) => {
    setTabIndex(num)
    setLoadingStatus(0)
    setDataList([])
    listParamsRef.current.current = 1
    fetchData(num)
  }

  const coinMap = {
    0: {
      name: MAIN_CURRENCY_COIN,
      icon: '/img/coin_icon.png'
    },
    1: {
      name: 'USDT',
      icon: '/img/usdt_icon.png'
    }
  }

  useEffect(() => {
    initLoading()
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('wallet_bill')}</span>
      </div>

      <div className={styles.tab_wrap}>
        <div onClick={() => onClickTab(0)} className={`${styles.tab_item} ${tabIndex === 0 && styles.tab_item_active}`}>{MAIN_CURRENCY_COIN}</div>
        <div onClick={() => onClickTab(1)} className={`${styles.tab_item} ${tabIndex === 1 && styles.tab_item_active}`}>USDT</div>
      </div>

      <div className={styles.list_box}>

        {
          dataList.map((item) => (
            <div key={'date-coin-key' + item.id} className={styles.date_coin_item}>
              <div className={styles.coin_icon}><ImageWidget src={coinMap[tabIndex].icon} /></div>
              <div className={styles.date_coin_info_wrap}>
                <div className={styles.coin_title}>{item.remark}</div>
                <div className={styles.coin_date}>{formatTimestamp(item.createTime)}</div>
              </div>
              <div className={styles.coin_action_wrap}>
                <div className={styles.coin_num}>{tabIndex === 1 ? item.amount / 1000000 : item.amount / 100}</div>
                <div className={styles.coin_util}>{coinMap[tabIndex].name}</div>
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
  )
}

export default BillPage
