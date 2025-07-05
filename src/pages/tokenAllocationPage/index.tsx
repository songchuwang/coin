import styles from './index.module.scss'
const TokenAllocationPage = () => {

  const url = '/hybrid/html/web/viewer.html?file=/static/white_page.pdf'

  return (
    <div className={styles.page}>
      <iframe style={{width: '100%', height: '100%'}} frameBorder={0} src={url} />
    </div>
  )
}

export default TokenAllocationPage
