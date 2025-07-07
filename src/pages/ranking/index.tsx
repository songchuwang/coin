import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";

const dataList = [
    {
        id: 1,
        ranking: 1,
        userName: 'scw',
        rankingNeuroX: 13244
    },
    {
        id: 2,
        ranking: 2,
        userName: 'scw2',
        rankingNeuroX: 13244
    },
    {
        id: 3,
        ranking: 3,
        userName: 'scw3',
        rankingNeuroX: 13244
    },
    {
        id: 4,
        ranking: 4,
        userName: 'scw4',
        rankingNeuroX: 13244
    },
]

const Ranking = () => {
    return (<>
        <PageHeader
            title="NeuroX排名"
            backgroundColor="#030B20"
            textColor="white"
        />
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.rankingIndex}>排名</div>
                <div className={styles.userName}>用户</div>
                <div className={styles.rankingNeuroX}>NeuroX排</div>
            </div>
            {
                dataList.map(item => {
                    return (<div className={`${styles.header} ${styles.listItem}`}>
                        <div className={styles.rankingIndex}>{item.ranking}</div>
                        <div className={styles.userName}>{item.userName}</div>
                        <div className={styles.rankingNeuroX}>{item.rankingNeuroX}</div>
                    </div>)
                })
            }
        </div>
    </>)
}

export default Ranking