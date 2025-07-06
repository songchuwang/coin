import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";
const handleBack = () => {
    window.history.back();
    // 或使用路由导航: navigate(-1) (react-router v6)
};
const LotteryPage = () => {
    // 状态管理
    const [history, setHistory] = useState([
        { id: 1, time: "16/06 14:16", username: "@IHUADONG", prize: "XCON*2" },
        { id: 2, time: "16/06 14:16", username: "@IHUADONG", prize: "XCON*2" },
        { id: 3, time: "16/06 14:16", username: "@IHUADONG", prize: "XCON*2" },
        { id: 4, time: "16/06 14:16", username: "@IHUADONG", prize: "XCON*2" },
        { id: 5, time: "16/06 14:16", username: "@IHUADONG", prize: "XCON*2" }
    ]);

    const [balance, setBalance] = useState(18888);
    const [remaining, setRemaining] = useState(188);
    const [isSpinning, setIsSpinning] = useState(false);
    const [activeChest, setActiveChest] = useState(-1);
    const [showResult, setShowResult] = useState(false);
    const [currentPrize, setCurrentPrize] = useState("");

    // 定时器引用
    const spinTimer = useRef(null);
    const spinInterval = useRef(null);

    // 宝箱配置 - 对应九宫格的8个位置（中间位置是抽奖按钮）
    const chests = [
        { id: 1, name: "宝箱1", value: "200积分" },
        { id: 2, name: "宝箱2", value: "XCON*1" },
        { id: 3, name: "宝箱3", value: "宝箱3" },
        { id: 4, name: "宝箱4", value: "150积分" },
        // 索引4的位置是抽奖按钮
        { id: 5, name: "宝箱5", value: "宝箱5" },
        { id: 6, name: "宝箱6", value: "100积分" },
        { id: 7, name: "宝箱7", value: "XCON*2" },
        { id: 8, name: "宝箱8", value: "XCON*3" }
    ];

    // 开始抽奖
    const startSpin = () => {
        if (isSpinning || remaining <= 0) return;

        setIsSpinning(true);
        setShowResult(false);
        setRemaining(prev => prev - 1);
        setBalance(prev => prev - 100);

        // 初始快速闪烁效果
        let currentIndex = 0;
        setActiveChest(currentIndex);

        const baseSpeed = 100;
        let currentSpeed = baseSpeed;
        let spins = 0;
        let count = 0;
        const maxSpins = 24;

        spinInterval.current = setInterval(() => {
            // 移动到下一个宝箱，跳过中间的抽奖按钮
            let nextIndex = (currentIndex + 1) % 9;
            if (nextIndex === 4) nextIndex = 5; // 跳过中间的抽奖按钮位置

            setActiveChest(nextIndex);
            currentIndex = nextIndex;
        }, currentSpeed);

        // 逐渐减慢速度并最终停在随机奖品上
        spinTimer.current = setTimeout(() => {
            clearInterval(spinInterval.current);

            // 减慢速度阶段
            const finalPrize = Math.floor(Math.random() * 8);
            let finalIndex = finalPrize >= 4 ? finalPrize + 1 : finalPrize; // 调整跳过中间按钮

            spinInterval.current = setInterval(() => {
                spins++;

                // 每次减慢一点速度
                if (spins % 4 === 0) {
                    currentSpeed += 20;
                }

                // 移动到下一个宝箱，跳过中间的抽奖按钮
                currentIndex = (currentIndex + 1) % 9;
                if (currentIndex === 4) currentIndex = 5; // 跳过中间的抽奖按钮位置

                setActiveChest(currentIndex);

                // 结束条件
                if (spins > maxSpins && currentIndex === finalIndex) {
                    clearInterval(spinInterval.current);
                    setActiveChest(finalIndex);
                    setIsSpinning(false);

                    // 显示结果
                    const chestIndex = finalIndex < 4 ? finalIndex : finalIndex - 1;
                    setCurrentPrize(chests[chestIndex].value);
                    setShowResult(true);

                    // 添加到历史记录
                    const newRecord = {
                        id: history.length + 1,
                        time: new Date().toLocaleDateString('zh-CN', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        username: "@YOU",
                        prize: chests[chestIndex].value
                    };

                    setHistory(prev => [newRecord, ...prev]);
                }
            }, currentSpeed);
        }, 1000);
    };

    // 组件卸载时清除定时器
    useEffect(() => {
        return () => {
            if (spinTimer.current) clearTimeout(spinTimer.current);
            if (spinInterval.current) clearInterval(spinInterval.current);
        };
    }, []);

    // 关闭结果弹窗
    const closeResult = () => {
        setShowResult(false);
    };

    // 渲染九宫格宝箱
    const renderGrid = () => {
        const gridItems = [];

        // 创建9个位置（3x3网格）
        for (let i = 0; i < 9; i++) {
            // 第5个位置（索引4）是抽奖按钮
            if (i === 4) {
                gridItems.push(
                    <div key="spin-button" className={styles.gridItem}>
                        <button
                            className={`${styles.spinButton} ${isSpinning ? styles.spinning : ''}`}
                            onClick={startSpin}
                            disabled={isSpinning || remaining <= 0}
                        >
                            立即抽奖
                        </button>
                    </div>
                );
            }
            // 其他位置渲染宝箱
            else {
                // 计算宝箱索引（跳过中间的抽奖按钮位置）
                const chestIndex = i < 4 ? i : i - 1;
                const chest = chests[chestIndex];

                gridItems.push(
                    <div
                        key={`chest-${chest.id}`}
                        className={`${styles.gridItem} ${activeChest === i ? styles.active : ''}`}
                    >
                        <img className={styles.gift} src="./img/lottery.png" alt="" />
                        {/* <div className={styles.chestIcon}>📦</div>
            <div className={styles.chestName}>{chest.name}</div> */}
                    </div>
                );
            }
        }

        return gridItems;
    };

    return (
        <>
            <PageHeader
                title=""
                onBack={handleBack}
                backgroundColor="#030B20"
                textColor="white"
            />
            <div className={styles.lotteryPage}>
                {/* 顶部标题 */}
                <div className={styles.header}>
                    <h1>天天抽奖转不停</h1>
                </div>

                {/* 抽奖区域 - 九宫格布局 */}
                <div className={styles.wheelSection}>
                    <div className={styles.gridContainer}>
                        {renderGrid()}
                    </div>
                </div>

                {/* 积分和次数显示 */}
                <div className={styles.balanceInfo}>
                    <div className={styles.balance}>
                        <span className={styles.label}>积分余额:</span>
                        <span className={styles.value}>{balance}</span>
                    </div>
                    <div className={styles.drawTimes}>
                        <span className={styles.label}>还可抽取</span>
                        <span className={styles.value}>{remaining}</span>
                        <span className={styles.label}>次</span>
                    </div>
                </div>

                {/* 抽奖记录 */}
                <div className={styles.historySection}>
                    <div className={styles.tableHeader}>
                        <div className={styles.headerCell}>时间</div>
                        <div className={styles.headerCell}>用户</div>
                        <div className={styles.headerCell}>奖品</div>
                    </div>
                    <div className={styles.tableBody}>
                        {history.map(record => (
                            <div key={record.id} className={styles.tableRow}>
                                <div className={styles.bodyCell}>{record.time}</div>
                                <div className={styles.bodyCell}>{record.username}</div>
                                <div className={`${styles.bodyCell} ${styles.prizeCell}`}>{record.prize}</div>
                            </div>
                        ))}
                    </div>
                </div>
                

                {/* 结果弹窗 */}
                {showResult && (
                    <div className={styles.resultOverlay} onClick={closeResult}>
                        <div className={styles.resultModal} onClick={(e) => e.stopPropagation()}>
                            <h2>恭喜您获得</h2>
                            <div className={styles.prizeValue}>{currentPrize}</div>
                            <div className={styles.resultInfo}>
                                <span>{new Date().toLocaleDateString('zh-CN', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                                <span>@YOU</span>
                            </div>
                            <button className={styles.confirmButton} onClick={closeResult}>继续抽奖</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default LotteryPage;