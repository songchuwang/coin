
export type LoginParamsType = {
  miniId?: number,
  // firstName: string,
  // lastName: string,
  username?: string,
  avatar?: string,
  password?: string,
  referralCode?: string,
  initData?: string
  // socialType: number,
  // socialCode: string,
  // socialState: string,
  // socialCodeValid?: boolean
}

export type UserType = {
  id?: number,
  tgId?: number,
  headImg?: string,
  userType?: number, // 0 inactive; 1 active
  username?: string,
  firstName?: string,
  lastName?: string,
  country?: string,
  direct?: number,
  directVerify?: number,
  miningLevel?: number,
  imr?: number,
  usdt?: number,
  vipSpeed?: number,
  vipType?: number,
  vipBuyCount?: number,
  svipBuyCount?: number,
  reciveTime?: number,
  vipEndTime?: number,
  svipEndTime?: number,
  speed?: number,
  otherSpeed?: number,
  rebate?: number,
  referralCode?: string,
  parentReferralCode?: string,
  createTime?: number,
  contribute?: number
}

export type LoginResDataType = {
  accessToken?: string,
  expiresTime?: number,
  openid?: any,
  refreshToken?: string,
  userId?: number
}

export type RateReqParamsType = {
  nonce?: string,
  userId?: number,
  type?: number,
  amount?: number
}

export type RateResDataType = {
  amount?: number,
  usdtAmount?: number
}

export type ServicePackageType = {
  id?: number,
  name?: string,
  imageUrl?: string,
  description?: string,
  detail?: string,
  period?: number,
  profit?: number,
  profitCurrency?: number,
  speed?: number,
  price?: number,
  priceCurrency?: number,
  validity?: number,
  status?: number,
  createTime?: string,
  icon?: string,
  iconText?: string,
  type?: number,
  maxCount?: number,
  nodeId?: number,
  nodeName?: number,
  actType?: number,
}

export type LevelUpgradeType = {
  icon?: string,
  level?: number,
  period?: number,
  speed?: number,
  price?: number,
  priceCurrency?: number
}

export type ServiceSubmitReqType = {
  id?: number,
  num?: number,
  price?: number,
  userId?: number,
  nodeId?: number
}

export type LevelUpgradeReqType = {
  userId?: number,
  level?: number
}

export type AssetsStateType = {
  isMax?: boolean,
  curLevel?: LevelUpgradeType,
  nextLevel?: LevelUpgradeType,
  userId?: number,
  miniId?: number,
  userName?: number,
  gnet?: number,
  usdt?: number,
  usdn?: number,
  usdn2usdt?: number,
  version?: number
}

export type WalletAddressDataType = {
  id?: number,
  walletId?: number,
  address?: string,
  priority?: number,
  def?: number,
  status?: number,
  createTime?: string
}

export interface ListDataType {
  list?: any,
  total?: number
}

export interface ListReqParamType {
  pageNo?: number,
  pageSize?: number
}

export interface StakingOrderListReqType extends ListReqParamType {
  isNode?: number
}

export interface BuyServiceOrderListReqType extends ListReqParamType {
  isNode?: number
}

export type UserWalletAddressType = {
  id?: number,
  userId?: number,
  network?: string,
  protocol?: string,
  address?: string,
  status?: number,
  creator?: string,
  createTime?: string,
  updater?: string,
  updateTime?: string
}

export interface UserWalletAddressListType extends ListDataType {
  list?: Array<UserWalletAddressType>
}

export interface UserWalletAddressReqType extends ListReqParamType {
  userId?: number
}

export type AddUserWalletReqType = {
  userId?: number,
  network?: string,
  protocol?: string,
  address?: string
}

export type WithdrawSubmitReqType = {
  nonce?: string,
  timestamp?: number,
  address?: string,
  amount?: number,
  userId?: number,
  type?: number
}

export type GENToUSDTReqType = {
  nonce?: string,
  userId?: number,
  type?: number,
  amount?: number
}

export type UpdateUserInfoReqType = {
  email?: string,
  nickName?: string,
  userId?: number
}

export type GENLogsType = {
  amount?: number,
  assetType?: number,
  beforeAmount?: number,
  createTime?: number,
  creator?: string,
  id?: number,
  remark?: string,
  status?: number,
  transactionIdv: string,
  updateTime?: number,
  updater?: string,
  userId?: number,
  name?: string
}

export interface GENLogListType extends ListDataType {
  list?: Array<GENLogsType>
}

export type DepositUsdtItemType = {
  userId: string,
  fromAddress: string,
  amount: string,
  hash: string,
  createTime: number
}

export interface DepositUsdtListType extends ListDataType {
  list?: Array<DepositUsdtItemType>
}

export type USDTWithdrawType = {
  address?: string,
  amount?: number,
  currency?: string,
  fee?: number,
  id?: number,
  transId?: string,
  transferStatus?: number,
  userId?: number,
  createTime?: number
}

