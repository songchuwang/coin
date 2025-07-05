import styles from './index.module.scss'
import {useTranslation} from "react-i18next";
import {Input, message} from "antd";
import {APIBindGoogleAuth, APIGoogleAuthCode} from "@/api";
import {useEffect, useState} from "react";
import {GoogleAuthResType} from "@/types";
import {textCopyToClipboard} from "@/utils/textUtils.ts";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setLoadingModalVis} from "@/redux/actions/home.ts";
import {useNavigate} from "react-router-dom";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const SecuritySettingsPage = () => {
  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const navigate = useNavigate()

  const dispatch = useDispatchAction({setLoadingModalVis})

  const [authData, setAuthData] = useState<GoogleAuthResType>({
    hasAuthed: true,
    qrCode: "",
    authToken: "",
    timeout: 0,
    twoFactorCode: "",
  })

  const [code, setCode] = useState<string>(null)

  const fetchGoogleAuth = () => {
    APIGoogleAuthCode().then(resp => {
      if (resp.code === 0) {
        setAuthData(resp.data)
      }
    })
  }

  const onCodeChange = (e) => {
    setCode(e.target.value)
  }

  const onSubmit = () => {
    if (!code) {
      return message.warning(t('security_dialog_text1'))
    }
    if (code.length > 6) {
      return message.warning(t('security_dialog_error_text'))
    }
    dispatch.setLoadingModalVis(true)
    APIBindGoogleAuth({authToken: authData.authToken, inputCode: code}).then(resp => {
      if (resp.data) {
        message.success(t('security_dialog_success_text'))
        navigate(-1)
      } else {
        message.error(t('security_dialog_error_text'))
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  useEffect(() => {
    fetchGoogleAuth()
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <span>{t('security_title')}</span>
      </div>

      <div className={styles.page_hint_text}>
        {t('security_hint_text')}
      </div>

      <div className={styles.content_wrap}>
        <div className={styles.content_title_wrap}>
          <div className={styles.c_t_left}>1.</div>
          <div className={styles.c_t_right}>{t('security_content_title_1')}</div>
        </div>
        <div className={styles.content_action_wrap}>
          <div className={styles.c_a_w_left}></div>
          <div className={styles.c_a_w_right_google}>
            <div className={styles.g_icon}></div>
            <div className={styles.g_text}>{t('security_google_text')}</div>
          </div>
        </div>
        <div className={styles.content_action_wrap}>
          <div className={styles.c_a_w_left}></div>
          <div className={styles.g_hint_text}>{t('security_g_hint_text')}</div>
        </div>
        <div className={styles.content_title_wrap}>
          <div className={styles.c_t_left}>2.</div>
          <div className={styles.c_t_right}>{t('security_content_title_2')}</div>
        </div>
        <div className={styles.content_action_wrap}>
          <div className={styles.c_a_w_left}></div>
          <div className={styles.c_a_w_right_key}>
            <div className={styles.key_text}>{t('common_key')}:</div>
            <div className={styles.key_value}>{authData.twoFactorCode}</div>
            <div onClick={() => textCopyToClipboard(authData.twoFactorCode)} className={styles.copy_btn}><span>{t('common_copy')}</span></div>
          </div>

        </div>
        <div className={styles.content_title_wrap}>
          <div className={styles.c_t_left}>3.</div>
          <div className={styles.c_t_right}>{t('security_content_title_3', {currency: MAIN_CURRENCY_COIN})}</div>
        </div>
        <div className={styles.content_action_wrap}>
          <div className={styles.c_a_w_left}></div>
          <div className={styles.c_a_w_right_input}>
            <Input onChange={onCodeChange} className={styles.input_wrap} placeholder={t('security_input_placeholder')} />
          </div>
        </div>
      </div>

      <div onClick={onSubmit} className={styles.submit_btn}><span>{t('feedback_submit')}</span></div>

    </div>
  )
}

export default SecuritySettingsPage
