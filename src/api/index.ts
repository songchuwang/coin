import request from "@/utils/request";
import {
  AddUserWalletReqType, AssetsLogReqParamsType,
  AssetsStateType, BuyServiceOrderListReqType,
  ConfirmNodePledgeType,
  ConfirmPledgeType, DepositUsdtListType,
  GENLogListType,
  GENToUSDTReqType, GoogleAuthResType,
  hasStatsType,
  LevelUpgradeReqType,
  LevelUpgradeType,
  ListReqParamType,
  LoginParamsType,
  LoginResDataType,
  NodeApplyReqType,
  NodeItemType,
  NodeListReqType,
  NodeListResType,
  NodeListType,
  NodeNFTServiceType,
  NodePledgeDetail, NodeServiceListResType, NodeStatsType,
  NodeUserNftType,
  NodeUserPledgeType,
  NodeUserStatsType, PrizeActivityDetailsType, PrizeActivityListResType,
  RankItemType,
  RateReqParamsType,
  RateResDataType, RewardTaskLItemType,
  ServicePackageType,
  ServiceSubmitReqType,
  StakingItemType, StakingOrderListReqType,
  StakingOrderListType,
  TaskItemType,
  TeamInfoDataType,
  TeamRecordItemType, TurntableOptionType,
  UpdateUserInfoReqType,
  USDTWithdrawListType,
  UserWalletAddressListType,
  UserWalletAddressReqType,
  WalletAddressDataType, WithdrawInfoType, WithdrawLimitInfoType,
  WithdrawSubmitReqType
} from "@/types";
import {UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {MiningInfoType} from "@/redux/reducers/user/miningInfo.ts";
import {AxiosRequestConfig} from "axios";


export const APIUserLogin = <T = LoginResDataType>(data: LoginParamsType, config?: AxiosRequestConfig) => {
  return request.post<T>("/app-api/member/auth/tg-login", {...data}, config)
}

export const APIUserInfo = <T = UserInfoDataType>(config?: AxiosRequestConfig) => {
  return request.get<T>("/app-api/user/info", config)
}

export const APIMiningInfo = <T = MiningInfoType>(config?: AxiosRequestConfig) => {
  return request.get<T>("/app-api/user/mining/info", {...config})
}

export const APIRateGENExUSDT = <T = RateResDataType>(data: RateReqParamsType, config?: AxiosRequestConfig) => {
  return request.post<T>("/app-api/asset/calc/exchange/usdn/2/usdt", data, config)
}

export const APIStartMining = <T = MiningInfoType>() => {
  return request.get<T>("/app-api/user/mining/start")
}

export const APIMiningClaim = <T = MiningInfoType>() => {
  return request.get<T>("/app-api/user/mining/claim")
}

export const APIReferralCode = <T = {userId: number, code: string}>() => {
  return request.get<T>('/app-api/user/referral/getCode')
}

export const APILevelUpgradeList = <T = Array<LevelUpgradeType>>() => {
  return request.get<T>('/app-api/user/level/list')
}

export const APIServicePackageInfo = <T = ServicePackageType>(id: number) => {
  return request.get<T>('/app-api/service/package/get', { params: {id} })
}

export const APIServiceBuySubmit = <T = boolean>(data: ServiceSubmitReqType) => {
  return request.post<T>('/app-api/service/package/buy', data)
}

export const APILevelUpgradeSubmit = <T = boolean>(data: LevelUpgradeReqType) => {
  return request.post<T>('/app-api/user/level/upgrade', data)
}

export const APIAssetsInfo = <T = AssetsStateType>() => {
  return request.get<T>('/app-api/asset/info')
}

export const APIWalletAddressData = <T = WalletAddressDataType>() => {
  return request.get<T>('/app-api/wallet/system/address')
}

export const APIUserWalletAddressList = <T = UserWalletAddressListType>(params: UserWalletAddressReqType) => {
  return request.get<T>('/app-api/wallet/user/address/list', { params: params })
}

export const APIUserWalletAddressDelete = <T = boolean>(id: number) => {
  return request.delete<T>('/app-api/wallet/user/address/delete', { params: {id} })
}

export const APIAddUserWalletAddress = <T = number>(data: AddUserWalletReqType) => {
  return request.post<T>('/app-api/wallet/user/address/create', data)
}

export const APISubmitWithdraw = <T = boolean>(data: WithdrawSubmitReqType) => {
  return request.post<T>('/app-api/asset/bitcoin/withdraw', data)
}

export const APIGenExchangeLogs = <T = GENLogListType>(params: ListReqParamType, cancelToken?: any) => {
  return request.get<T>('/app-api/asset/usdn/logs/page', { params, cancelToken: cancelToken })
}

export const APIUSDTExchangeLogs = <T = GENLogListType>(params: ListReqParamType, cancelToken?: any) => {
  return request.get<T>('/app-api/asset/usd/logs/page', { params, cancelToken: cancelToken })
}

export const APIGENtoUSDT = <T = boolean>(data: GENToUSDTReqType) => {
  return request.post<T>('/app-api/asset/exchange/usdn/2/usdt', data)
}

export const APIUSDTtoGEN = <T = boolean>(data: GENToUSDTReqType) => {
  return request.post<T>('/app-api/asset/exchange/usdt/2/usdn', data)
}

export const APIUpdateUserInfo = (data: UpdateUserInfoReqType) => {
  return request.post('/app-api/user/info/update', data)
}

export const APIWithdrawRecord = <T = USDTWithdrawListType>(params: ListReqParamType) => {
  return request.get<T>('/app-api/asset/bitcoin/withdraw/logs/page', { params })
}

export const APIGetInviteUrl = <T = string>() => {
  return request.get<T>('/app-api/bot/inviteLink')
}

export const APIGetCaptchaCode = () => {
  return request.get('/app-api/captcha/get')
}

export const APISubmitFeedback = (data: {msg: string, pics?: string}) => {
  return request.post('/app-api/feedback/submit', data)
}

export const APITeamInfoData = <T = TeamInfoDataType>() => {
  return request.get<T>('/app-api/user/referral/stats')
}

export const APITeamRecordList = <T = Array<TeamRecordItemType>>(level: string) => {
  return request.get<T>('/app-api/user/referral/users/stats', { params: { level } })
}

export const APITaskList = <T = Array<TaskItemType>>() => {
  return request.get<T>('/app-api/task/list')
}

export const APITaskDone = (id: number) => {
  return request.get('/app-api/task/done', { params: {id} })
}

export const APIRankList = <T = Array<RankItemType>>(type: number) => {
  return request.get<T>('/app-api/rank/list', {params: {type}})
}

export const APIStakingList = <T = Array<StakingItemType>>(params: ListReqParamType) => {
  return request.get<T>('/app-api/staking/list', { params })
}

export const APIStakingDetails = <T = StakingItemType>(id: number) => {
  return request.get<T>('/app-api/staking/get', { params: {id} })
}

export const APIConfirmStaking = <T = boolean>(data: ConfirmPledgeType | ConfirmNodePledgeType) => {
  return request.post<T>('/app-api/staking/submit', data)
}

export const APIStakingOrder = <T = StakingOrderListType>(params: StakingOrderListReqType) => {
  return request.get<T>('/app-api/staking/order/page', {params})
}

export const APIStakingTeamOrder = <T = StakingOrderListType>(params: ListReqParamType) => {
  return request.get<T>('/app-api/staking/referral/order/page', {params})
}

export const APINodeApply = (data: NodeApplyReqType) => {
  return request.post('/app-api/node/apply', data)
}

export const APINodeList = <T = NodeListResType>(params: NodeListReqType) => {
  return request.get<T>('/app-api/node/page', { params: params})
}

export const APINodeHasStats = <T = hasStatsType>() => {
  return request.get<T>('/app-api/node/hasNode')
}

export const APINodePledgeDetails = <T = NodePledgeDetail>(nodeId: number) => {
  return request.get<T>('/app-api/node/pledge/getByNode', { params: {nodeId} })
}

export const APINodeDetail = <T = NodeItemType>(nodeId: number) => {
  return request.get<T>('/app-api/node/get', { params: {id: nodeId} })
}

export const APINodeServiceDetails = <T = NodeNFTServiceType>(nodeId: number) => {
  return request.get<T>('/app-api/node/nft/getByNode', { params: {nodeId} })
}

export const APINodeStats = <T = NodeStatsType>() => {
  return request.get<T>('/app-api/node/stats')
}

export const APINodeUserPledge = <T = NodeUserPledgeType>(nodeId: number,userId:string,pageNo:number=1,pageSize:number=30,status:number=0,orderBy:string='') => {
  return request.get<T>('/app-api/node/user/pledge/page',{ params: {nodeId, userId, pageNo: pageNo, pageSize: pageSize, status: status, orderBy: orderBy} })
}

export const APINodeUserNft = <T = NodeUserNftType>(nodeId: number,userId:string,pageNo:number=1,pageSize:number=30,status:number=0,orderBy:string='') => {
  return request.get<T>('/app-api/node/user/nft/page',{ params: {nodeId, userId, pageNo: pageNo, pageSize: pageSize, status: status, orderBy: orderBy} })
}

export const APINodeUserStats = <T = NodeUserStatsType>(nodeId: number) => {
  return request.get<T>('/app-api/node/user/stats', { params: {nodeId} })
}

export const APINodeListStats = <T = NodeListType>(nodeId: number,pageNo:number=1,pageSize:number=10,status:number=0,orderBy:string='') => {
  return request.get<T>('/app-api/node/user/page', { params: {nodeId, pageNo: pageNo, pageSize: pageSize, status: status, orderBy: orderBy} })
}

export const APIBuyServiceList = <T = NodeServiceListResType>(params: BuyServiceOrderListReqType) => {
  return request.post<T>('/app-api/service/package/order/page', params)
}

export const APIDepositUsdtLogs = <T = DepositUsdtListType>(params: ListReqParamType, cancelToken?: any) => {
  return request.get<T>('/app-api/wallet/recharge/page', { params, cancelToken: cancelToken })
}

export const APICanExchange = <T = boolean>() => {
  return request.get<T>('/app-api/asset/can/exchange/gen2usdt', {})
}

export const APIWithdrawInfo = <T = WithdrawInfoType>() => {
  return request.get<T>('/app-api/asset/bitcoin/withdraw/fee', {})
}

export const APIRewardTaskList = <T = Array<RewardTaskLItemType>>() => {
  return request.post<T>('/app-api/reward/list', {})
}

export const APIGoogleAuthCode = <T = GoogleAuthResType>() => {
  return request.get<T>('/app-api/google/code/getAuthQrCode')
}

export const APIBindGoogleAuth = <T = boolean>(data: {authToken: string, inputCode: string}) => {
  return request.post<T>('/app-api/google/code/bind', data)
}

export const APIActivityList = <T = PrizeActivityListResType>(params: ListReqParamType) => {
  return request.get<T>('/app-api/activity/page', {params})
}

export const APIActivityDetails = <T = PrizeActivityDetailsType>(id: number) => {
  return request.get<T>('/app-api/activity/detail', {params: {id}})
}

export const APIActivityClaim = <T = boolean>(id: number) => {
  return request.get<T>('/app-api/activity/claim', {params: {id}})
}

export const APIWithdrawLimitInfo = <T = WithdrawLimitInfoType>() => {
  return request.get<T>('/app-api/withdraw/limit')
}

export const APIWithdrawNFTBuy = <T = boolean>(data: ServiceSubmitReqType) => {
  return request.post<T>('/app-api/withdraw/nft/buy', data)
}

export const APINFTActivityList = <T = Array<NodeNFTServiceType>>() => {
  return request.get<T>('/app-api/activity/getNftActivity')
}

export const APINewUserLimitNFTList = <T = Array<NodeNFTServiceType>>() => {
  return request.get<T>('/app-api/activity/new/user/nft')
}

export const APIHomeNFTInviteLink = <T = {url: string, desc: string}>() => {
  return request.get<T>('/app-api/bot/NftInviteLink')
}

export const APIMiningActivityList = <T = Array<NodeNFTServiceType>>() => {
  return request.get<T>('/app-api/activity/getMiningActivity')
}

export const APIMiningActivityInviteLink = <T = {url: string, desc: string}>(refId: string) => {
  return request.get<T>('/app-api/bot/miningInviteLink', {params: {refId}})
}

// export const APIKLineData = <T = {tradeCoins: Array<KLineDataType>}>(config?: AxiosRequestConfig) => {
//   return request.get<T>('/app-api/quote/kdataView', config)
// }

export const APITurntableReward = <T = {drawWheelGain: TurntableOptionType, availableNum: number, totalNum: number}>(actId: number) => {
  return request.post<T>("/app-api/activity/wheel/draw", {actId})
}

export const APITurntableInviteLink = <T = {desc: string, url: string}>() => {
  return request.get<T>("/app-api/bot/drawWheelInviteLink")
}

export const APINFTSuperActivity = <T = Array<NodeNFTServiceType>>() => {
  return request.get<T>("/app-api/activity/getNftSuperActivity")
}

export const APIAssetUserLogs = <T = GENLogListType>(data: AssetsLogReqParamsType) => {
  return request.post<T>("/app-api/asset/user/logs/page", data)
}

export const APIAPPConfig = <T = any>(params: {name: string}) => {
  return request.get<T>("/app-api/config/name", {params: params})
}

export const APIWithdrawInviteLink = <T = string>() => {
  return request.get<T>("/app-api/bot/withdrawInviteLink")
}

export const APIWithdrawNFTCard = <T = Array<NodeNFTServiceType>>() => {
  return request.get<T>("/app-api/activity/getWithdrawActivity")
}

export const APIWithdrawPackageList = <T = Array<ServicePackageType>>() => {
  return request.get<T>("/app-api/service/package/listWithdraw")
}

