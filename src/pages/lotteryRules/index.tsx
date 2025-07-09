import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";
const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const LotteryRules = () => {


    return (
        <>
            <PageHeader
                onBack={handleBack}
                title="抽奖规则"
                backgroundColor="#030B20"
                textColor="white"
            />
            <div className={styles.lotteryPage}>
                <div className={styles.content}>
                    <span>抽奖规则</span>
                    <p>感谢您参与本次【[活动名称]】抽奖活动！为确保活动公平、
                        公正、公开地进行，请您仔细阅读以下活动规则。参与本活
                        动即视为您已充分理解并同意遵守本规则的全部内容。</p>
                        <p></p>
                    <p>
                        ## 1. 活动时间
                        *参与时间：** [开始日期] [具体时间] 至 [结束日期] [具
                        体时间] (例如：2025年6月23日 00:00 至 2025年7月7日
                        23:59)
                        *开奖时间：** [开奖日期] [具体时间] (例如：2025年7月8日
                        15:00)
                        *兑奖时间：** 中奖通知发出之日起 [天数] 天内有效 (例如：
                        7天内)，逾期视为自动放弃。</p>
                </div>
            </div>
        </>
    );
};

export default LotteryRules;