import styles from "./index.module.scss"
import {QRCodeSVG} from "qrcode.react";
import {textCopyToClipboard} from "@/utils/textUtils.ts";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {Skeleton} from "antd";
import {WalletAddressDataType} from "@/types";
import {APIWalletAddressData} from "@/api";
import {useNavigate} from "react-router-dom";

const Recharge = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const [loading, setLoading] = useState(true)

  const [walletInfo, setWalletInfo] = useState<WalletAddressDataType>()

  const navigate = useNavigate()

  const fetchData = () => {
    setLoading(true)
    APIWalletAddressData().then(resp => {
      if (resp.code === 0) {
        setWalletInfo(resp.data)
        setLoading(false)
      }
    })
  }

  const gotoRecord = () => {
    navigate('/rechargeRecord')
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div className={styles.page}>

      <div className={styles.header_wrap}>
        <div className={styles.header_left_wrap}>
          <div className={styles.coin_icon}></div>
          <span className={styles.gen_text}>{t('recharge_recharge')}</span>
        </div>
        <div className={styles.header_right_wrap}>
          <div onClick={gotoRecord} className={styles.record_btn}>
            <span>{t('withdraw_record')}</span>
          </div>
        </div>
      </div>

      <div className={styles.hint_text}>{t('recharge_currency_receiving_address')}</div>
      <div className={styles.qr_code_wrap}>
        {
          loading ? (
            <div style={{background: "unset"}} className={styles.qr_code_box}>
              <Skeleton.Button style={{width: 160, height: 160}} block={true} active />
            </div>
          ) : (
            <div className={styles.qr_code_box}>
              <QRCodeSVG
                value={walletInfo.address}
                size={160}           // 二维码大小
                bgColor="#ffffff"    // 背景颜色
                fgColor="#000000"    // 前景颜色
                level="H"      // 容错级别
                imageSettings={{
                  src: './img/usdt_icon.png',
                  width: 27,
                  height: 27,
                  excavate: true
                }}
              />

            </div>
          )
        }
      </div>

      <div className={styles.recharge_wrap}>

        <div className={styles.top_wrap}>
          <div className={styles.addres_wrap}>
            {
              loading ? (
                <Skeleton.Button style={{width: '100%', height: "100%"}} block={true} active />
              ) : (
                <span className={styles.address_text}>{walletInfo.address}</span>
              )
            }
          </div>
          <div onClick={() => textCopyToClipboard(walletInfo && walletInfo.address)} className={styles.copy_btn}>
            <span>{t('recharge_copy')}</span>
          </div>
        </div>

        <div className={styles.hint_wrap}>
          {t('recharge_hint_text')}
        </div>

      </div>

      <div className={styles.recharge_c_btn}>
        <span>{t('recharge_recharge_completed')}</span>
      </div>

    </div>
  )
}

export default Recharge
