import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";

const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const SwapCurrency = () => {
    return (<>
        <PageHeader
            onBack={handleBack}
            title="交换"
            backgroundColor="#030B20"
            textColor="white"
        />
        <div className={styles.page}>
            <p className={styles.title}>Swap</p>
            <div className={styles.fromBox}>
                <span className={styles.fromTxt}>From</span>
                <div className={styles.fromContent}>
                    <div className={styles.iconText}>
                        <img src="../img/usdt_icon.png" alt="" />
                        <span>NeuroX</span>
                    </div>
                    <span className={styles.balance}>余额：888888</span>
                    <span className={styles.allBtn}>全部</span>
                </div>
            </div>
            <div className={styles.swapIcon}>
                <img src="../img/wallet/swap.png" alt="" />
            </div>
            <div className={styles.fromBox}>
                <span className={styles.fromTxt}>To</span>
                <div className={styles.fromContent}>
                    <div className={styles.iconText}>
                        <img src="../img/usdt_icon.png" alt="" />
                        <span>USDT</span>
                    </div>
                    <span className={styles.balance}>余额：888888</span>
                    <span className={styles.allBtn}>全部</span>
                </div>
            </div>
            <div className={styles.commissionBox}>
                <span>手续费</span>
                <span>1.111</span>
            </div>

        </div>
    </>)
}

export default SwapCurrency