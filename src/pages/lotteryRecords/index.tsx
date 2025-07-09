import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";
const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const LotteryRecords = () => {


    return (
        <>
            <PageHeader
                onBack={handleBack}
                title="抽奖记录"
                backgroundColor="#030B20"
                textColor="white"
            />
            <div className={styles.lotteryPage}>
                <div className={styles.recordItem}>
                    <img src="./img/record_icon.png" alt="" />
                    <div className={styles.content}>
                        <span className={styles.project}>NeuroX</span>
                        <span className={styles.time}>2025/07/06</span>
                    </div>
                    <span className={styles.tips}>X2</span>
                </div>
            </div>
        </>
    );
};

export default LotteryRecords;