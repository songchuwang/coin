import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import ImageWidget from "@/components/ImageWidget";
import {useNavigate} from "react-router-dom";
import {Button, Input, InputNumber, message, Modal} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {APIAssetsInfo, APIConfirmStaking, APINodeHasStats, APINodeList, APINodePledgeDetails, APINodeStats} from "@/api";
import {
  AssetsStateType,
  ConfirmNodePledgeType,
  hasStatsType,
  NodeItemType,
  NodeListReqType,
  NodePledgeDetail, NodeStatsType
} from "@/types";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {numberFormatToEnglish, numberKMFormat, numberMFormat} from "@/utils/numFormat.ts";
import {useSelector} from "react-redux";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setAssetsState, setLoadingModalVis, setNodeList, setNodeState, setNodeHasStats} from "@/redux/actions/home.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const NodeList = () => {

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()

  const dispatch = useDispatchAction({setLoadingModalVis, setAssetsState, setNodeList, setNodeState, setNodeHasStats})

  const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)
  const nodeList: Array<NodeItemType> = useSelector((state: any) => state.home.pageState.nodeList)
  const nodeState: NodeStatsType = useSelector((state: any) => state.home.pageState.nodeState)
  const nodeHasStats: hasStatsType = useSelector((state: any) => state.home.pageState.nodeHasStats)
  const navigate = useNavigate()
  const listLoadingRef = useRef(false)

  const [loadingStatus, setLoadingStatus] = useState(0)

  const listParamsRef = useRef({
    current: 1,
    size: 35
  })

  // const [dataList, setDataList] = useState<Array<NodeItemType>>([])

  const [pledgeVis, setPledgeVis] = useState(false)

  const [pledgeDetails, setPledgeDetails] = useState<NodePledgeDetail>(null)

  const [pledgeAmount, setPledgeAmount] = useState<any>(null)

  // const [nodeStatsData, setNodeStatsData] = useState<NodeStatsType>(null)

  const [searchValue, setSearchValue] = useState<string>(null)

  const observerRef = useRef<IntersectionObserver>(null)

  const dataListRef = useRef<Array<NodeItemType>>([])

  const gotoRecord = () => {
    // navigate('/nodeRecord')
    navigate('/nodeApplyPage')
  }

  const gotoIncome = () => {
    navigate(`/nodeIncome/${nodeHasStats?.nodeId}`);
  }

  const gotoBuy = (id: number) => {
    localStorage.setItem('searchBack', '0')
    navigate('/nodeBuy/2/' + id)
  }

  // const gotoSearch = () => {
  //   navigate('/nodeSearch/0/1')
  // }

  const setGENAmount = (e) => {
    console.log(e)
    setPledgeAmount(e)
  }

  const onNodeConfirmPledge = () => {
    if (!pledgeAmount) {
      return message.warning(t('pledge_modal_fill_in_hint'))
    }
    if (pledgeAmount > assetsState.usdn) {
      return message.warning(t('withdraw_insufficient_balance'))
    }
    dispatch.setLoadingModalVis(true)
    const confirmParams: ConfirmNodePledgeType = {
      financeId: pledgeDetails.id,
      nodeId: pledgeDetails.nodeId,
      amount: pledgeAmount * 100
    }
    APIConfirmStaking(confirmParams).then(resp => {
      if (resp.data) {
        message.success(t('common_operation_successful'))
        setPledgeVis(false)
        return fetchListDataNotLoading()
      } else {
        message.error(resp.msg)
      }
    }).then(() => {
      return APIAssetsInfo()
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setAssetsState(resp.data)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  const fetchListDataNotLoading = async() => {
    listParamsRef.current.current = 1
    await fetchData()
  }

  const onJumpTGLink = (link: string) => {
    const webapp = getTelegramWebApp()
    webapp.openTelegramLink(link)
  }

  const onChangeSearch = (e) => {
    setSearchValue(e.target.value)
  }

  const fetchDetailData = (id: number, nodeName: string) => {
    setPledgeVis(true)
    setPledgeDetails(null)
    setPledgeAmount(null)
    APINodePledgeDetails(id).then(resp => {
      if (resp.code === 0) {
        setPledgeDetails({
          ...resp.data,
          nodeId: id,
          nodeName: nodeName
        })
      } else {
        message.error(resp.msg)
      }
    })
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
        // let nowList = nodeList
        if (params.pageNo === 1) {
          nowList = []
        }
        nowList = nowList.concat(resp.data.list)
        dataListRef.current = nowList
        // setDataList(nowList)
        dispatch.setNodeList(nowList)
        if ((params.pageNo * params.pageSize) >= resp.data.total) {
          setLoadingStatus(2)
        }
        listParamsRef.current.current += 1
      } else {
        message.error(resp.msg)
      }
    }).finally(() => {
      setTimeout(() => {
        listLoadingRef.current = false
      }, 500)
    })
  }

  const initLoading = () => {
    observerRef.current = new IntersectionObserver(() => {
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
      observerRef.current.observe(loadingMore)
    }
  }

  const fetchStatsData = () => {
    APINodeStats().then(resp => {
      console.log('fetchStatsData resp', resp)
      if (resp.code === 0) {
        dispatch.setNodeState(resp.data)
        // setNodeStatsData(resp.data)
      } else {
        message.error(resp.msg)
      }
    })
  }

  const checkHasStats = () => {
    APINodeHasStats().then(resp=> {
      console.log('checkHasStats resp', resp);
      if (resp.code === 0) {
        const nodeHasStats = {
          nodeId: resp.data || null,  // 如果 data 为 0 或其他 falsy 值，设为 null
          status: !!resp.data         // 转换为布尔值
        };
        dispatch.setNodeHasStats(nodeHasStats);
      } else {
        message.error(resp.msg);
        dispatch.setNodeHasStats({ nodeId: null, status: false });
      }
    }).catch(error => {
      console.error('checkHasStats error:', error);
      dispatch.setNodeHasStats({ nodeId: null, status: false });
    });
  };

  const onSearchClick = () => {
    listParamsRef.current.current = 1
    fetchData()
    setLoadingStatus(0)
    dispatch.setNodeList([])
    // setDataList([])
    // fetchData()
  }

  useEffect(() => {
    // dataListRef.current = nodeList
    fetchStatsData()
    checkHasStats();
  }, []);

  useEffect(() => {
    if (loadingStatus === 0) {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      initLoading()
    }

  }, [loadingStatus]);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <div className={styles.header_title}>{t('me_node')}</div>
        {nodeHasStats?.status && nodeHasStats.nodeId && (
          <div className={styles.header_left_wrap}>
            <div onClick={gotoIncome} className={styles.record_btn}>
              <span>{t('node_incoming')}</span>
            </div>
          </div>
        )}
        <div className={styles.header_right_wrap}>
          <div onClick={gotoRecord} className={styles.record_btn}>
            <span>{t('node_apply')}</span>
          </div>
        </div>
      </div>
      <div className={styles.content_wrap}>
        <div className={styles.pool_info_wrap}>
          <div className={styles.pool_info_left_wrap}>
            <div className={styles.pool_info_label}>{t('node_list_total_pledged', {currency: MAIN_CURRENCY_COIN})}</div>
            <div className={styles.number_info_wrap}>
              <div className={styles.gen_icon}></div>
              <div className={styles.number_amount}>{nodeState?.pledgeGenAll ? nodeState?.pledgeGenAll/100 : '--'}</div>
            </div>
          </div>
          <div className={styles.line_wrap}></div>
          <div className={styles.pool_info_left_wrap}>
            <div className={styles.pool_info_label}>{t('node_list_super_node_pool')}</div>
            <div className={styles.number_info_wrap}>
              <div className={styles.number_amount}>{nodeState?.superNodeCount ?? '--'}</div>
            </div>
          </div>
        </div>
        <div className={styles.search_wrap}>
          {/*<div className={styles.search_icon}></div>*/}
          {/*<div className={styles.search_btn}><span>{t('common_search')}</span></div>*/}
          <div className={styles.search_input}>
            <Input onChange={onChangeSearch} addonBefore={<div className={styles.search_icon}></div>} addonAfter={<div onClick={onSearchClick} className={styles.search_btn}><span>{t('common_search')}</span></div>} className={styles.text_input_wrap} placeholder={'Search Node'} />
          </div>
        </div>

        <div className={styles.node_list_box}>
          <div className={styles.node_list_wrap}>
            {
              nodeList.map((item, index) => (
                <div key={'node-item-key-' + item.id} className={styles.node_item_wrap}>
                  <div className={styles.node_item_header}>
                    <div className={styles.n_i_h_tag}><span>{index + 1}</span></div>
                    <div className={styles.n_i_h_name}>{item.name}</div>
                    {
                      item.type === 1 && (
                        <div className={styles.n_i_h_type_normal}><span>{t('node_list_normal_node')}</span></div>
                      )
                    }
                    {
                      item.type === 2 && (
                        <div className={`${styles.n_i_h_type_normal} ${styles.n_i_h_type_super}`}><span>{t('node_list_super_node')}</span></div>
                      )
                    }
                  </div>
                  <div className={styles.node_item_info_wrap}>
                    <div className={styles.n_i_i_left}>
                      <div className={styles.header_img}><ImageWidget src={item.img} /></div>
                      <div className={styles.amount_info}>
                        <div className={styles.amount_info_text}>{t('node_list_amount_total', {amount: numberKMFormat(item.pledgeNum / 100)})}</div>
                        <div className={styles.amount_info_text}>NFT：{item.nftNum / 1_000_000}</div>
                      </div>
                    </div>
                    <div className={styles.n_i_i_right}>
                      <div onClick={() => fetchDetailData(item.id, item.name)} className={styles.pldege_btn}><span>{t('common_pldege')}</span></div>
                      <div onClick={() => gotoBuy(item.id)} className={styles.buy_btn}><span>{t('common_buy')}</span></div>
                    </div>
                  </div>
                  <div className={styles.node_item_line}></div>
                  <div className={styles.node_item_bottom_wrap}>
                    <div className={styles.manifest_info}><div className={styles.manifest_text}>{t('node_list_manifest')}：{item.manifesto}</div></div>
                    <div onClick={() => onJumpTGLink(item.link)} className={styles.groupid_wrap}>
                      <span>{t('node_list_groupid')}</span>
                      <div className={styles.right_icon}></div>
                    </div>
                  </div>
                </div>
              ))
            }
            {
              loadingStatus !== 2 && (
                <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
              )
            }
            <div className={styles.sized_bottom_box}></div>
          </div>
        </div>
      </div>

      <Modal centered footer={null} closeIcon={false} open={pledgeVis} onCancel={() => setPledgeVis(false)}>

        <div className={styles.modal_content}>
          {
            pledgeDetails ? (
              <>
                <div className={styles.modal_title}>{t('node_list_get_more_income')}</div>
                <div className={styles.line_wrap}></div>
                {/*<div className={styles.info_wrap}>*/}
                {/*  <div className={styles.info_label}>Node</div>*/}
                {/*  <div className={styles.info_value_p}>name</div>*/}
                {/*</div>*/}
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('common_node')}</div>
                  <div className={styles.info_value_common_text}>{pledgeDetails.nodeName}</div>
                </div>
                <div className={styles.input_box}>
                  <InputNumber
                    inputMode="decimal"
                    placeholder={t('node_list_pledge_input_placeholder', {currency: MAIN_CURRENCY_COIN})} value={pledgeAmount} onChange={(e) => setGENAmount(e)} min={1} className={styles.input_wrap} addonAfter={<div></div>} />
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('node_list_available_quantity')}</div>
                  <div className={styles.info_value_common_text}>{numberKMFormat(assetsState.usdn)} {MAIN_CURRENCY_COIN}</div>
                </div>

                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('common_day')}</div>
                  <div className={styles.info_value_common_text}>{numberFormatToEnglish(pledgeDetails.hours / 24, 2)}</div>
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('pledge_modal_daily_interest_rate')}</div>
                  <div className={styles.info_value_p}>{pledgeDetails.dailyRatioStr}</div>
                </div>
                <div className={styles.info_wrap}>
                  <div className={styles.info_label}>{t('node_list_expectd_return_income')}</div>
                  <div className={styles.info_value_common_text}>{pledgeAmount ? numberMFormat(pledgeAmount * (pledgeDetails.dailyRatio / 10000 * pledgeDetails.hours / 24)) : 0} {MAIN_CURRENCY_COIN}</div>
                </div>

                <div style={{width: '100%'}}>
                  <Button onClick={onNodeConfirmPledge} type={"primary"} className={styles.active_btn}>{t('common_pldege')}</Button>
                </div>
              </>
            ) : (
              <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
            )
          }
        </div>
      </Modal>

    </div>
  )
}

export default NodeList
