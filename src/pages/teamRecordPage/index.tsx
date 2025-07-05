import {useParams} from "react-router-dom";
import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {APITeamRecordList} from "@/api";
import {message} from "antd";
import {TeamRecordItemType} from "@/types";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis} from "@/redux/actions/home.ts";
import {useSelector} from "react-redux";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const TeamRecordPage = () => {

  const {t}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()

  const { tag } = useParams();

  const loadingVis = useSelector((state: any) => state.home.loadingModal.loading)

  const dispatch = useDispatchAction({ setLoadingModalVis })

  const [recordList, setRecordList] = useState<Array<TeamRecordItemType>>([])

  const levelMap = {
    "1": t('team_friends'),
    "2": t('team_friends_invites')
  }

  const fetchData = () => {
    dispatch.setLoadingModalVis(true)
    APITeamRecordList(tag).then(resp => {
      if (resp.code === 0) {
        setRecordList(resp.data)
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <span>{levelMap[tag]}</span>
      </div>

      <div className={styles.data_header}>
        <div className={styles.data_header_item1}>{t('team_record_account')}</div>
        <div className={styles.data_header_item2}>{t('team_number_of_invitees')}</div>
        <div className={styles.data_header_item3}>Number of {MAIN_CURRENCY_COIN}</div>
        <div className={styles.data_header_item3}>Number of NFT</div>
      </div>

      <div className={styles.data_list_wrap}>
        {
          recordList.map((item, index) => (
            <div key={'team-record-key' + index} className={styles.data_item_row}>
              <div className={styles.data_item_col_1}>{item.nickName}</div>
              <div className={styles.data_item_col_2}>{item.inviteeNum}</div>
              {/*<div className={styles.data_item_col_3}>{item.amount / 1000000}USDT</div>*/}
              <div className={styles.data_item_col_3}>{item.amount / 100} {MAIN_CURRENCY_COIN}</div>
              {/*<div className={styles.data_item_col_3}>{item.amountByUsdt / 1_000_000} USDT</div>*/}
              <div className={styles.data_item_col_3}>{item.nftNum ?? 0} NFT</div>
            </div>
          ))
        }
        {
          (!loadingVis && recordList.length === 0) && (
            <div className={styles.no_data_text}>{t('common_no_data')}</div>
          )
        }

      </div>

    </div>
  )
}

export default TeamRecordPage
