import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";

const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const Ranking = () => {
    return (<>
        <PageHeader
            onBack={handleBack}
            title="转入"
            backgroundColor="#030B20"
            textColor="white"
        />
        <div className={styles.page}>
            <div className={styles.usdtBox}>
                <div className={styles.imgBox}>
                    <img className={styles.usdt_icon} src="../img/wallet/recharge_usdt_icon.png" alt="" />
                    <img className={styles.bn_icon} src="../img/wallet/rechage_bn_icon.png" alt="" />
                </div>
                <div className={styles.usdtName}>
                    USDT
                </div>
                <div className={styles.bnbBox}>
                    BNB Smart Chain
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.lin1}>
                    网络
                </p>
                <p className={styles.lin2}>
                    BNB Smart Chain(BEP-20)
                </p>
                <p className={styles.lin3}>转入地址</p>
                <div className={styles.line4}>
                    <p className={styles.line4}>0xD3b0d838cCCEAe7ebF1781011D1bB741DB7Fe1A7</p>
                    <img src="../img/wallet/recharge_copy_icon.png" alt="" />

                </div>
                <p className={styles.line5}>.仅接受BEP20(USDT)资产充值，充值后约1-3分钟到账。</p>
            </div>

        </div>
    </>)
}

export default Ranking