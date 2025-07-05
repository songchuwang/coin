import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {Button, InputNumber, message, Modal} from "antd";
import {useEffect, useRef, useState} from "react";
import {numberFormatToEnglish} from "@/utils/numFormat.ts";
import {LoadingOutlined} from "@ant-design/icons";
import {AssetsStateType, ConfirmPledgeType, ListReqParamType, StakingItemType} from "@/types";
import {APIAssetsInfo, APIConfirmStaking, APIStakingDetails, APIStakingList} from "@/api";
import {useSelector} from "react-redux";
import {formatTimestampToDHMS} from "@/utils/timeFormat.ts";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setAssetsState, setLoadingModalVis} from "@/redux/actions/home.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const PledgeListPage = () => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()
  const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)

  const dispatch = useDispatchAction({setLoadingModalVis, setAssetsState})

  const [pledgeVis, setPledgeVis] = useState(false)

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)
  const listParamsRef = useRef({
    current: 1,
    size: 35
  })
  const [dataList, setDataList] = useState<Array<StakingItemType>>([])
  const dataListRef = useRef<Array<StakingItemType>>([])

  // const [nowTime, setNowTime] = useState(0)

  // const [detailsLoading, setDetailsLoading] = useState(false)

  const [pledgeAmount, setPledgeAmount] = useState<any>(null)
  const [pledgeDetails, setPledgeDetails] = useState<StakingItemType>(null)

  const timerRef = useRef<any>(null)

  const setGENAmount = (e) => {
    setPledgeAmount(e)
  }

  const onAllClick = () => {
    setPledgeAmount(assetsState.usdn)
  }

  const onConfirmPledge = () => {
    if (!pledgeAmount) {
      return message.warning(t('pledge_modal_fill_in_hint'))
    }
    if (pledgeAmount > assetsState.usdn) {
      return message.warning(t('withdraw_insufficient_balance'))
    }
    dispatch.setLoadingModalVis(true)
    const confirmParams: ConfirmPledgeType = {
      financeId: pledgeDetails.id,
      amount: pledgeAmount * 100
    }
    APIConfirmStaking(confirmParams).then(resp => {
      if (resp.data) {
        message.success(t('common_operation_successful'))
        setPledgeVis(false)
        return fetchListDataNotLoading()
      } else {
        message.error(resp.msg)
      }
    }).then(() => {
      return APIAssetsInfo()
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setAssetsState(resp.data)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const fetchListDataNotLoading = async () => {
    // const params: ListReqParamType = {
    //   // userId: userInfoData.userId,
    //   pageNo: listParamsRef.current.current,
    //   pageSize: listParamsRef.current.size
    // }
    // await APIStakingList(params).then(resp => {
    //   if (resp.code === 0) {
    //     setDataList(resp.data)
    //     dataListRef.current = resp.data
    //   }
    // })
    listParamsRef.current.current = 1
    await fetchListData()
  }

  const fetchDetailData = (id: number) => {
    setPledgeVis(true)
    setPledgeDetails(null)
    APIStakingDetails(id).then(resp => {
      if (resp.code === 0) {
        setPledgeDetails(resp.data)
      } else {
        message.error(resp.msg)
      }
    })
  }

  const fetchListData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: ListReqParamType = {
      // userId: userInfoData.userId,
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size
    }
    APIStakingList(params).then(resp => {
      if (resp.code === 0) {
        if (resp.data.length <= 0) {
          setLoadingStatus(2)
          return
        }
        let nowList = dataListRef.current
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data)
        setDataList(nowList)
        dataListRef.current = nowList
        if ((params.pageNo * params.pageSize) >= resp.data.length) {
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

  // const startGetNowTime = () => {
  //   timerRef.current = setInterval(() => {
  //     setNowTime(new Date().getTime())
  //   }, 1000)
  // }

  useEffect(() => {
    fetchListData()
    // startGetNowTime()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, []);

  useEffect(() => {
    setPledgeAmount(null)
  }, [pledgeVis]);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('pledge_staking')}</span>
      </div>
      {
        dataList.map((item) => (
          <div key={'staking-item-key-' + item.id} className={styles.staking_item_wrap}>
            <div className={styles.item_title}>{item.name}</div>
            <div className={styles.item_content_wrap}>
              <div className={styles.content_item_wrap}>
                <div className={styles.power_text}>{item.dailyRatioStr}</div>
                <div className={styles.content_item_label}>{t('pledge_daily_income')}</div>
              </div>
              <div className={styles.content_item_wrap}>
                <div className={styles.other_text}>{numberFormatToEnglish(item.hours / 24, 2)} {t('common_day')}</div>
                <div className={styles.content_item_label}>{t('pledge_time')}</div>
              </div>
              <div className={styles.content_item_wrap}>
                <div className={styles.other_text}>{item.profit ?? 0}</div>
                <div className={styles.content_item_label}>{t('pledge_accumulated_proft')}</div>
              </div>
              <div className={styles.content_item_wrap}>
                <div className={styles.other_text}>{numberFormatToEnglish((item.amount ?? 0) / 100, 2)}</div>
                <div className={styles.content_item_label}>{t('pledge_submitted_quantity')}</div>
              </div>
            </div>
            <div>
              <Button onClick={() => fetchDetailData(item.id)} type={"primary"} className={styles.record_btn}>{t('pledge_initiation_funds')}</Button>
            </div>
          </div>
        ))
      }

      {
        loadingStatus !== 2 && (
          <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
        )
      }

      <Modal centered footer={null} closeIcon={false} open={pledgeVis} onCancel={() => setPledgeVis(false)}>

        <div className={styles.modal_content}>
          {
            pledgeDetails ? (
              <>
                <div className={styles.modal_title}>{t('pledge_modal_title')}</div>
                <div className={styles.line_wrap}></div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_modal_daily_interest_rate')}</div>
                  <div className={styles.info_value_p}>{pledgeDetails.dailyRatioStr}</div>
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_time')}</div>
                  <div className={styles.info_value_common_text}>{numberFormatToEnglish(pledgeDetails.hours / 24, 2)} {t('common_day')}</div>
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_modal_account_balance')}</div>
                  <div className={styles.info_value_common_text}>{numberFormatToEnglish(assetsState.usdn, 2)}</div>
                </div>
                <div className={styles.input_box}>
                  <InputNumber placeholder={'0'} value={pledgeAmount} onChange={(e) => setGENAmount(e)} min={1} className={styles.input_wrap} addonAfter={<div onClick={onAllClick} className={styles.input_addon}>ALL</div>} />
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_modal_will_receive_daily')}</div>
                  <div className={styles.info_value_common_text}>{t('pledge_modal_will_receive_daily_amount', {amount: numberFormatToEnglish((pledgeDetails.dailyRatio / 10000) * (pledgeAmount ?? 0), 4), currency: MAIN_CURRENCY_COIN})}</div>
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_modal_you_will_receive_in_total')}</div>
                  <div className={styles.info_value_common_text}>{t('pledge_modal_will_receive_daily_amount', {amount: numberFormatToEnglish((pledgeDetails.dailyRatio / 10000) * (pledgeAmount ?? 0) * (pledgeDetails.hours / 24), 4), currency: MAIN_CURRENCY_COIN})}</div>
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_modal_settlement_countdown')}</div>
                  <div className={styles.info_value_common_text}>{formatTimestampToDHMS((pledgeDetails.hours * 3600 * 1000) - 1000)}</div>
                </div>

                <div style={{width: '100%'}}>
                  <Button onClick={onConfirmPledge} type={"primary"} className={styles.active_btn}>{t('common_confirm')}</Button>
                </div>
              </>
            ) : (
              <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
            )
          }
        </div>
      </Modal>

    </div>
  )
}

export default PledgeListPage
