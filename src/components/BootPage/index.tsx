import styles from './index.module.scss'
import {Carousel} from "antd";
import {useLayoutEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {addBootId} from "@/redux/actions/home.ts";
import {useSelector} from "react-redux";
import {TGWebAppType} from "@/tools/telegram.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const BootPage = () => {

  const {t}: { t: (key: string, value?: any) => string}  = useTranslation()

  const dispatch = useDispatchAction({addBootId})

  const bootIdList: Array<number> = useSelector((state: any) => state.app.appSetting.bootVisIdList)

  const [current, setCurrent] = useState(0)

  const bootList = [
    // {
    //   title: 'boot_title_1',
    //   subTitle: 'boot_sub_title_1',
    //   img: './img/boot/introduce_1.png',
    //   hintText: 'boot_hint_text_1'
    // },
    // {
    //   title: 'boot_title_2',
    //   subTitle: 'boot_sub_title_2',
    //   img: './img/boot/introduce_2.png',
    //   hintText: 'boot_hint_text_2'
    // },
    // {
    //   title: 'boot_title_3',
    //   subTitle: 'boot_sub_title_3',
    //   img: './img/boot/introduce_3.png',
    //   hintText: 'boot_hint_text_3'
    // },
    // {
    //   title: 'boot_title_4',
    //   subTitle: 'boot_sub_title_4',
    //   img: './img/boot/introduce_4.png',
    //   hintText: 'boot_hint_text_4'
    // },
    {
      title: 'boot_title_5',
      subTitle: 'boot_sub_title_5',
      img: '/img/boot/introduce_5.png',
      hintText: 'boot_hint_text_5'
    },
  ]

  const tgUserIdRef = useRef<number>(0)

  const [bootShow] = useState(true)

  const onAddBootId = () => {
    dispatch.addBootId(tgUserIdRef.current)
  }

  const onChange = (currentSlide: number) => {
    setCurrent(currentSlide + 1)
  };


  useLayoutEffect(() => {
    console.log("list:::", bootIdList, current)
    const webApp = window["Telegram"].WebApp as TGWebAppType
    tgUserIdRef.current = webApp?.initDataUnsafe?.user?.id
  }, []);

  return (
    <div className={`${styles.boot_page} ${!bootShow && styles.init_done}`}>

      <div style={{width: '100%', height: '100vh'}}>
        <Carousel infinite={false} afterChange={onChange}>
          {
            bootList.map((item, index) => (
              <div key={'boot-start-key-' + index}>
                <div className={styles.boot_item}>
                  <div className={styles.top_content_wrap}>
                    <div className={styles.boot_title}>{t(item.title, {currency: MAIN_CURRENCY_COIN})}</div>
                    <div className={styles.boot_sub_title}>{t(item.subTitle, {currency: MAIN_CURRENCY_COIN})}</div>
                  </div>
                  <div className={styles.img_box}>
                    <img src={item.img}/>
                  </div>
                  <div className={styles.boot_hine_text}>{t(item.hintText, {currency: MAIN_CURRENCY_COIN})}</div>

                  <div className={styles.bottom_wrap}>
                    {/*{*/}
                    {/*  current === bootList.length && (*/}
                    {/*    <div onClick={onAddBootId} className={styles.join_us_btn}><span>{t('boot_join_us')}</span></div>*/}
                    {/*  )*/}
                    {/*}*/}
                    <div onClick={onAddBootId} className={styles.join_us_btn}><span>{t('boot_join_us')}</span></div>
                  </div>
                </div>
              </div>
            ))
          }

        </Carousel>
      </div>

    </div>
  )
}

export default BootPage
