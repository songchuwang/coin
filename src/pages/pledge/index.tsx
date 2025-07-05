import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

const Pledge = () => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()
  const navigate = useNavigate()

  const gotoPledgeList = () => {
    navigate('/pledgeList')
  }

  const gotoStakingRecord = () => {
    navigate('/stakingRecord')
  }

  const gotoStakingTeamRecord = () => {
    navigate('/stakingTeamRecord')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('pledge_staking')}</span>
      </div>

      <div className={styles.staking_item_wrap}>
        <div className={styles.staking_item_title}>{t('pledge_personal_staking')}</div>
        <div className={styles.staking_item_hint_text}>{t('pledge_personal_hint_text')}</div>
        <div>
          <Button type={"primary"} onClick={gotoPledgeList} className={styles.active_btn}>{t('pledge_start_staking')}</Button>
        </div>
        <div>
          <Button type={"primary"} onClick={gotoStakingRecord} className={styles.record_btn}>{t('pledge_staking_record')}</Button>
        </div>
      </div>

      <div className={styles.staking_item_wrap}>
        <div className={styles.staking_item_title}>{t('pledge_team_details')}</div>
        <div className={styles.staking_item_hint_text}>{t('pledge_team_hint_text')}</div>
        <div>
          <Button onClick={gotoStakingTeamRecord} type={"primary"} className={styles.active_btn}>{t('pledge_view_details')}</Button>
        </div>
      </div>

    </div>
  )
}
export default Pledge
