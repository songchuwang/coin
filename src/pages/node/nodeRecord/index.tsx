import styles from "./index.module.scss";
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {
  BuyServiceOrderListReqType,
  NodeServiceItemType,
  StakingOrderListReqType,
  StakingOrderType
} from "@/types";
import {APIBuyServiceList, APIStakingOrder} from "@/api";
import {message} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {formatTimestampYYYYMMDD} from "@/utils/timeFormat.ts";
import {numberFormatToEnglish} from "@/utils/numFormat.ts";
import {formatPriceIfUsdt, formatUnitByCurrency} from "@/utils/textUtils.ts";
import {useLocation} from "react-router-dom";
import ImageWidget from "@/components/ImageWidget";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";


const NodeRecord = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const location = useLocation();
  const { tabType } = location.state || {};

  const [tabIndex, setTabIndex] = useState(0)

  const observerRef = useRef<IntersectionObserver>(null)

  const [nowTime] = useState(new Date().getTime())

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)

  const listParamsRef = useRef({
    current: 1,
    size: 35
  })

  const [dataList, setDataList] = useState<Array<StakingOrderType>>([])

  const [nftDataList, setNFTDataList] = useState<Array<NodeServiceItemType>>([])

  const dataListRef = useRef<Array<any>>([])

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: StakingOrderListReqType = {
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size,
      isNode: 1
    }
    APIStakingOrder(params).then(resp => {
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

  const fetchNFTData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: BuyServiceOrderListReqType = {
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size,
      isNode: 1
    }
    APIBuyServiceList(params).then(resp => {
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
        setNFTDataList(nowList)
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
    observerRef.current = new IntersectionObserver(() => {
      if (!listLoadingRef.current) {
        // console.log('执行了')
        if (tabIndex === 0) {
          fetchData()
        } else {
          fetchNFTData()
        }

      }
    }, {
      rootMargin: '0px',
      threshold: 0.5
    })
    const loadingMore = document.getElementById("moreLoading")
    if (loadingMore) {
      observerRef.current.observe(loadingMore)
    }
  }

  useEffect(() => {
    if (tabType === 2) {
      setTabIndex(1)
    }
  }, []);

  useEffect(() => {
    setNFTDataList([])
    setDataList([])
    listParamsRef.current.current = 1
    setLoadingStatus(0)
  }, [tabIndex]);

  useEffect(() => {
    if (observerRef.current) {
      if (loadingStatus === 0) {
        observerRef.current.disconnect()
      }
    }
    initLoading()
  }, [tabIndex, loadingStatus]);


  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('common_record')}</span>
      </div>

      <div className={styles.content_wrap}>

        <div className={styles.tab_wrap}>
          <div onClick={() => setTabIndex(0)} className={`${styles.tab_item} ${tabIndex === 0 && styles.tab_item_active}`}>
            <span>{t('common_pledge_up')}</span>
          </div>
          <div onClick={() => setTabIndex(1)} className={`${styles.tab_item} ${tabIndex === 1 && styles.tab_item_active}`}>
            <span>NFT</span>
          </div>
        </div>

        <div className={styles.page_label}>{t('coin_date')}</div>

        <div className={styles.list_box}>
          <div className={styles.list_wrap}>

            {
              dataList.map((item) => (
                <div key={`record-pldege-key-` + item.id} className={styles.list_item_wrap}>
                  <div className={styles.date_time}>{formatTimestampYYYYMMDD(item.beginTime)}</div>
                  <div className={styles.list_item_name}>{item.nodeName}</div>
                  <div className={styles.item_info_wrap}>
                    <div className={styles.item_info_label}>{t('node_record_number_of')}</div>
                    <div className={styles.item_info_value_text}>{numberFormatToEnglish(item.amount / 100, 2)}{MAIN_CURRENCY_COIN}</div>
                  </div>
                  <div className={styles.item_info_wrap}>
                    <div className={styles.item_info_label}>{t('node_record_expiration_date')}</div>
                    <div className={styles.item_info_value_text}>{formatTimestampYYYYMMDD(item.endTime)}</div>
                  </div>
                  <div className={styles.item_info_wrap}>
                    <div className={styles.item_info_label}>{t('common_day')}</div>
                    <div className={styles.item_info_value_text}>{numberFormatToEnglish(item.hours / 24, 2)}</div>
                  </div>
                  <div className={styles.item_info_wrap}>
                    <div className={styles.item_info_label}>{t('common_per_day')}</div>
                    <div className={styles.item_info_import_value_text}>{item.dailyRatioStr}/{t('common_day')}</div>
                  </div>
                  {
                    nowTime < item.endTime && (<div className={styles.item_tag_wrap_effect}><span>{t('common_in_effect')}</span></div>)
                  }
                  {
                    nowTime > item.endTime && (<div className={`${styles.item_tag_wrap_effect} ${styles.item_tag_wrap_expire}`}><span>{t('common_expire')}</span></div>)
                  }

                </div>
              ))
            }
            {
              nftDataList.map((item) => (
                <div key={`record-pldege-key-` + item.id} className={styles.list_item_wrap}>
                  <div className={styles.date_time}>{formatTimestampYYYYMMDD(item.createTime)}</div>

                  <div className={styles.nft_item_wrap}>
                    <div className={styles.list_item_nft_img}><ImageWidget src={item.packageImageUrl} /></div>
                    <div className={styles.list_item_nft_content}>
                      <div className={styles.list_item_name}>{item.nodeName}</div>
                      <div className={styles.item_info_wrap}>
                        <div className={styles.item_info_label}>{t('node_record_daily_coin_count')}</div>
                        <div className={styles.item_info_import_value_text}>{formatPriceIfUsdt(item.profitCurrency, item.profit)} {formatUnitByCurrency(item.profitCurrency)}/{t('common_day')}</div>
                      </div>
                      <div className={styles.item_info_wrap}>
                        <div className={styles.item_info_label}>{t('accelerate_price')}</div>
                        <div className={styles.item_info_value_text}>{formatPriceIfUsdt(item.priceCurrency, item.price)} {formatUnitByCurrency(item.priceCurrency)}</div>
                      </div>
                      <div className={styles.item_info_wrap}>
                        <div className={styles.item_info_label}>{t('common_date')}</div>
                        <div className={styles.item_info_value_text}>{formatTimestampYYYYMMDD(item.expiration)}</div>
                      </div>
                    </div>
                  </div>

                  {
                    nowTime < item.expiration && (<div className={styles.item_tag_wrap_effect}><span>{t('common_in_effect')}</span></div>)
                  }
                  {
                    nowTime > item.expiration && (<div className={`${styles.item_tag_wrap_effect} ${styles.item_tag_wrap_expire}`}><span>{t('common_expire')}</span></div>)
                  }

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

    </div>
  )
}

export default NodeRecord