export interface USDTWithdrawListType extends ListDataType {
  list?: Array<USDTWithdrawType>
}

export type TeamInfoDataType = {
  userId?: number,
  totalCount?: number,
  totalCountLevel1?: number,
  totalCountLevel2?: number,
  commissionCount?: number,
  commissionUsers?: number,
  commissionAmount?: number,
  commissionCountLevel1?: number,
  commissionUsersLevel1?: number,
  commissionAmountLevel1?: number,
  amountLevel1?: number,
  commissionCountLevel2?: number,
  commissionUsersLevel2?: number,
  commissionAmountLevel2?: number,
  amountLevel2?: number,
  svipCount?: number,
  svipUsers?: number,
  svipAmount?: number,
  svipCountLevel1?: number,
  svipUsersLevel1?: number,
  svipAmountLevel1?: number,
  svipCountLevel2?: number,
  svipUsersLevel2?: number,
  svipAmountLevel2?: number,
  miningCount?: number,
  miningUsers?: number,
  miningAmount?: number,
  commissionAmountNFT?: number,
  commissionAmountNFTLevel1?: number,
  commissionAmountNFTLevel2?: number
}

export type TeamRecordItemType = {
  userId?: number,
  inviteeNum?: number,
  amount?: number,
  nickName?: string,
  amountByUsdt?: number,
  nftNum?: number
}

export type TaskItemType = {
  id?: number,
  name?: string,
  imageUrl?: string,
  description?: string,
  detail?: any,
  period?: number,
  profit?: number,
  profitCurrency?: number,
  doLimit?: number,
  status?: number,
  createTime?: number,
  isDone?: boolean
}

export type RankItemType = {
  avatar?: string,
  createTime?: number,
  rankVal?: number,
  status?: number,
  userId?: number,
  userName?: string,
  rank?: string,
}

export type StakingItemType = {
  "id": number,
  "name": string,
  "type": number,
  amount: number,
  "beginTime": number,
  "endTime": number,
  "hours": number,
  "ratio": number,
  "ratioStr": string,
  "dailyRatio": number,
  "dailyRatioStr": string,
  "yearRatio": number,
  "yearRatioStr": string,
  "dailyProfit": number,
  "yearProfit": number,
  "profit": number,
  "maxLimit": number,
  "minLimit": number,
  "assetType": number,
  "status": number,
  "createTime": number
}

export type StakingOrderType = {
  "id": number,
  "name": string,
  "type": number,
  "beginTime": number,
  "endTime": number,
  "hours": number,
  "ratio": number,
  "ratioStr": string,
  "dailyRatio": number,
  "dailyRatioStr": string,
  "yearRatio": number,
  "yearRatioStr": string,
  "dailyProfit": number,
  "amount": number,
  "profit": number,
  "maxLimit": number,
  "minLimit": number,
  "assetType": number,
  "userId": number,
  "financialId": number,
  "remark": string,
  "status": number,
  "createTime": number,
  nodeName?: string,
  nodeId?: number
}

export interface StakingOrderListType extends ListDataType {
  list?: Array<StakingOrderType>
}

export type ConfirmPledgeType = {
  financeId: number,
  amount: number
}

export type NodeApplyReqType = {
  name: string,
  manifesto: string,
  link: string,
  type: number,
}

export type NodeItemType = {
  "id": number,
  "userId": number,
  "name": string,
  "desc": string,
  "manifesto": string,
  "link": string,
  "img": string,
  "type": number,
  "submitTime": number,
  "remark": string,
  "joinNum": number,
  "nftUsers": number,
  "nftNum": number,
  "pledgeUsers": number,
  "pledgeNum": number,
  "status": number,
  "createTime": number
}

export interface NodeListReqType extends ListReqParamType {
  name?: string
}

export interface NodeListResType extends ListDataType {
  list?: Array<NodeItemType>
}

export type NodePledgeDetail = {
  "id": number,
  "name": string,
  "type": number,
  "beginTime": number,
  "endTime": number,
  "hours": number,
  "ratio": number,
  "ratioStr": string,
  "dailyRatio": number,
  "dailyRatioStr": string,
  "yearRatio": number,
  "yearRatioStr": string,
  "dailyProfit": number,
  "yearProfit": number,
  "profit": number,
  "maxLimit": number,
  "minLimit": number,
  "assetType": number,
  "status": number,
  "createTime": number,
  nodeId?: number,
  nodeName?: string
}

export type ConfirmNodePledgeType = {
  financeId: number,
  nodeId: number,
  amount: number,
}


