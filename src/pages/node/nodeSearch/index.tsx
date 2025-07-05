import styles from "./index.module.scss"
import {Button, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {NodeItemType, NodeListReqType} from "@/types";
import {APINodeList} from "@/api";
import {LoadingOutlined} from "@ant-design/icons";

const NodeSearch = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const { id, type } = useParams();

  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)

  const listParamsRef = useRef({
    current: 1,
    size: 35
  })

  const navigate = useNavigate()

  const [selectIndex, setSelectIndex] = useState(1)

  const [dataList, setDataList] = useState<Array<NodeItemType>>([])

  const dataListRef = useRef<Array<NodeItemType>>([])

  const [searchValue, setSearchValue] = useState<string>(null)

  const onChangeSearch = (e) => {
    setSearchValue(e.target.value)
  }

  const onSearchClick = () => {
    listParamsRef.current.current = 1
    fetchData()
    setLoadingStatus(0)
    setDataList([])
    // fetchData()
  }

  const onConfirmClick = () => {
    if (type === "2") {
      localStorage.setItem('searchBack', selectIndex.toString())
      navigate(-1 as any, {state: {nodeId: selectIndex}})
    } else {
      localStorage.setItem('searchBack', '0')
      navigate('/nodeBuy/' + selectIndex, {replace: true})
    }

  }

  const fetchData = () => {
    if (listLoadingRef.current) return
    listLoadingRef.current = true
    const params: NodeListReqType = {
      pageNo: listParamsRef.current.current,
      pageSize: listParamsRef.current.size,
      name: searchValue
    }
    APINodeList(params).then(resp => {
      if (resp.code === 0) {
        if (resp.data.list.length <= 0) {
          setLoadingStatus(2)
          return
        }
        let nowList = dataListRef.current
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data.list)
        setDataList(nowList)
        dataListRef.current = nowList
        if ((params.pageNo * params.pageSize) >= resp.data.list.length) {
          setLoadingStatus(2)
        }
        listParamsRef.current.current += 1
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      listLoadingRef.current = false
    })
  }

  const initLoading = () => {
    const ob = new IntersectionObserver(() => {
      if (!listLoadingRef.current) {
        // console.log('执行了')
        fetchData()
      }
    }, {
      rootMargin: '0px',
      threshold: 0.5
    })
    const loadingMore = document.getElementById("moreLoading")
    if (loadingMore) {
      ob.observe(loadingMore)
    }
  }

  useEffect(() => {
    initLoading()
  }, []);

  useEffect(() => {

    setSelectIndex(Number(id))
  }, [id, type]);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('common_node_list')}</span>
      </div>

      <div className={styles.content_wrap}>

        <div className={styles.search_input}>
          <Input onChange={onChangeSearch} addonBefore={<div className={styles.search_icon}></div>} addonAfter={<div onClick={onSearchClick} className={styles.search_btn}><span>{t('common_search')}</span></div>} className={styles.text_input_wrap} placeholder={'Search Node'} />
        </div>

        <div className={styles.search_list}>
          <div className={styles.search_list_wrap}>
            {
              dataList.map((item) => (
                <div key={'search_item-key' + item.id} className={styles.search_item_wrap}>
                  <div onClick={() => setSelectIndex(item.id)} className={styles.search_item}>
                    <div className={styles.node_name}>{item.name}</div>
                    <div>
                      {
                        selectIndex === item.id && (<div className={styles.node_check_icon}></div>)
                      }
                    </div>
                  </div>
                  <div className={styles.line_wrap}></div>
                </div>
              ))
            }
            <div className={styles.sized_box}></div>
          </div>
          {
            loadingStatus !== 2 && (
              <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
            )
          }

        </div>

      </div>

      <div className={styles.bottom_wrap}>
        <Button onClick={onConfirmClick} className={styles.submit_btn}><span>{t('common_confirm')}</span></Button>
      </div>

    </div>
  )
}

export default NodeSearch
