import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { APINodeListStats, APINodeUserStats } from '@/api';
import useDispatchAction from '@/hooks/useDispatchAction';
import {setNodeState, setNodeUserState,setLoadingModalVis } from '@/redux/actions/home';
import { message } from 'antd';
import {  NodeListStatsType, NodeUserStatsType } from '@/types';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import throttle from 'lodash/throttle';
import {jumpHelpLink} from "@/utils/jumpLinkUtils.ts";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";


const NodeStats: React.FC = () => {
  const { nodeId } = useParams<{ nodeId: string }>();

  const navigate = useNavigate();
  const dispatch = useDispatchAction({setNodeUserState,setLoadingModalVis,setNodeState})

  const userInfoData: UserInfoDataType = useSelector((state: any) => state.user.userInfo.userInfo)
  const nodeUserState: NodeUserStatsType = useSelector((state: any) => state.home.pageState.nodeUserState)
  const supportName: string = useSelector((state: any) => state.app.appSetting.supportName)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeList, setNodeList] = useState<NodeListStatsType[]>([]);
  const loadingRef = useRef(false);

  const handleNodeClick = (nodeId: string,userId:string) => {
    navigate(`/nodeIncomeDetail/${nodeId}/${userId}`);
  };

  const fetchUserStatsData = () => {
    const numNodeId = parseInt(nodeId || '', 10);

    APINodeUserStats(numNodeId).then(resp => {
      console.log('fetchUserStatsData resp', resp)
      if (resp.code === 0) {
        dispatch.setNodeUserState(resp.data)
      } else {
        message.error(resp.msg)
      }
    })
  }

  const fetchNodeListData = async (pageNum: number) => {
    if (loadingRef.current || !hasMore) return;
    try {
      loadingRef.current = true;
      setLoading(true);
      dispatch.setLoadingModalVis(true)

    const numNodeId = parseInt(nodeId || '', 10);
    APINodeListStats(numNodeId,pageNum).then(resp => {
      if (resp.code === 0 && resp.data && resp.data.list) {
        const newData = resp.data.list;
        if (pageNum === 1) {
          setNodeList(newData);
        } else {
          setNodeList(prev => [...prev, ...newData]);
        }

        setHasMore(newData.length === 10);
        setPage(pageNum);
      } else {
        message.error(resp.msg)
      }
    })
  } catch (error) {
    console.error('Fetch node list error:', error);
  } finally {

    setTimeout(() => {
      dispatch.setLoadingModalVis(false)
    }, 100)
    setLoading(false);
    loadingRef.current = false;
  }
  }

  const handleScroll = useCallback(
    throttle(() => {
      if (!containerRef.current || loadingRef.current || !hasMore) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < 50) {
        fetchNodeListData(page + 1);
      }
    }, 500),
    [page, hasMore]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);


  useEffect(() => {
    fetchUserStatsData()
    fetchNodeListData(1);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.statsCard}>
        <div className={styles.statHeadRow}>
          <div className={styles.statItem}>
            <div className={styles.statContent}>
              <div className={styles.label2}>{t('node_nft_total_income')}:</div>
              <div className={styles.value}>{nodeUserState.nftCommissionAmount/1000000} USDT</div>
            </div>
          </div>
        </div>

        <div className={styles.statRow}>
          <div className={styles.statItem}>
            <div className={styles.label}>{t('node_pledge_people')}:</div>
            <div className={styles.value}>{nodeUserState.pledgeUsers}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.label}>{t('node_pledge_total_income')}:</div>
            <div className={styles.value}>{nodeUserState.pledgeCommissionAmount/100} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

        <div className={styles.statRow}>
          <div className={styles.statItem}>
            <div className={styles.label}>{t('node_nft_people')}:</div>
            <div className={styles.value}>{nodeUserState.nftUsers}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.label}>{t('node_nft_total_income')}:</div>
            <div className={styles.value}>{nodeUserState.nftCommissionAmount/1000000} USDT</div>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className={styles.nodeListContainer}
        style={{ maxHeight: '600px', overflowY: 'auto' }}
      >
      <div className={styles.nodeList}>
        <div className={styles.title_wrap}>
          <h2 className={styles.title}>{t('node_people')}</h2>
          {
            userInfoData.rechargeAmount > 0 && (
              <div onClick={() => jumpHelpLink(supportName)} className={styles.help_box_wrap}>
                <div className={styles.help_icon}></div>
                <div className={styles.help_text}>Get Help：@{supportName}</div>
              </div>
            )
          }

        </div>

        {nodeList?.map(node => (
          <div
            key={node.id}
            className={styles.nodeItem}
            onClick={() => handleNodeClick(String(node.nodeId),String( node.userId))}
          >
            <div className={styles.nodeInfo}>
              <img src={node.avatar} className={styles.avatar} alt="avatar" />
              <div className={styles.details}>
                <div className={styles.name}>{node.nickName}</div>
                <div className={styles.stats}>
                  <div>{t('node_pos_total_income')}: {node.nftCommissionAmount/1000000} USDT</div>
                  <div>{t('node_pos_total_pledge')}: {node.pledgeCommissionAmount/100} {MAIN_CURRENCY_COIN}</div>
                </div>
              </div>
            </div>
            <div className={styles.arrow}></div>
          </div>
        ))}
      </div>
      {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeStats;
