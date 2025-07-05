import styles from "./index.module.scss"
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, message} from "antd";

const LanguagePage = () => {

  const {t, i18n}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()
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
      key: 'vi',
      icon: '🇻🇳',
      name: 'Việt Nam',
      sortName: 'VN'
    },
    {
      key: 'id',
      icon: '🇮🇩',
      name: 'Indonesia',
      sortName: 'ID'
    },
    {
      key: 'ru',
      icon: '🇷🇺',
      name: 'Россия',
      sortName: 'RU'
    },
    {
      key: 'fr',
      icon: '🇫🇷',
      name: 'Français',
      sortName: 'FR'
    },
    {
      key: 'ar',
      icon: '🇦🇪',
      name: 'عربي',
      sortName: 'AR'
    },
    {
      key: 'fa',
      icon: '🇮🇷',
      name: 'فارسی',
      sortName: 'FA'
    }
  ]

  const onChangeLan = (item) => {
    console.log(item)
    setCurrencyLan(item)
    // i18n.changeLanguage(item.key)
    // localStorage.setItem("language", item.key)
  }

  const confirmClick = () => {
    i18n.changeLanguage(currencyLan.key)
    localStorage.setItem("language", currencyLan.key)
    message.success(t('language_complete'))
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
    <div className={styles.page}>
      <div className={styles.bg_float}></div>
      <div className={styles.header_wrap}><span>{t('language_title')}</span></div>
      <div className={styles.content_wrap}>
        {
          lanList.map((item, index) => (
            <div onClick={() => onChangeLan(item)} key={'language-item-' + index} className={styles.language_item}>
              <span className={styles.text}>{item.name}</span>
              {
                item.key === currencyLan.key && (
                  <div className={styles.select_icon}></div>
                )
              }
            </div>
          ))
        }
      </div>
      <Button htmlType={"submit"} onClick={confirmClick} className={styles.confirm_btn}>{t('common_confirm')}</Button>
    </div>
  )
}

export default LanguagePage
