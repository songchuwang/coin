import React, { useState } from 'react';
import styles from './index.module.scss';
import PageHeader from "../../components/PageHeader";
import { Input, Select, Button, Form, Col, Row } from 'antd';

const handleBack = () => {
    window.history.back();
};
const Ranking = () => {
     const [form] = Form.useForm();
  const [amount, setAmount] = useState(1000); // 初始值为1000
  const [withdrawalAddress, setWithdrawalAddress] = useState(
    "0xD360d838cCCEebF1781D11016B7410B7Fe1A7"
  );

  // 计算实际到账金额 (扣除5%手续费)
  const actualAmount = amount * 0.95;

  // 填充最大金额
  const fillMaxAmount = () => {
    setAmount(1000); // 设计图中为1000
  };

  // 处理表单提交
  const handleSubmit = () => {
    console.log('提现数据:', { withdrawalAddress, amount, actualAmount });
  };

    return (<>
        <PageHeader
            onBack={handleBack}
            title="提现"
            backgroundColor="#030B20"
            textColor="white"
        />
        <div className={styles.page}>
            <div className={styles.usdtBox}>
                <div className={styles.imgBox}>
                    <img className={styles.usdt_icon} src="../img/wallet/recharge_usdt_icon.png" alt="" />
                </div>
                <div className={styles.usdtName}>
                    <span className={styles.moneyNum}>3343</span>
                    <span className={styles.moneyUnit}>USDT</span>
                </div>
                <div className={styles.formContainer}>
                <Form form={form} onFinish={handleSubmit}>
                {/* 转出地址 */}
                <Form.Item
                    label={<span className={styles.formLabel}>转出地址</span>}
                    className={styles.formItem}
                >
                    <Input
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    className={styles.addressInput}
                    />
                </Form.Item>

                {/* 转账网络 */}
                <Form.Item
                    label={<span className={styles.formLabel}>转账网络</span>}
                    className={styles.formItem}
                >
                    <Input
                    readOnly
                    value={'BNB Smart Chain (BEP-20)'}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    className={styles.addressInput}
                    />
                </Form.Item>

                {/* 转账数量 */}
                <Form.Item
                    label={<span className={styles.formLabel}>转账数量</span>}
                    className={styles.formItem}
                >
                    <Input
                    value={'1000USDT'}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    className={styles.addressInput}
                    />
                    <span className={styles.allMountBtn}>全部</span>
                </Form.Item>

                {/* 实际到账 */}
                <Form.Item
                    label={<span className={styles.formLabel}>实际到账</span>}
                    className={styles.formItem}
                >
                    <div className={styles.actualAmountContainer}>
                    <Input 
                        value={amount} 
                        readOnly 
                        className={`${styles.actualAmountInput} ${styles.leftInput}`}
                    />
                    
                    <div className={styles.operator}>×</div>
                    
                    <Input 
                        value="95%" 
                        readOnly 
                        className={`${styles.actualAmountInput} ${styles.centerInput}`}
                    />
                    
                    <div className={styles.operator}>=</div>
                    
                    <Input 
                        value={actualAmount.toFixed(2)} 
                        readOnly 
                        className={`${styles.actualAmountInput} ${styles.rightInput} ${styles.resultInput}`}
                    />
                    </div>
                </Form.Item>

                {/* 提现按钮 */}
                <Form.Item className={styles.formItem}>
                    <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.submitButton}
                    block
                    >
                    提现
                    </Button>
                </Form.Item>
                </Form>
            </div>
            </div>

            

        </div>
    </>)
}

export default Ranking

// import React, { useState } from 'react';
// import { Form, Input, Select, Button, Row, Col } from 'antd';
// import styles from './index.module.scss';

// const CryptoWithdrawForm = () => {
//   const [form] = Form.useForm();
//   const [amount, setAmount] = useState(1000); // 初始值为1000
//   const [withdrawalAddress, setWithdrawalAddress] = useState(
//     "0xD360d838cCCEebF1781D11016B7410B7Fe1A7"
//   );

//   // 计算实际到账金额 (扣除5%手续费)
//   const actualAmount = amount * 0.95;

//   // 填充最大金额
//   const fillMaxAmount = () => {
//     setAmount(1000); // 设计图中为1000
//   };

//   // 处理表单提交
//   const handleSubmit = () => {
//     console.log('提现数据:', { withdrawalAddress, amount, actualAmount });
//   };

//   return (
//     <div className={styles.container}>
      
//     </div>
//   );
// };

// export default CryptoWithdrawForm;