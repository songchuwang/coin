import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";

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
            <div className={styles.page}>
                <div className={styles.listItem}>
                    <div className={styles.inviterIconBox}>
                        <img className={styles.inviter} src="../img/invite_detail_total.png" alt="" />
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
                <div className={styles.listBox}>
                    <p>我的全部成员</p>
                    <div className={styles.list}>
                        <img className={styles.img} src="../img/invite_detail_item.png" alt="" />
                        <img className={styles.img} src="../img/people.png" alt="" />
                        <div className={styles.userInfo}>
                            <span className={styles.name}>@project</span>
                            <span className={styles.date}>2025/06/12</span>
                        </div>
                        <span className={styles.totalNum}>15000人</span>
                    </div>
                    <div className={styles.list}>
                        <img className={styles.img} src="../img/invite_detail_item.png" alt="" />
                        <img className={styles.img} src="../img/people.png" alt="" />
                        <div className={styles.userInfo}>
                            <span className={styles.name}>@project</span>
                            <span className={styles.date}>2025/06/12</span>
                        </div>
                        <span className={styles.totalNum}>15000人</span>
                    </div>
                    <div className={styles.list}>
                        <img className={styles.img} src="../img/invite_detail_item.png" alt="" />
                        <img className={styles.img} src="../img/people.png" alt="" />
                        <div className={styles.userInfo}>
                            <span className={styles.name}>@project</span>
                            <span className={styles.date}>2025/06/12</span>
                        </div>
                        <span className={styles.totalNum}>15000人</span>
                    </div>
                    <div className={styles.list}>
                        <img className={styles.img} src="../img/invite_detail_item.png" alt="" />
                        <img className={styles.img} src="../img/people.png" alt="" />
                        <div className={styles.userInfo}>
                            <span className={styles.name}>@project</span>
                            <span className={styles.date}>2025/06/12</span>
                        </div>
                        <span className={styles.totalNum}>15000人</span>
                    </div>
                </div>
            </div>

        </>
    );
};

export default InviteTeamPage;