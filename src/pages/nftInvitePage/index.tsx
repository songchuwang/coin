import styles from './index.module.scss'
import {useTranslation} from "react-i18next";
import ImageWidget from "@/components/ImageWidget";
import {formatPriceIfUsdt, formatUnitByCurrency, textCopyToClipboard} from "@/utils/textUtils.ts";
import {formatHoursToDay} from "@/utils/timeFormat.ts";
import {useEffect, useState} from "react";
import {NodeNFTServiceType} from "@/types";
import {getTelegramWebApp} from "@/tools/telegram.ts";
import {useSelector} from "react-redux";
import {LoadingOutlined} from "@ant-design/icons";
import {APIHomeNFTInviteLink, APIMiningActivityInviteLink, APIMiningActivityList, APINFTActivityList} from "@/api";
import useDispatchAction from "@/hooks/useDispatchAction.ts";
import {setHomeActivityNFTData} from "@/redux/actions/home.ts";
import {useParams} from "react-router-dom";
import {Modal} from "antd";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

const NFTInvitePage = () => {
  const {t, i18n}: { t: (key: string, value?: any) => string, i18n: any }  = useTranslation()

  const { type, nftId } = useParams();
  const dispatch = useDispatchAction({ setHomeActivityNFTData })

  // const inviteUrl: string = useSelector((state: any) => state.user.userInfo.inviteUrl)

  const [inviteUrl, setInviteUrl] = useState('')

  const activityNFTDataList: Array<NodeNFTServiceType> = useSelector((state: any) => state.home.pageState.homeActivityNFTData)

  const [activityNFTData, setActivityNFTData] = useState<NodeNFTServiceType>(null)

  const [instructionVis, setInstructionVis] = useState(false)

  const onInviteClick = () => {
    const shareUrl = `https://t.me/share/url?url=${inviteUrl}&text=${encodeURIComponent(`Join ${MAIN_CURRENCY_COIN} now, easily obtain ${MAIN_CURRENCY_COIN} tokens and start your asset appreciation journey!`)}`
    const webApp = getTelegramWebApp()
    webApp.openTelegramLink(shareUrl)
  }

  const fetchNFTActivity = () => {
    APINFTActivityList().then(resp => {
      if (resp.code === 0 && resp.data) {
        dispatch.setHomeActivityNFTData(resp.data)
      }
    })
  }

  const fetchNFTInviteUrl = () => {
    if (type === '1') {
      APIHomeNFTInviteLink().then(resp => {
        if (resp.code === 0) {
          setInviteUrl(resp.data.url)
        }
      })
    } else if (type === '2') {
      APIMiningActivityInviteLink(nftId).then(resp => {
        if (resp.code === 0) {
          setInviteUrl(resp.data.url)
        }
      })
      APIMiningActivityList().then(resp => {
        if (resp.code === 0) {
          const nftIdNumber = Number(nftId)
          const filterNFT = resp.data.filter(key => key.id === nftIdNumber)
          if (filterNFT.length) {
            setActivityNFTData(filterNFT[0])
          }
        }
      })
    }

  }

  useEffect(() => {
    fetchNFTInviteUrl()
  }, []);

  useEffect(() => {
    if (type === '2') return
    if (activityNFTDataList.length) {
      try {
        const nftIdNumber = Number(nftId)
        const filterNFT = activityNFTDataList.filter(key => key.id === nftIdNumber)
        if (filterNFT.length) {
          setActivityNFTData(filterNFT[0])
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [activityNFTDataList]);

  useEffect(() => {
    if (type === '2') return
    if (!activityNFTDataList.length) {
      fetchNFTActivity()
    }
  }, []);



  return (
    <div className={styles.page}>
      <div className={styles.header_wrap}>
        <div className={styles.header_tag_wrap}>
          <div style={{visibility: "hidden"}} className={styles.header_tag}><span>{t('common_reward')}</span></div>
          <span className={styles.page_name}>{t('nft_invite_page_name')}</span>
          <div style={{visibility: "hidden"}} className={styles.header_tag}><span>{t('common_reward')}</span></div>
        </div>
        {
          type === '2' && (
            <div onClick={() => setInstructionVis(true)} className={styles.info_icon}></div>
          )
        }
      </div>

      {
        activityNFTData ? (
          <div className={styles.content_wrap}>
            <div className={styles.service_item}>
              <div className={styles.u_c_i_top}>
                <div className={styles.svip_img}>
                  <ImageWidget src={activityNFTData?.imageUrl ?? ''}/>
                  {
                    type === '1' && (
                      <div className={styles.tag_wrap}>
                        {
                          activityNFTData.icon && (<img className={styles.hot_label_img} src={activityNFTData.icon} />)
                        }
                        {
                          activityNFTData.iconText && (<span>{activityNFTData.iconText}</span>)
                        }
                      </div>
                    )
                  }
                </div>
                <div className={styles.top_right_wrap}>
                  {
                    type === '1' ? (
                      <>
                        <div className={styles.title_wrap}>
                          <div className={styles.diamond_icon}></div>
                          <span className={styles.title_text}>Nature NFT</span>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <span className={`${styles.hint_label} ${['vi', 'ru'].includes(i18n.language) && styles.hint_label_l2}`}>{t('accelerate_daily_output')}</span>
                          <span className={styles.hint_value}>{formatPriceIfUsdt(activityNFTData.profitCurrency, activityNFTData.speed)} {formatUnitByCurrency(activityNFTData.profitCurrency)}/{t('common_day')}</span>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <span className={styles.hint_label}>{t('accelerate_price')}</span>
                          <span className={styles.hint_value}>{formatPriceIfUsdt(activityNFTData.priceCurrency, activityNFTData.price)} {formatUnitByCurrency(activityNFTData.priceCurrency)}</span>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <span className={styles.hint_label}>{t('accelerate_validity')}</span>
                          <span className={styles.hint_value}>{formatHoursToDay(activityNFTData.validity)} {t('common_day')}</span>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <span className={styles.hint_label}>{t('nft_max_count_label')}</span>
                          <span className={styles.hint_value}>{t('nft_max_count_value', {count: activityNFTData.maxCount})}</span>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <span className={styles.hint_label}>{t('common_total_income')}</span>
                          <span className={styles.hint_value}>{activityNFTData.speed * activityNFTData.validity / 24 / 100} {MAIN_CURRENCY_COIN}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.hint_text_wrap}>
                          <span className={`${styles.hint_label} ${['vi', 'ru'].includes(i18n.language) && styles.hint_label_l2}`}>{t('accelerate_speed')}</span>
                          <span className={styles.hint_value}>{formatPriceIfUsdt(activityNFTData.profitCurrency, activityNFTData.speed)} {formatUnitByCurrency(activityNFTData.profitCurrency)}/H</span>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <div className={styles.hint_label}>{t('accelerate_validity')}</div>
                          <div className={styles.hint_value}>{formatHoursToDay(activityNFTData.validity)} {t('common_day')}</div>
                        </div>
                        <div className={styles.hint_text_wrap}>
                          <div className={styles.hint_label}>{t('function_invite')}</div>
                          <div className={styles.hint_value}>{activityNFTData.price} {t('common_person')}</div>
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
              {
                type === '1' && (
                  <div className={styles.bottom_hint_wrap}>
                    <div className={styles.hint_text_1}>{t('nft_invite_page_hint_text_1')}</div>
                    <div className={styles.hint_text_2}>{formatPriceIfUsdt(activityNFTData.rewardsCurrency, activityNFTData.rewards)} {formatUnitByCurrency(activityNFTData.rewardsCurrency)}</div>
                  </div>
                )
              }
            </div>

            <div className={styles.invite_url_wrap}>
              <div className={styles.invite_url_text}>{inviteUrl ? inviteUrl : (<div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>)}</div>
              <div onClick={() => textCopyToClipboard(inviteUrl)} className={styles.copy_btn}>{t('common_copy')}</div>
            </div>

            <div onClick={onInviteClick} className={styles.invite_btn}>{t('common_invite_a_friend')}</div>

            {
              type !== '2' && (
                <div className={styles.invite_rule_wrap}>
                  <div className={styles.rule_text}>{t('nft_invite_page_rule_title')}</div>
                  <div className={styles.rule_text}>{t('nft_invite_page_rule_text_1', {amount: formatPriceIfUsdt(activityNFTData.rewardsCurrency, activityNFTData.rewards), currency: formatUnitByCurrency(activityNFTData.rewardsCurrency)})}</div>
                  <div className={styles.rule_text}>{t('nft_invite_page_rule_text_2')}</div>
                  <div className={styles.rule_text}>{t('nft_invite_page_rule_text_3')}</div>
                </div>
              )
            }

          </div>
        ) : (
          <div className={styles.loading_wrapper}><LoadingOutlined id={'moreLoading'} /></div>
        )
      }

      <Modal centered footer={null} closeIcon={false} open={instructionVis} onCancel={() => setInstructionVis(false)}>
        <div className={styles.modal_content}>

          <div className={styles.title_wrap}>{t('a_mining_rule_title')}</div>

          <div className={styles.content_text}>{t('a_mining_rule_content_text1')}</div>
          <div className={styles.content_text}>{t('a_mining_rule_content_text2')}</div>
          <div className={styles.content_text}>{t('a_mining_rule_content_text3')}</div>
          <div className={styles.content_text}>{t('a_mining_rule_content_text4', {currency: MAIN_CURRENCY_COIN})}</div>

          <div onClick={() => setInstructionVis(false)} className={styles.determine_btn}>{t('home_determine')}</div>
        </div>
      </Modal>

    </div>
  )
}

export default NFTInvitePage
