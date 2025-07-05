import styles from "./index.module.scss"
import ImageWidget from "@/components/ImageWidget";
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {ListReqParamType, USDTWithdrawType} from "@/types";
import {message} from "antd";
import {APIWithdrawRecord} from "@/api";
import {LoadingOutlined} from "@ant-design/icons";
import {formatTimestamp} from "@/utils/timeFormat.ts";

const WithdrawRecord = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })
  const [dataList, setDataList] = useState<Array<USDTWithdrawType>>([])

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: ListReqParamType = {
      // userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    APIWithdrawRecord(params).then(resp => {
      if (resp.code === 0) {
        if (resp.data.list.length <= 0) {
          setLoadingStatus(2)
          return
        }
        let nowList = dataList
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data.list)
        setDataList(nowList)
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
    initLoading()
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <span>{t('withdraw_record')}</span>
      </div>

      <div className={styles.list_box}>

        {
          dataList.map((item) => (
            <div key={'date-coin-key' + item.id} className={styles.date_coin_item}>
              <div className={styles.coin_icon}><ImageWidget src={'/img/usdt_icon.png'} /></div>
              <div className={styles.date_coin_info_wrap}>
                <div className={styles.coin_title}>{t('withdraw_amount')}</div>
                <div className={styles.coin_date}>{formatTimestamp(item.createTime)}</div>
              </div>
              <div className={styles.coin_action_wrap}>
                <div className={styles.coin_num}>{item.amount / 1000000}</div>
                <div className={styles.coin_util}>USDT</div>
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

export default WithdrawRecord
