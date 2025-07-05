import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './index.module.scss';
import { message } from 'antd';
import { APINodeUserNft, APINodeUserPledge, APINodeUserStats } from '@/api';
import useDispatchAction from '@/hooks/useDispatchAction';
import { setNodeUserState,setLoadingModalVis } from '@/redux/actions/home';
import { useParams } from 'react-router-dom';
import { NodeUserNft, NodeUserPledge, NodeUserStatsType } from '@/types';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

interface IncomeRecord {
  time: string;
  quantity: string;
  income: string;
}


const NodeIncomeDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nft' | 'pledge'>('nft');
  const dispatch = useDispatchAction({setNodeUserState,setLoadingModalVis})
  const { nodeId,userId } = useParams<{ nodeId: string,userId:string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [records, setRecords] = useState<IncomeRecord[]>([]);

  const nodeUserState: NodeUserStatsType = useSelector((state: any) => state.home.pageState.nodeUserState)

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;


    if (scrollHeight - scrollTop - clientHeight < 20) {

      if (activeTab === 'nft') {
        fetchNftListData(page+1);
      } else {
        fetchPledgeListData(page+1);
      }
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);


  const fetchNftListData = async (pageNum: number) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      if(pageNum === 1){
        dispatch.setLoadingModalVis(true)
      }

      const numNodeId = parseInt(nodeId || '', 10);
      const resp = await APINodeUserNft(numNodeId,userId,pageNum,30);
      if (resp.code === 0) {
        console.log('fetchNftListData  resp', resp.data)

        const newData = resp.data.list.map((item: NodeUserNft) => ({
          time: formatTimestamp(Number(item.payTime)),
          quantity: `${(item.pay/1000000).toString()} USDT`,
          income: `${(item.nodeCommission/1000000).toString()} USDT`
        }));

        if (pageNum === 1) {
          setRecords(newData);
        } else {
          setRecords(prev => [...prev, ...newData]);
        }


        setHasMore(newData.length === 30);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Fetch NFT list error:', error);
    } finally {
      setLoading(false);
      if(pageNum === 1){
          dispatch.setLoadingModalVis(false)

      }
    }
  };


  const fetchPledgeListData = async (pageNum: number) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      if(pageNum === 1){
        dispatch.setLoadingModalVis(true)
      }
      const numNodeId = parseInt(nodeId || '', 10);

      const resp = await APINodeUserPledge(numNodeId,userId,pageNum,30);
      if (resp.code === 0) {

        const newData = resp.data.list.map((item: NodeUserPledge) => ({
          time: formatTimestamp(Number(item.createTime)),
          quantity: `${(item.amount/100).toString()} ${MAIN_CURRENCY_COIN}`,
          income: `${(item.commission/100).toString()} ${MAIN_CURRENCY_COIN}`
        }));


        if (pageNum === 1) {
          setRecords(newData);
        } else {
          setRecords(prev => [...prev, ...newData]);
        }

        setHasMore(newData.length === 30);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Fetch Pledge list error:', error);
    } finally {
      setLoading(false);
      if(pageNum === 1){
        dispatch.setLoadingModalVis(false)
      }
    }
  };

  const fetchUserStatsData = () => {
    const numNodeId = parseInt(nodeId || '', 10);

    APINodeUserStats(numNodeId).then(resp => {
      if (resp.code === 0) {
        dispatch.setNodeUserState(resp.data)
      } else {
        message.error(resp.msg)
      }
    })
  }
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
  };
  useEffect(() => {
    if (nodeId) {
      fetchUserStatsData()
      fetchNftListData(1);
    }
  }, [nodeId]);

  useEffect(() => {
    if (activeTab === 'nft') {
      fetchNftListData(1);
    } else {
      fetchPledgeListData(1);
    }
  }, [activeTab]);


  const handleTabChange = (tab: 'nft' | 'pledge') => {
    setActiveTab(tab);
    resetListState();
  };

  const resetListState = () => {
    setRecords([]);
    setPage(1);
    setHasMore(true);
  };

  const renderRecords = () => {
    return records.map((record, index) => (
      <div key={index} className={styles.recordItem}>
        <div className={styles.time}>{record.time}</div>
        <div className={styles.quantity}>{record.quantity}</div>
        <div className={styles.income}>{record.income}</div>
      </div>
    ));
  };

  return (
    <div className={styles.page}>

        <div className={styles.statsCard}>
        <div className={styles.statHeadRow}>
          <div className={styles.statItem}>
            <div className={styles.statContent}>
              <div className={styles.label}>{t('node_nft_total_income')}:</div>
              <div className={styles.value}>{nodeUserState.nftCommissionAmount/1000000} USDT</div>
            </div>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.label}>{t('node_pledge_people')}:</div>
            <div className={styles.value}>{nodeUserState.pledgeUsers}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.label}>{t('node_pledge_total_income')}:</div>
            <div className={styles.value}>{nodeUserState.pledgeCommissionAmount/100} {MAIN_CURRENCY_COIN}</div>
          </div>
        </div>

        <div className={styles.statsRow}>
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

      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${activeTab === 'nft' ? styles.active : ''}`}
          onClick={() => handleTabChange('nft')}
        >
          {t('node_nft_income')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'pledge' ? styles.active : ''}`}
          onClick={() => handleTabChange('pledge')}

        >
          {t('node_pledge_income')}
        </button>
      </div>

      <div className={styles.listWrapper}>
      {/* 固定的表头 */}
      <div className={styles.listHeader}>
        <div className={styles.time}>{t('node_time')}</div>
        <div className={styles.quantity}>{t('node_quantity')}</div>
        <div className={styles.income}>{t('node_incoming')}</div>
      </div>

      {/* 可滚动的内容区域 */}
      <div
        ref={containerRef}
        className={styles.scrollContent}
      >
        {renderRecords()}
        {loading && (
          <div className={styles.loading}>{t('node_loading')}</div>
        )}

        {!hasMore && records.length > 0 && (
          <div className={styles.noMore}>{t('node_no_more_data')}</div>
        )}
      </div>
    </div>
    </div>
  );
};

export default NodeIncomeDetail;
