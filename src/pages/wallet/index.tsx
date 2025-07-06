import styles from "./index.module.scss"
import PageHeader from '../../components/PageHeader';

const walletList = [
    {
        key: 0,
        name: 'Platform',
        iconPath: './img/wallet/platform.png',
        navigatePath: ''
    },
    {
        key: 1,
        name: 'Route',
        iconPath: './img/wallet/route.png',
        navigatePath: ''
    },
    {
        key: 2,
        name: 'White Paper',
        iconPath: './img/wallet/white_paper.png',
        navigatePath: ''
    },
    {
        key: 3,
        name: 'Bill',
        iconPath: './img/wallet/bill.png',
        navigatePath: ''
    },
    {
        key: 4,
        name: 'Recharge',
        iconPath: './img/wallet/recharge.png',
        navigatePath: ''
    },
    {
        key: 5,
        name: 'Withdraw',
        iconPath: './img/wallet/withdraw.png',
        navigatePath: ''
    },
    {
        key: 6,
        name: 'Node',
        iconPath: './img/wallet/node.png',
        navigatePath: ''
    },
    {
        key: 7,
        name: 'Address',
        iconPath: './img/wallet/address.png',
        navigatePath: ''
    },
    {
        key: 8,
        name: 'GEN&USDT',
        iconPath: './img/wallet/gen&usdt.png',
        navigatePath: ''
    },
]
const Wallet = () => {
    return (
        <div className={styles.page}>
            <p className={styles.header}>钱包</p>
            <div className={styles.walletinfo}>
                <p className={styles.walletname}>Wallet</p>
                <p className={styles.neuroxname}>500 NeuroX</p>
                <p className={styles.usdtname}>0.055588USDT</p>
            </div>
            <div className={styles.list}>
                {
                    walletList.map(item => {
                        return (<div className={styles.listitem}>
                            <img src={item.iconPath} alt="" />
                            <span>{item.name}</span>
                        </div>)
                    })
                }
            </div>
            <div className={styles.coinitem}>
                <div className={styles.left}>
                    <img src="./img/usdt_icon.png" alt="" />
                    <span>NeuroX</span>
                </div>
                <div className={styles.right}>
                    <span>567.8</span>
                    <img src="./img/wallet/more.png" alt="" />
                </div>
            </div>
            <div className={styles.coinitem}>
                <div className={styles.left}>
                    <img src="./img/usdt_icon.png" alt="" />
                    <span>USDT</span>
                </div>
                <div className={styles.right}>
                    <span>0.1</span>
                    <img src="./img/wallet/more.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Wallet