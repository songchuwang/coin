import styles from "./index.module.scss"
import {useTranslation} from "react-i18next";
import ImageWidget from "@/components/ImageWidget";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
  APIAssetsInfo,
  APIMiningInfo,
  APINodeDetail, APINodeList,
  APIServiceBuySubmit,
  APIUserInfo, APIWithdrawPackageList
} from "@/api";
import {
  AssetsStateType,
  NodeItemType,
  NodeListReqType, NodeNFTServiceType,
  ServicePackageType,
  ServiceSubmitReqType
} from "@/types";
import {message, Modal} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {formatPriceIfUsdt, formatUnitByCurrency} from "@/utils/textUtils.ts";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {
  resetMiningState, setAssetsState,
  setLevelUpgradeList,
  setLoadingModalVis,
  setMiningData, setNFTBuyHintVis,
  setServicePackageList,
  setUserInfoData
} from "@/redux/actions/home.ts";
import {useSelector} from "react-redux";
import {formatHoursToDay} from "@/utils/timeFormat.ts";
import {numberMFormat} from "@/utils/numFormat.ts";


const NodeBuy = () => {

  const assetsState: AssetsStateType = useSelector((state: any) => state.user.userInfo.assetsState)
  const isOpenBuyHint: boolean = useSelector((state: any) => state.user.userInfo.isOpenBuyHint)
  const servicePackageList: Array<ServicePackageType> = useSelector((state: any) => state.home.pageState.servicePackageList)

  const {t}: { t: (key: string, value?: any) => string }  = useTranslation()
  const navigate = useNavigate()

  const dispatch = useDispatchAction({ setServicePackageList, setLevelUpgradeList, setLoadingModalVis, setUserInfoData, setMiningData, resetMiningState, setAssetsState, setNFTBuyHintVis })

  const [multipleAmount, setMultipleAmount] = useState(1)


  const [nodeDetail, setNodeDetail] = useState<NodeItemType>(null)

  const [serviceDetail, setServiceDetail] = useState<ServicePackageType>(null)

  const [withdrawNFTList, setWithdrawNFTList] = useState<Array<ServicePackageType>>([])

  const [openNFTHintVis, setOpenNFTHintVis] = useState(false)

  const { type, id } = useParams();

  const [nftActivityData, setNFTActivityData] = useState<NodeNFTServiceType>(null)

  const location = useLocation()

  const gotoSearch = () => {
    navigate(`/nodeSearch/${nodeDetail.id}/2`)
  }

  const buyActionSubClick = () => {
    if (multipleAmount < 2) return
    setMultipleAmount((prev) => prev - 1)
  }

  const buyActionAddClick = () => {
    setMultipleAmount((prev) => prev + 1)
  }

  const fetchData = async (nodeId: number, isCallBack: boolean) => {

    if ((type === '1' || type === '3') && !isCallBack) {
      const params: NodeListReqType = {
        pageNo: 1,
        pageSize: 30,
      }
      APINodeList(params).then(resp => {
        if (resp.code === 0) {
          setNodeDetail(resp.data.list[0])
        } else {
          message.error(resp.msg)
        }
      })
    } else {
      APINodeDetail(nodeId).then(resp => {
        if (resp.code === 0) {
          setNodeDetail(resp.data)
        } else {
          message.error(resp.msg)
        }
      })
    }


    // APINodeServiceDetails(nodeId).then(resp => {
    //   if (resp.code === 0) {
    //     setServiceDetail(resp.data)
    //   } else {
    //     message.error(resp.msg)
    //   }
    // })
  }

  const buyServiceSubmit = () => {
    dispatch.setLoadingModalVis(true)
    const reqData: ServiceSubmitReqType = {
      id: serviceDetail.id,
      num: multipleAmount,
      price: serviceDetail.price,
      nodeId: nodeDetail.id
    }
    APIServiceBuySubmit(reqData).then(resp => {
      if (resp.data) {
        message.success(t('common_purchase_success'))
        // setServiceVis(false)
        if (nftActivityData && type === "3" && !isOpenBuyHint) {
          setOpenNFTHintVis(true)
          dispatch.setNFTBuyHintVis(true)
        }
        // fetchServiceList()
        // navigate(-1)
        return APIMiningInfo()
      } else {
        message.error(resp.msg)
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setMiningData(resp.data)
        return APIUserInfo()
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setUserInfoData(resp.data)
        // fetchServiceList()
        return APIAssetsInfo()
      }
    }).then(resp => {
      if (resp && resp.code === 0) {
        dispatch.setAssetsState(resp.data)
      }
    }).finally(() => {
      dispatch.setLoadingModalVis(false)
    })
  }

  // const initNFTInfo = () => {
  //   if (type === '1' || type === '3') {
  //     const nftId = Number(id)
  //     const nftDetails = servicePackageList.filter(key => key.id === nftId)
  //     setServiceDetail(nftDetails[0])
  //     setTimeout(() => {
  //       const nftElement = document.getElementById(`nft-item-id-${nftDetails[0].id}`)
  //       if (nftElement) {
  //         nftElement.scrollIntoView({
  //           behavior: 'smooth',
  //           block: 'center'
  //         })
  //       }
  //     }, 800)
  //   } else {
  //     setServiceDetail(servicePackageList[0])
  //   }
  // }

  const fetchWithdrawServiceList = () => {
    APIWithdrawPackageList().then(resp => {
      if (resp.code === 0) {
        const nftId = Number(id)
        const nftDetails = resp.data.filter(key => key.id === nftId)
        if (nftDetails.length > 0) {
          setServiceDetail(nftDetails[0])
          setWithdrawNFTList(resp.data)
        }

      }
    })
  }

  const onChangeNFTClick = (item: ServicePackageType) => {
    setServiceDetail(item)
  }

  useEffect(() => {
    // if (!servicePackageList.length) {
    //   fetchServiceList()
    // } else {
    //   initNFTInfo()
    // }
    fetchWithdrawServiceList()
  }, [servicePackageList]);

  useEffect(() => {
    console.log("localtion", location)
    if (location.state && location.state.nftData) {
      setNFTActivityData(location.state.nftData)
    }
    const nodeId = localStorage.getItem("searchBack")
    if (!nodeId || nodeId === '0') {
      fetchData(Number(id), false)
    } else {
      fetchData(Number(nodeId), true)
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <span>{t('common_buy')}</span>
      </div>
      {
        (nodeDetail && serviceDetail) ? (
          <div className={styles.content_wrap}>
            <div style={(withdrawNFTList.length === 1 || servicePackageList.length === 1) ? {display: "flex", alignItems: 'center', justifyContent: 'center'} : {}} className={styles.pic_wrap}>
              {
                withdrawNFTList.length === 0 && servicePackageList.map(item => (
                  <div key={'nft-item-key-' + item.id} id={'nft-item-id-' + item.id} onClick={() => onChangeNFTClick(item)} className={`${styles.pic_item_wrap} ${serviceDetail.id === item.id && styles.pic_item_wrap_active}`}>
                    <div className={styles.top_left_border}></div>
                    <div className={styles.bottom_right_border}></div>
                    <div className={styles.img_box}><ImageWidget src={item?.imageUrl ?? ''} /></div>
                    <div className={styles.label_text}>{t('node_buy_nft_badge')}</div>
                  </div>
                ))
              }
              {
                withdrawNFTList.map(item => (
                  <div key={'nft-item-key-' + item.id} id={'nft-withdraw_item-id-' + item.id} onClick={() => onChangeNFTClick(item)} className={`${styles.pic_item_wrap} ${serviceDetail.id === item.id && styles.pic_item_wrap_active}`}>
                    <div className={styles.top_left_border}></div>
                    <div className={styles.bottom_right_border}></div>
                    <div className={styles.img_box}><ImageWidget src={item?.imageUrl ?? ''} /></div>
                    <div className={styles.label_text}>{t('node_buy_nft_badge')}</div>
                  </div>
                ))
              }
            </div>
            <div className={styles.buy_info_content_wrap}>
              <div className={styles.page_hint_text}>{t('nft_buy_hint_text_1')}</div>

              {
                withdrawNFTList.length === 0 && (
                  <div onClick={gotoSearch} className={styles.buy_info_wrap}>
                    <div className={styles.b_i_left_wrap}>
                      <div className={styles.label_left_text}>{t('common_node_up')}</div>
                      <div className={styles.line_box}></div>
                    </div>
                    <div className={styles.b_i_right_wrap}>
                      <div className={styles.import_value_text}>{nodeDetail.name}</div>
                      <div className={styles.right_icon}></div>
                    </div>
                  </div>
                )
              }
              {
                withdrawNFTList.length === 0 && (
                  <div className={styles.buy_info_wrap}>
                    <div className={styles.b_i_left_wrap}>
                      <div className={styles.label_left_text}>{t('common_output')}</div>
                      <div className={styles.line_box}></div>
                    </div>
                    <div className={styles.b_i_right_wrap}>
                      <div className={styles.other_text}>{formatPriceIfUsdt(2, serviceDetail.profit * multipleAmount)} {formatUnitByCurrency(serviceDetail.profitCurrency)}/{t('common_day')}</div>
                    </div>
                  </div>
                )
              }
              {
                withdrawNFTList.length !== 0 && (
                  <div className={styles.buy_info_wrap}>
                    <div className={styles.b_i_left_wrap}>
                      <div style={{whiteSpace: "nowrap"}} className={`${styles.label_left_text} ${styles.label_left_auto_with}`}>Withdraw Limit</div>
                      <div className={styles.line_box}></div>
                    </div>
                    <div className={styles.b_i_right_wrap}>
                      <div className={styles.other_text}>{formatPriceIfUsdt(serviceDetail.profitCurrency, serviceDetail.profit * multipleAmount)} {formatUnitByCurrency(serviceDetail.profitCurrency)}</div>
                    </div>
                  </div>
                )
              }
              {
                withdrawNFTList.length === 0 && (
                  <div className={styles.buy_info_left_right_wrap}>
                    <div className={styles.buy_info_wrap}>
                      <div className={styles.b_i_left_wrap}>
                        <div className={styles.label_left_text}>{t('common_price')}</div>
                        <div className={styles.line_box}></div>
                      </div>
                      <div className={styles.b_i_right_wrap}>
                        <div className={styles.other_text}>{formatPriceIfUsdt(serviceDetail.priceCurrency, serviceDetail.price * multipleAmount)} {formatUnitByCurrency(serviceDetail.priceCurrency)}</div>
                      </div>
                    </div>
                    <div className={styles.left_right_sized}></div>
                    <div className={styles.buy_info_wrap}>
                      <div className={styles.b_i_left_wrap}>
                        <div className={styles.label_left_text}>{t('accelerate_validity')}</div>
                        <div className={styles.line_box}></div>
                      </div>
                      <div className={styles.b_i_right_wrap}>
                        <div className={styles.other_text}>{formatHoursToDay(serviceDetail.validity)} {t('common_day')}</div>
                      </div>
                    </div>
                  </div>
                )
              }
              {
                withdrawNFTList.length !== 0 && (
                  <>
                    <div className={styles.buy_info_wrap}>
                      <div className={styles.b_i_left_wrap}>
                        <div className={styles.label_left_text}>{t('common_price')}</div>
                        <div className={styles.line_box}></div>
                      </div>
                      <div className={styles.b_i_right_wrap}>
                        <div className={styles.other_text}>{formatPriceIfUsdt(serviceDetail.priceCurrency, serviceDetail.price * multipleAmount)} {formatUnitByCurrency(serviceDetail.priceCurrency)}</div>
                      </div>
                    </div>
                    <div className={styles.buy_info_wrap}>
                      <div className={styles.b_i_left_wrap}>
                        <div className={styles.label_left_text}>{t('accelerate_validity')}</div>
                        <div className={styles.line_box}></div>
                      </div>
                      <div className={styles.b_i_right_wrap}>
                        <div className={styles.other_text}>{formatHoursToDay(serviceDetail.validity)} {t('common_day')}</div>
                      </div>
                    </div>
                  </>
                )
              }
              <div className={styles.buy_info_wrap}>
                <div className={styles.b_i_left_wrap}>
                  <div className={styles.label_left_text}>{t('nft_max_count_label')}</div>
                  <div className={styles.line_box}></div>
                </div>
                <div className={styles.b_i_right_wrap}>
                  <div className={styles.other_text}>{t('nft_max_count_value', {count: serviceDetail.maxCount})}</div>
                </div>
              </div>
              <div className={styles.buy_info_wrap}>
                <div className={styles.b_i_left_wrap}>
                  <div className={styles.label_left_text}>{t('common_multiples')}</div>
                  <div className={styles.line_box}></div>
                </div>
                <div className={styles.b_i_right_wrap}>
                  <div onClick={buyActionSubClick} className={styles.sub_icon}></div>
                  <div className={styles.other_text}>{multipleAmount}</div>
                  <div onClick={buyActionAddClick} className={styles.add_icon}></div>
                </div>
              </div>



              <div className={styles.wallet_balance}>{t('node_buy_wallet_balance', {amount: numberMFormat(assetsState.usdt / 1000000)})}</div>

              <div className={styles.button_wrap}>
                <div onClick={buyServiceSubmit} className={`${styles.buy_btn} ${(serviceDetail.price > assetsState.usdt) && styles.buy_btn_inactive}`}><span>{t('common_buy_up')}</span></div>
                <div onClick={() => navigate('/recharge')} className={`${styles.deposit_btn} ${(serviceDetail.price < assetsState.usdt) && styles.buy_btn_inactive}`}><span>{t('wallet_recharge')}</span></div>
              </div>

              <div className={styles.wallet_balance}>{t('node_buy_low_hint')}</div>

            </div>
          </div>
        ) : (
          <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
        )
      }

      <Modal centered footer={null} closeIcon={false} open={openNFTHintVis} onCancel={() => {
        navigate(-1)
        setOpenNFTHintVis(false)
      }}>
        {
          nftActivityData && (
            <div className={styles.modal_content_2}>
              <div className={styles.modal_content_2_box}>
                <div className={styles.m_gen_icon}></div>
                <div className={styles.m_title}>{t('nft_buy_hint_text1')}</div>
                <div className={styles.m_sub_title} dangerouslySetInnerHTML={{__html: t('nft_buy_hint_text2', {amount: nftActivityData.maxCount - nftActivityData.buyNum})}}></div>
                <div onClick={() => setOpenNFTHintVis(false)} className={`${styles.m_w_btn}`}><span>{t('common_go_to_buy')}</span></div>
              </div>
            </div>
          )
        }
      </Modal>

    </div>
  )
}

export default NodeBuy
