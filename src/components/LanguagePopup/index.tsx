import styles from './index.module.scss'
import {Popup} from "antd-mobile";
import {useEffect, useState} from "react";
import {CheckOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

const LanguagePopup = () => {

  const {t, i18n}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()
  const [open, setOpen] = useState(false)
  const [currencyLan, setCurrencyLan] = useState({
    key: 'en',
    icon: '🇬🇧',
    name: 'English',
    sortName: 'EN'
  })

  const lanList = [
    {
      key: 'en',
      icon: '🇬🇧',
      name: 'English',
      sortName: 'EN'
    },
    {
      key: 'id',
      icon: '🇮🇩',
      name: 'Indonesia',
      sortName: 'ID'
    },
    {
      key: 'ar',
      icon: '🇦🇪',
      name: 'عربي',
      sortName: 'AR'
    },
    {
      key: 'fr',
      icon: '🇫🇷',
      name: 'Français',
      sortName: 'FR'
    },
    {
      key: 'sp',
      icon: '🇪🇸',
      name: 'Español',
      sortName: 'SP'
    },
    {
      key: 'vi',
      icon: '🇻🇳',
      name: 'Việt Nam',
      sortName: 'VI'
    }

  ]

  const onChangeLan = (item) => {
    console.log(item)
    setCurrencyLan(item)
    i18n.changeLanguage(item.key)
    localStorage.setItem("language", item.key)
  }

  const onModalCloseHandle = () => {
    setOpen(false)
  }

  const initLan = () => {
    const curLan = localStorage.getItem("language")
    const fLan = lanList.filter(key => key.key === curLan)
    if (fLan.length > 0) {
      setCurrencyLan(fLan[0])
    }
  }

  useEffect(() => {
    initLan()
  }, []);

  return (
    <>
      <div onClick={() => setOpen(true)} className={styles.language_wrap}>
        <div className={styles.country_icon}>{currencyLan.icon}</div>
        <div className={styles.country_name}>{currencyLan.sortName}</div>
      </div>
      <Popup visible={open} onMaskClick={onModalCloseHandle} className={styles.popup_sty} onClose={onModalCloseHandle}>
        <div className={styles.popup_content}>
          <div className={styles.popup_title}>{t('common_language')}</div>
          <div className={styles.language_list}>
            {
              lanList.map((item, index) => (
                <div onClick={() => onChangeLan(item)} key={'lan-item-' + index} className={`${styles.language_item} ${currencyLan.key === item.key && styles.language_item_active}`}>
                  <div className={styles.left_wrap}>
                    <div className={styles.icon}>{item.icon}</div>
                    <div className={styles.name}>{item.name}</div>
                  </div>
                  <div className={styles.right_wrap}>
                    {
                      currencyLan.key === item.key && (<CheckOutlined />)
                    }
                  </div>
                </div>
              ))
            }

          </div>
        </div>
      </Popup>
    </>
  )

}

export default LanguagePopup
