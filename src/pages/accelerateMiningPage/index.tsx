import styles from './index.module.scss'
import {useTranslation} from "react-i18next";
import ImageWidget from "@/components/ImageWidget";
import {formatPriceIfUsdt, formatUnitByCurrency} from "@/utils/textUtils.ts";
import {formatHoursToDay} from "@/utils/timeFormat.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {APIMiningActivityList} from "@/api";
import {NodeNFTServiceType} from "@/types";
import {message} from "antd";
import useCountdownTimer from "@/hooks/useCountdownTimer.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const AccelerateMiningPage = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const navigate = useNavigate()

  const countTime = useCountdownTimer(1831786457000 - new Date().getTime())

  const [miningActivityList, setMiningActivityList] = useState<Array<NodeNFTServiceType>>([])

  const [loading, setLoading] = useState(false)

  const fetchActivityList = () => {
    setLoading(true)
    APIMiningActivityList().then(resp => {
      if (resp.code === 0) {
        setLoading(false)
        setMiningActivityList(resp.data)
      }
    }).finally(() => {

    })
  }

  const gotoInvitePage = (item: NodeNFTServiceType) => {
    if (item.status === 1) {
      return message.info(t('invite_mining_finish_text'))
    }
    navigate(`/nftInvitePage/2/${item.id}`)
  }

  useEffect(() => {
    fetchActivityList()
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('invite_accelerate_mining', {currency: MAIN_CURRENCY_COIN})}</span>
      </div>
      <div></div>
      <div className={styles.content_wrap}>
        {
          miningActivityList.map((item) => (
            <div className={styles.mining_item_wrap}>
              <div className={styles.top_img_box}><ImageWidget src={item?.imageUrl ?? ''}/></div>
              <div className={styles.l_content_wrap}>
                <div className={styles.hint_text_wrap}>
                  <div className={styles.hint_label}>{t('accelerate_speed')}</div>
                  <div className={styles.hint_value}>{formatPriceIfUsdt(item.profitCurrency, item.speed)} {formatUnitByCurrency(item.profitCurrency)}/H</div>
                </div>
                <div className={styles.hint_text_wrap}>
                  <div className={styles.hint_label}>{t('accelerate_validity')}</div>
                  <div className={styles.hint_value}>{formatHoursToDay(item.validity)} {t('common_day')}</div>
                </div>
                <div className={styles.hint_text_wrap}>
                  <div className={styles.hint_label}>{t('function_invite')}</div>
                  <div className={styles.hint_value}>{item.referralNum}/{item.price} {t('common_person')}</div>
                </div>
                <div onClick={() => gotoInvitePage(item)} className={`${styles.invite_btn} ${item.status === 1 && styles.invite_btn_finish}`}>
                  {
                    item.status === 1 ? (
                      <span>{t('common_finish')}</span>
                    ) : (
                      <span>{t('function_invite')}{item.referralNum === 0 && `(${countTime.hours}:${countTime.minutes}:${countTime.seconds})`}</span>
                    )
                  }
                </div>
              </div>
            </div>
          ))
        }
        <div style={{height: 50}}></div>
        {
          loading && (
            <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
          )
        }
      </div>
    </div>
  )
}

export default AccelerateMiningPage
