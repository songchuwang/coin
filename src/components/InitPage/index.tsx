import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const InitPage = ({ loading = false, progress = 0}) => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()
  return (
    <div className={`${styles.init_page} ${!loading && styles.init_done}`}>
      <div className={styles.content_wrapper}>
        <div className={styles.top_wrap}>
          <div className={styles.logo_img}></div>
          <div className={styles.hint_text}>{t('init_hint_text', {currency: MAIN_CURRENCY_COIN})}</div>
        </div>
        <div className={styles.progress_bar_box}>
          <div style={{width: `${progress}%`}} className={styles.progress_active}></div>
        </div>
      </div>
    </div>
  )
}

export default InitPage
