import styles from "./index.module.scss"
import {useSelector} from "react-redux";

const LoadingModal = () => {

  const loadingVis = useSelector((state: any) => state.home.loadingModal.loading)

  return (
    <div className={`${styles.loading_box} ${!loadingVis && styles.loading_box_done}`}>
      <div className={styles.loading_bg}>
        <div className={styles.loading_wrap}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingModal
