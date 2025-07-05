import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {jumpHelpLink} from "@/utils/jumpLinkUtils.ts";
import {useSelector} from "react-redux";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const NodeApplyPage = () => {
  const navigate = useNavigate()
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const supportName: string = useSelector((state: any) => state.app.appSetting.supportName)
  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)

  const gotoApplyForm = () => {
    navigate('/nodeApplyForm', {replace: true})
  }

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('node_apply')}</span>
      </div>
      <div className={styles.content_wrap}>
        <div className={styles.apply_content_wrap}>
          <div className={styles.title_wrap}>{t('node_apply_title1')}</div>
          <div className={styles.hint_text_wrap}>{t('node_apply_hint_text1')}</div>
          <div className={styles.hint_text_wrap}>{t('node_apply_hint_text3')}</div>
          <div className={styles.hint_text_wrap}>{t('node_apply_hint_text4')}</div>

          <div className={styles.title_wrap}>{t('node_apply_title2')}</div>
          <div className={styles.hint_text_wrap}>{t('node_apply_hint_text2', {currency: MAIN_CURRENCY_COIN})}</div>
          {
            userInfoData.rechargeAmount > 0 && (
              <div onClick={() => jumpHelpLink(supportName)} className={styles.help_box_wrap}>
                <div className={styles.help_icon}></div>
                <div className={styles.help_text}>Get Help：@{supportName}</div>
              </div>
            )
          }

        </div>

        <div className={styles.node_hint_box}>

          <div className={styles.left_hint_wrap}>
            <div className={styles.left_title_text}>{t('node_apply_normal_node')}</div>
            <div className={styles.left_hint_text}>{t('node_apply_normal_node_hint_1')}</div>
            <div className={styles.left_hint_text}>{t('node_apply_normal_node_hint_2')}</div>
          </div>
          <div className={styles.right_hint_wrap}>
            <div className={styles.right_title_text}>{t('node_apply_super_node_rights')}</div>
            <div className={styles.right_hint_text}>{t('node_apply_normal_node_hint_3')}</div>
            <div className={styles.right_hint_text}>{t('node_apply_normal_node_hint_4')}</div>
            <div className={styles.right_hint_text}>{t('node_apply_normal_node_hint_5')}</div>
            <div className={styles.right_hint_text}>{t('node_apply_normal_node_hint_6')}</div>
            <div className={styles.right_hint_text}>{t('node_apply_normal_node_hint_7')}</div>
          </div>

        </div>



      </div>
      <div className={styles.sized_box}></div>
      <div className={styles.bottom_wrap}>
        <div onClick={gotoApplyForm} className={styles.apply_btn}><span>{t('node_apply_for_btn')}</span></div>
      </div>
    </div>
  )
}

export default NodeApplyPage