export type NodeNFTServiceType = {
  "id": number,
  "name": string,
  "imageUrl": string,
  "description": string,
  "detail": string,
  "period": number,
  "profit": number,
  "profitCurrency": number,
  "speed": number,
  "price": number,
  "priceCurrency": number,
  "validity": number,
  "type": number,
  "maxCount": number,
  "icon": string,
  "iconText": string,
  "status": number,
  "createTime": number,
  "nodeId": number,
  "nodeName": string,
  endTime?: number,
  actType?: number,
  oriPrice?: number,
  discount?: number,
  rewardsCurrency?: number,
  rewardsId?: number,
  rewards?: number,
  referralNum?: number,
  totalCount?: number,
  buyNum?: number
}

export type NodeStatsType = {
  pledgeGenAll: number,
  superNodeCount: number,
  showIncome: boolean
}

export type hasStatsType = {
  nodeId: number,
  status: boolean
}


export type NodeUserPledge = {
  id: number,
  name: string,
  amount: number,
  commission: number,
  profit: number,
  userId: number,
  userName: string,
  avatar: string,
  financialId: number,
  createTime: string
}

export type NodeUserPledgeType = {
  list: Array<NodeUserPledge>,
  total: number
}

export type NodeUserNft = {
  id: number,
  userId: number,
  userName: string,
  avatar: string,
  packageId: number,
  packageName: string,
  num: number,
  pay: number,
  payTime: string,
  expiration: string,
  referralCommission: number,
  nodeCommission: number,
  nodeId: number,
  nodeName: string
}

export type NodeUserNftType = {
  list: Array<NodeUserNft>,
  total: number
}


export type NodeUserStatsType = {
  nftAmount: number;
  nftCommissionAmount: number;
  nftCount: number;
  nftUsers: number;
  pledgeAmount: number;
  pledgeCommissionAmount: number;
  pledgeCount: number;
  pledgeUsers: number;
  userId: number;
}



export type NodeListType = {
  list: Array<NodeListStatsType>,
  total: number
}

export type NodeListStatsType = {
  "id": number,
  "nodeId": number,
  "userId": number,
  "userName": string,
  "nickName": string,
  "avatar": string,
  "nftCount": number,
  "nftAmount": number,
  "nftCommissionAmount": number,
  "pledgeCount": number,
  "pledgeAmount": number,
  "pledgeCommissionAmount": number,
  "pledgeCountU": number,
  "pledgeAmountU": number,
  "status": number,
  "updateTime": string
}

export type NodeServiceItemType = {
  avatar: string,
  packageImageUrl: string,
  "id": number,
  "userId": number,
  "packageId": number,
  "packageName": string,
  "period": number,
  "profit": number,
  "profitCurrency": number,
  "speed": number,
  "price": number,
  "priceCurrency": number,
  "validity": number,
  "type": number,
  "maxCount": number,
  "num": number,
  "pay": number,
  "payTime": number,
  "expiration": number,
  "status": number,
  "creator": string,
  "createTime": number,
  "updater": string,
  "updateTime": number,
  "nodeId": number,
  "nodeName": string
}

export interface NodeServiceListResType extends ListDataType {
  list?: Array<NodeServiceItemType>
}

export type WithdrawInfoType = {
  enabled: boolean,
  withdrawFee: number
}

export type RewardTaskLItemType = {
  "id": number,
  "name": string,
  "beginTime": number,
  "endTime": number,
  "type": number,
  "referralCountA": number,
  "upgrade": number,
  "amount": number,
  "amountType": number,
  "status": number,
  "createTime": number,
  "hasDone": boolean
}

export type GoogleAuthResType = {
  hasAuthed: boolean,
  qrCode: string,
  authToken: string,
  timeout: number,
  twoFactorCode: string,
}

export type PrizeActivityItemType = {
  "id": number,
  "name": string,
  "description": string,
  "url": string,
  "imageUrl": string,
  "startTime": number,
  "endTime": number,
  "totalPrize": number,
  "usdt": number,
  "minReferral": number,
  "maxProfit": number,
  "avgProfit": number,
  "referralCode": string,
  "status": number,
  "createTime": number
}

export type PrizeActivityDetailsType = {
  "id"?: number,
  "name"?: string,
  "url"?: string,
  "imageUrl"?: string,
  "startTime"?: number,
  "endTime"?: number,
  "minReferral"?: number,
  "totalPrize"?: number,
  "usdt"?: number,
  "avgProfit"?: number,
  "maxProfit"?: number,
  "minProfit"?: number,
  "referralCount"?: number,
  "referralCode"?: string,
  "status"?: number,
  "amount"?: number
}

export interface PrizeActivityListResType extends ListDataType {
  list?: Array<PrizeActivityItemType>
}

export type WithdrawLimitInfoType = {
  limitType: number,
  nft: ServicePackageType,
  nftBuyCount: number,
  nftBuyLimit: number,
  nftId: number
}

export type TurntableOptionType = {
  amount?: number,
  assetType?: string,
  id?: number,
  ratio?: number,
}

export interface AssetsLogReqParamsType extends ListReqParamType {
  name?: string,
  assetType?: number
}

export type FreezeBalanceStateType = {
  usdn?: number;
  usdt?: number;
}
