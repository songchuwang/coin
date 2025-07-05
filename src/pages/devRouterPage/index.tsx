import styles from './index.module.scss'
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const DevRouterPage = () => {
  return (
    <div className={styles.page}>

      <h1>Genesis Roadmap</h1>

      <ul>
        <li><strong>October 2024:</strong> Begin testing phase, gradually refining system functionalities.</li>
        <li><strong>November 2024:</strong> Launch initial version with a focus on community building and cultural development, attracting early users.</li>
        <li><strong>December 2024:</strong> User base exceeds 1 million as the community expands and user engagement grows.</li>
        <li><strong>January 2025:</strong> Officially open {MAIN_CURRENCY_COIN} & USDT trading, enhancing liquidity.</li>
        <li><strong>February 2025:</strong> Launch P2P trading, empowering users with decentralized trading options.</li>
        <li><strong>March 2025:</strong> List on exchanges, entering the global market and expanding project reach.</li>
      </ul>
    </div>
  )
}

export default DevRouterPage
