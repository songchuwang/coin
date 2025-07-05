import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {numberFormatToEnglish} from "@/utils/numFormat.ts";
import {formatTimestamp, formatTimestampToDHMS} from "@/utils/timeFormat.ts";
import {LoadingOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {ListReqParamType, StakingOrderType} from "@/types";
import {APIStakingOrder} from "@/api";
import {message} from "antd";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";


const RecordItem = (props: {stakingRecordItem: StakingOrderType, nowTime: number}) => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if ((props.stakingRecordItem.endTime - props.nowTime) < 0) {
      setIsDone(true)
    }
  }, [props.nowTime]);

  return (
    <div className={styles.record_item_wrap}>

      <div className={styles.start_time}>{formatTimestamp(props.stakingRecordItem.beginTime)}</div>

      <div className={styles.info_wrap}>
        <div className={styles.info_label}>{t('pledge_modal_daily_interest_rate')}</div>
        <div className={styles.info_value_p}>{props.stakingRecordItem.dailyRatioStr}</div>
      </div>
      <div className={styles.info_wrap}>
        <div className={styles.info_label}>{t('pledge_time')}</div>
        <div className={styles.info_value_common_text}>{numberFormatToEnglish(props.stakingRecordItem.hours / 24, 2)} {t('common_day')}</div>
      </div>
      {/*<div className={styles.info_wrap}>*/}
      {/*  <div className={styles.info_label}>{t('pledge_modal_account_balance')}</div>*/}
      {/*  <div className={styles.info_value_common_text}>{numberFormatToEnglish(props.stakingRecordItem.usdn, 2)}</div>*/}
      {/*</div>*/}

      <div className={styles.input_amount_box}>{numberFormatToEnglish(props.stakingRecordItem.amount / 100, 2)}</div>

      <div className={styles.info_wrap}>
        <div className={styles.info_label}>{t('pledge_modal_will_receive_daily')}</div>
        <div className={styles.info_value_common_text}>{t('pledge_modal_will_receive_daily_amount', {amount: numberFormatToEnglish((props.stakingRecordItem.dailyRatio / 10000) * (props.stakingRecordItem.amount ?? 0) / 100, 4), currency: MAIN_CURRENCY_COIN})}</div>
      </div>
      <div className={styles.info_wrap}>
        <div className={styles.info_label}>{t('pledge_modal_you_will_receive_in_total')}</div>
        <div className={styles.info_value_common_text}>{t('pledge_modal_will_receive_daily_amount', {amount: numberFormatToEnglish((props.stakingRecordItem.dailyRatio / 10000) * (props.stakingRecordItem.amount ?? 0) / 100 * (props.stakingRecordItem.hours / 24), 4), currency: MAIN_CURRENCY_COIN})}</div>
      </div>
      <div className={styles.info_wrap}>
        <div className={styles.info_label}>{t('pledge_modal_settlement_countdown')}</div>
        <div className={styles.info_value_common_text}>{formatTimestampToDHMS(props.stakingRecordItem.endTime - props.nowTime)}</div>
      </div>
      {
        isDone ? (
          <div className={styles.left_tag_down}><span>{t('pledge_record_done_text')}</span></div>
        ) : (
          <div className={styles.left_tag_running}><span>{t('pledge_record_pledging_text')}</span></div>
        )
      }

    </div>
  )

}

const StakingRecord = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const listLoadingRef = useRef(false)
  const timerRef = useRef<any>(null)

  const [nowTime, setNowTime] = useState(0)

  const [loadingStatus, setLoadingStatus] = useState(0)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })

  const [dataList, setDataList] = useState<Array<StakingOrderType>>([])

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: ListReqParamType = {
      // userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    APIStakingOrder(params).then(resp => {
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

  const startGetNowTime = () => {
    timerRef.current = setInterval(() => {
      setNowTime(new Date().getTime())
    }, 1000)
  }

  useEffect(() => {
    startGetNowTime()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, []);

  useEffect(() => {
    initLoading()
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('pledge_staking_record')}</span>
      </div>

      <div className={styles.list_box_wrap}>

        {
          dataList.map(item => (
            <RecordItem key={'record-key-' + item.id} stakingRecordItem={item} nowTime={nowTime} />
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

export default StakingRecord
