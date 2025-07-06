import React from 'react';
import styles from "./index.module.scss"
import { LeftOutlined } from '@ant-design/icons';

const PageHeader = ({ 
  title = '挖矿记录', 
  onBack,
  backgroundColor = '#011A30', 
  textColor = 'white',
  iconColor = 'white'
}) => {
  return (
    <div 
      className={styles.header}
      style={{
        backgroundColor,
        color: textColor
      }}
    >
      {/* 返回按钮 */}
      <div className={styles.backButton} onClick={onBack}>
        <LeftOutlined 
          className={styles.backIcon} 
          style={{ color: iconColor }} 
        />
      </div>
      
      {/* 标题 */}
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default PageHeader;