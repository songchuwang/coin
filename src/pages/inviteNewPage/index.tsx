import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";

const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const list = [
    {
        id: 1,
        total: 88,
        hasActive: true,
    },
    {
        id: 2,
        total: 88,
        hasActive: true,
    },
    {
        id: 3,
        total: 88,
        hasActive: true,
    },
]
const InviteTeamPage = () => {
    const [activeTab, setActiveTab] = useState('invite');
    const navigate = useNavigate()

    const teamData = [
        { total: '888', activated: '88' },
        { total: '888', activated: '88' },
        { total: '888', activated: '88' },
    ];

    return (
        <>
            <PageHeader
                title="邀请记录"
                onBack={handleBack}
                backgroundColor="#030B20"
                textColor="white"
            />
            <div className={styles.container}>
                {/* Tabs 顶部导航 - 修正为图片样式 */}
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsContainer}>
                        <button
                            className={`${styles.tabItem} ${activeTab === 'invite' ? styles.tabItemActive : ''}`}
                            onClick={() => setActiveTab('invite')}
                        >
                            邀请
                        </button>
                        <button
                            className={`${styles.tabItem} ${activeTab === 'profit' ? styles.tabItemActive : ''}`}
                            onClick={() => setActiveTab('profit')}
                        >
                            收益
                        </button>
                    </div>
                </div>
                <div className={`${styles.inviteContent} ${activeTab === 'invite' ? styles.displayBlock : styles.displayNone}`}>
                    <div className={styles.allInviter}>
                        <p className={styles.title}>我的全部成员（人）</p>
                        <p className={styles.money}>888888</p>
                    </div>
                    <div onClick={() => navigate('/inviteNewPage/inviteDetail')} className={styles.inviteList}>
                        {
                            list.map(item => {
                                return (
                                    <div className={styles.listItem}>
                                        <div className={styles.inviterIconBox}>
                                            <img className={styles.inviter} src="./img/inviter_icon.png" alt="" />
                                        </div>
                                        <div className={styles.con1}>
                                            <p className={styles.lin1}>888</p>
                                            <p className={styles.lin2}>总人数</p>
                                        </div>
                                        <div className={styles.con2}>
                                            <p className={styles.lin1}>88</p>
                                            <p className={styles.lin2}>已激活</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.inviteLink}>
                        <p>· 第一代：10%，需直推3人并激活</p>
                        <div className={styles.inviteBtn}>
                            复制我的推荐链接
                        </div>
                    </div>
                </div>
                <div className={`${styles.inviteContent} ${activeTab === 'profit' ? styles.displayBlock : styles.displayNone}`}>
                    <div className={styles.allInviter}>
                        <p className={styles.title}>我的总收益（美元）</p>
                        <p className={styles.money}>888888</p>
                    </div>
                    <div className={styles.inviteList}>
                        {
                            list.map(item => {
                                return (
                                    <div onClick={() => navigate('./inviteDetail')} className={styles.listItem}>
                                        <div className={styles.inviterIconBox}>
                                            <img className={styles.inviter} src="./img/inviter_icon.png" alt="" />
                                        </div>
                                        <div className={styles.con1}>
                                            <p className={styles.lin1}>888</p>
                                            <p className={styles.lin2}>NeuroX</p>
                                        </div>
                                        <div className={styles.con2}>
                                            <p className={styles.lin1}>88</p>
                                            <p className={styles.lin2}>USDT</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.inviteLink}>
                        <p>· 第一代：10%，需直推3人并激活</p>
                        <div className={styles.inviteBtn}>
                            复制我的推荐链接
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InviteTeamPage;