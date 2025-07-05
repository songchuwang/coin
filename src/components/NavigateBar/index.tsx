import styles from "./index.module.scss"
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Lottie from "react-lottie";
import tabRocketAnimation from "@/assets/animation/tabRocketAnimation.json";

const NavigateBar = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()



  const [tabIndex, setTabIndex] = useState(0)

  const whitePath = ['/', '/accelerate', '/minister', '/teamPage']

  const lottieTabRocketOptions = {
    loop: true,
    autoplay: true,
    animationData: tabRocketAnimation,
  }

  const navigateList = [
    {
      key: 0,
      name: 'tab_home',
      icon: './img/tab/tab_home.png',
      iconAc: './img/tab/tab_home_ac.png',
      path: '/',
      component: null,
    },
    // {
    //   key: 1,
    //   name: 'tab_rank',
    //   icon: './img/tab/tab_rank.png',
    //   iconAc: './img/tab/tab_rank_ac.png',
    //   path: '/function',
    //   component: null
    // },
    {
      key: 2,
      name: 'tab_accelerate',
      icon: './img/tab/tab_accelerate.png',
      iconAc: './img/tab/tab_accelerate_ac.png',
      path: '/accelerate',
      component: (
        <Lottie
          options={lottieTabRocketOptions}
          isClickToPauseDisabled={true}
        />
      )
    },
    // {
    //   key: 3,
    //   name: 'tab_activity',
    //   icon: './img/tab/tab_activity.png',
    //   iconAc: './img/tab/tab_activity_ac.png',
    //   path: '/activity'
    // },
    // {
    //   key: 6,
    //   name: 'me_node',
    //   icon: './img/tab/tab_node.png',
    //   iconAc: './img/tab/tab_node_ac.png',
    //   path: '/nodeList'
    // },
    {
      key: 5,
      // name: 'Team',
      name: 'earn_earn',
      // icon: './img/tab/tab_team.png',
      // iconAc: './img/tab/tab_team_ac.png',
      icon: './img/tab/tab_earn.png',
      iconAc: './img/tab/tab_earn_ac.png',
      path: '/teamPage',
      component: null
    },
    {
      key: 4,
      name: 'tab_minister',
      icon: './img/tab/tab_wallet.png',
      iconAc: './img/tab/tab_wallet_ac.png',
      path: '/minister',
      component: null
    },
  ]

  const navigate = useNavigate()
  const location = useLocation()

  const gotoPage = (path: string) => {
    navigate(path, {replace: true})
  }

  useEffect(() => {
    const f_navigateList = navigateList.filter(key => key.path === location.pathname)
    if (f_navigateList.length > 0) {
      setTabIndex(f_navigateList[0].key)
    }
  }, [location]);

  return whitePath.includes(location.pathname) && (
    <div className={styles.navigate_wrap}>
      {
        navigateList.map((item, index) => (
          <div onClick={() => gotoPage(item.path)} key={'navigate-' + index} className={`${styles.navigate_item} ${tabIndex === item.key && styles.navigate_item_active}`}>
            {
              item.component ? (
                <div className={styles.navigate_an_icon}>
                  <Lottie
                    options={lottieTabRocketOptions}
                    isClickToPauseDisabled={true}
                  />
                </div>
              ) : (
                <img className={styles.navigate_icon} src={tabIndex === item.key ? item.iconAc : item.icon} />
              )
            }

            <span className={styles.navigate_text}>{t(item.name)}</span>
          </div>
        ))
      }

    </div>
  )
}

export default NavigateBar
