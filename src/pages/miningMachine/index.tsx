import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";

const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const MiningMachine = () => {
    const navigate = useNavigate()
    return (<>
        <PageHeader
            onBack={handleBack}
            title="矿机"
            backgroundColor="#030B20"
            textColor="white"
        />
        <div className={styles.page}>
            
            <img className={styles.poster} src="../img/miner/poster.png" alt="" />
            <div onClick={()=>{
                console.log(111111111111);
                return navigate('/miningMachine/myMiningMachine')
                
            }} className={styles.dataBox}>
                <div className={styles.left}>
                    <span className={styles.num}>18</span>
                    <span className={styles.name}>有效矿机</span>
                </div>
                <div className={styles.center}>
                    <span className={styles.num}>188888</span>
                    <span className={styles.name}>总收益</span>
                </div>
                <div className={styles.right}>
                    <span className={styles.num}>188</span>
                    <span className={styles.name}>今日收益</span>
                </div>
            </div>
            <div className={styles.minerItem}>
                <div className={styles.tips}>130%</div>
                <div className={styles.line1}>
                    <img src="../img/miner/diamond.png" alt="" />
                    <span>基础款 NFT矿机</span>
                </div>
                <span className={styles.desc}>总产出:360000 NeuroX</span>
                <span className={styles.desc}>
                    每日产出:7200 NeuroX
                </span>
                <span className={styles.desc}>购买上限:99台</span>
                <div className={styles.line2}>
                    <span className={styles.summary}>10USDT  50DAY</span>
                    <div className={styles.pay}>购买</div>
                </div>
            </div>
        </div>
    </>)
}

export default MiningMachine