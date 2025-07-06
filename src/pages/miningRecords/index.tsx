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
            <div className={styles.appContainer}>
                {/* 加密货币地址展示区 */}
                <div className={styles.cryptoContainer}>
                    <div className={styles.cryptoItem}>
                        <div className={styles.cryptoValue}>1888.8881</div>
                        <div className={styles.cryptoLabel}>
                            <img src="./img/octopus.png" alt="" />
                            <span>NeuroX</span>
                        </div>
                    </div>
                    <div className={styles.cryptoItem}>
                        <div className={styles.cryptoValue}>1888.8881</div>
                        <div className={styles.cryptoLabel}>
                            <img src="./img/usdt_icon.png" alt="" />
                            <span>USDT</span>
                        </div>
                    </div>
                </div>

                {/* 奖励记录区域 */}
                <div className={styles.rewardsContainer}>
                    <div className={styles.sectionTitle}>奖励记录</div>

                    {rewardRecords.map((record, index) => (
                        <div key={index} className={styles.rewardItem}>
                            
                            <div className={styles.rewardInfo}>
                                <span className={styles.rewardAmount}>+{record.amount}</span>
                                <span className={styles.rewardType}>{record.type}({record.note})</span>
                            </div>
                            <div className={styles.rewardTime}>{record.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MiningRewardPage;