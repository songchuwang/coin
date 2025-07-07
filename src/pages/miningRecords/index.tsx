// MiningRewardPage.jsx
import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './index.module.scss';

const MiningRewardPage = () => {
    // 模拟奖励记录数据
    const rewardRecords = Array(5).fill({
        amount: '5888',
        type: '挖矿点击奖励',
        note: '备注',
        time: '2025年6月12日 11:53:49'
    });
    const handleBack = () => {
        window.history.back();
        // 或使用路由导航: navigate(-1) (react-router v6)
    };

    return (
        <>
            <PageHeader
                title="挖矿记录"
                onBack={handleBack}
                backgroundColor="#011A30"
                textColor="white"
            />
            <div className={styles.page}>
                <div className={styles.overview}>
                    <div className={styles.neuroxBox}>
                        <span className={styles.amount}>18888.888</span>
                        <div className={styles.neuroxName}>
                            <img src="./img/octopus.png" alt="" />
                            <span>NeuroX</span>
                        </div>
                    </div>
                    <div className={styles.neuroxBox}>
                        <span className={styles.amount}>18888.88</span>
                        <div className={styles.neuroxName}>
                            <img src="./img/usdt_icon.png" alt="" />
                            <span>NeuroX</span>
                        </div>
                    </div>
                </div>

                <div className={styles.rewardRecordBox}>
                    <p className={styles.rewardTxt}>奖励记录</p>
                    <div className={styles.listItem}>
                        <img className={styles.usdtIcon} src="./img/usdt_icon.png" alt="" />
                        <div className={styles.rewardMount}>
                            <span className={styles.mount}>+58888</span>
                            <span className={styles.tips}>挖矿点击奖励(备注)</span>
                        </div>
                        <span className={styles.time}>2025年6月12日 11:53:49</span>
                    </div>
                    <div className={styles.listItem}>
                        <img className={styles.usdtIcon} src="./img/usdt_icon.png" alt="" />
                        <div className={styles.rewardMount}>
                            <span className={styles.mount}>+58888</span>
                            <span className={styles.tips}>挖矿点击奖励(备注)</span>
                        </div>
                        <span className={styles.time}>2025年6月12日 11:53:49</span>
                    </div>
                    <div className={styles.listItem}>
                        <img className={styles.usdtIcon} src="./img/usdt_icon.png" alt="" />
                        <div className={styles.rewardMount}>
                            <span className={styles.mount}>+58888</span>
                            <span className={styles.tips}>挖矿点击奖励(备注)</span>
                        </div>
                        <span className={styles.time}>2025年6月12日 11:53:49</span>
                    </div>
                </div>
                
            </div>
        </>
    );
};

export default MiningRewardPage;