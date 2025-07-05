import {Image, Skeleton} from "antd";
import {useState} from "react";
import styles from "./index.module.scss"

const ImageWidget = (props: {src: string}) => {

  const [isLoad, setIsLoad] = useState(false)

  const onImageLoad = () => {
    console.log('加载成功')
    setIsLoad(true)
  }


  return (
    <div className={styles.image_wrap}>
      <div style={{opacity: isLoad ? 1 : 0}} onLoad={onImageLoad} className={styles.image_box}>
        <Image preview={false} src={props.src} />
      </div>
      {
        !isLoad && (
          <div className={styles.skeleton_box}><Skeleton.Button style={{width: '100%', height: '100%'}} block={true} active /> </div>
        )
      }
    </div>
  )
}

export default ImageWidget
