import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {QRCodeSVG} from "qrcode.react";
import {textCopyToClipboard} from "@/utils/textUtils.ts";
import {useSelector} from "react-redux";
// import {TG_BASE_URL} from "@/config/appConfig.ts";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const InvitePage = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  // const referralCode: string = useSelector((state: any) => state.user.userInfo.referralCode)
  const inviteUrl: string = useSelector((state: any) => state.user.userInfo.inviteUrl)

  // const [inviteUrl, setInviteUrl] = useState('')

  const onInviteClick = () => {
    const shareUrl = `https://t.me/share/url?url=${inviteUrl}&text=${encodeURIComponent(`Join ${MAIN_CURRENCY_COIN} now, easily obtain ${MAIN_CURRENCY_COIN} tokens and start your asset appreciation journey!`)}`
    const webApp = getTelegramWebApp()
    webApp.openTelegramLink(shareUrl)
  }

  useEffect(() => {
    // setInviteUrl(`${TG_BASE_URL}?start=ref_${referralCode}`)
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('invite_invite')}</span>
      </div>

      <div className={styles.page_title}>{t('invite_title')}</div>
      <div className={styles.page_hint_text}>{t('invite_hint_text')}</div>

      <div className={styles.qr_code_wrap}>

        <div className={styles.qr_code_box}>
          <QRCodeSVG
            value={inviteUrl}
            size={160}           // 二维码大小
            bgColor="#ffffff"    // 背景颜色
            fgColor="#000000"    // 前景颜色
            level="H"      // 容错级别
          />

        </div>
      </div>

      <div className={styles.invite_url_wrap}>
        <div className={styles.invite_url_text}>{inviteUrl}</div>
        <div onClick={() => textCopyToClipboard(inviteUrl)} className={styles.copy_btn}>{t('common_copy')}</div>
      </div>

      <div onClick={onInviteClick} className={styles.invite_btn}>{t('common_invite_a_friend')}</div>
    </div>
  )
}

export default InvitePage
