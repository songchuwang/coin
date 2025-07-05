import {
  ADD_BOOT_ID,
  ADD_TO_NUMBER,
  HAS_NODE_STATE,
  RESET_MINING_STATE,
  SER_LEVEL_UPGRADE_LIST,
  SER_SERVICE_PACKAGE_LIST,
  SET_ACTIVITY_FILL_IDS,
  SET_ACTIVITY_STATE,
  SET_ASSETS_STATE,
  SET_FOLLOWED_LIST, SET_FREEZE_BALANCE,
  SET_HOME_ACTIVITY_NFT_DATA,
  SET_HOME_LIMIT_NFT,
  SET_HOME_SCREEN,
  SET_INIT_LOADING,
  SET_LOADING_MODAL_VIS,
  SET_LOGIN_USER_INF,
  SET_MINING_DATA,
  SET_MINING_STATE, SET_NFT_BUY_HINT_VIS,
  SET_NODE_LIST,
  SET_NODE_STATE,
  SET_NODE_USER_STATE,
  SET_RANK_LIST,
  SET_RATE_GEN_TO_USDT,
  SET_REWARD_TASK_LIST,
  SET_SUPER_NFT_ACTIVITY, SET_SUPPORT_NAME,
  SET_TASK_LIST,
  SET_TEAM_INFO_DATA,
  SET_USER_INFO_DATA,
  SET_USER_INVITE_URL,
  SET_USER_REFERRAL_CODE, SET_WITHDRAW_NFT_DATA
} from "@/constants/ActionTypes.ts";
import {UserAuthDataType, UserInfoDataType} from "@/redux/reducers/user/userInfo.ts";
import {MiningInfoType, MiningStateType} from "@/redux/reducers/user/miningInfo.ts";
import {
  AssetsStateType, FreezeBalanceStateType, hasStatsType, NodeItemType, NodeNFTServiceType, NodeStatsType,

  NodeUserStatsType, PrizeActivityItemType,
  RankItemType,
  RewardTaskLItemType,
  ServicePackageType,
  TaskItemType,
  TeamInfoDataType,
} from "@/types";



export function addToNumber(payload: number) {
  return {
    type: ADD_TO_NUMBER,
    payload
  }
}

export function setLoginUserInfo(payload: UserAuthDataType) {
  return {
    type: SET_LOGIN_USER_INF,
    payload
  }
}

export function setUserInfoData(payload: UserInfoDataType) {
  return {
    type: SET_USER_INFO_DATA,
    payload
  }
}

export function setMiningData(payload: MiningInfoType) {
  return {
    type: SET_MINING_DATA,
    payload
  }
}

export function setMiningState(payload: MiningStateType) {
  return {
    type: SET_MINING_STATE,
    payload
  }
}

export function setLoadingModalVis(payload: boolean) {
  return {
    type: SET_LOADING_MODAL_VIS,
    payload
  }
}

export function setRateGENToUSDT(payload: number) {
  return {
    type: SET_RATE_GEN_TO_USDT,
    payload
  }
}

export function setReferralCode(payload: string) {
  return {
    type: SET_USER_REFERRAL_CODE,
    payload
  }
}

export function setServicePackageList(payload: Array<ServicePackageType>) {
  return {
    type: SER_SERVICE_PACKAGE_LIST,
    payload
  }
}

export function setLevelUpgradeList(payload: Array<ServicePackageType>) {
  return {
    type: SER_LEVEL_UPGRADE_LIST,
    payload
  }
}

export function resetMiningState() {
  return {
    type: RESET_MINING_STATE,
    payload: {}
  }
}

export function setAssetsState(payload: AssetsStateType) {
  return {
    type: SET_ASSETS_STATE,
    payload
  }
}

export function setInviteUrl(payload: string) {
  return {
    type: SET_USER_INVITE_URL,
    payload
  }
}

export function setTeamInfoData(payload: TeamInfoDataType) {
  return {
    type: SET_TEAM_INFO_DATA,
    payload
  }
}

export function setTaskList(payload: Array<TaskItemType>) {
  return {
    type: SET_TASK_LIST,
    payload
  }
}

export function setFollowedList(payload: Array<number>) {
  return {
    type: SET_FOLLOWED_LIST,
    payload
  }
}

export function setRankList(payload: Array<RankItemType>) {
  return {
    type: SET_RANK_LIST,
    payload
  }
}

export function addBootId(payload: number) {
  return {
    type: ADD_BOOT_ID,
    payload
  }
}

export function setRewardTaskList(payload: Array<RewardTaskLItemType>) {
  return {
    type: SET_REWARD_TASK_LIST,
    payload
  }
}

export function setNodeList(payload: Array<NodeItemType>) {
  return {
    type: SET_NODE_LIST,
    payload
  }
}

export function setNodeUserState(payload: NodeUserStatsType) {
  return {
    type: SET_NODE_USER_STATE,
    payload
  }
}

export function setNodeState(payload: NodeStatsType) {
  return {
    type: SET_NODE_STATE,
    payload
  }
}

export function setNodeHasStats(payload: hasStatsType) {
  return {
    type: HAS_NODE_STATE,
    payload
  }
}

export function setActivityState(payload: PrizeActivityItemType) {
  return {
    type: SET_ACTIVITY_STATE,
    payload
  }
}

export function setActivityFillIds(payload: Array<number>) {
  return {
    type: SET_ACTIVITY_FILL_IDS,
    payload
  }
}

export function setInitLoading(payload: boolean) {
  return {
    type: SET_INIT_LOADING,
    payload
  }
}

export function setHomeScreen(payload: boolean) {
  return {
    type: SET_HOME_SCREEN,
    payload
  }
}

export function setHomeActivityNFTData(payload: Array<NodeNFTServiceType>) {
  return {
    type: SET_HOME_ACTIVITY_NFT_DATA,
    payload
  }
}

export function setHomeLimitNFT(payload: Array<NodeNFTServiceType>) {
  return {
    type: SET_HOME_LIMIT_NFT,
    payload
  }
}

export function setSuperNFTActivity(payload: Array<NodeNFTServiceType>) {
  return {
    type: SET_SUPER_NFT_ACTIVITY,
    payload
  }
}

export function setNFTBuyHintVis(payload: boolean) {
  return {
    type: SET_NFT_BUY_HINT_VIS,
    payload
  }
}

export function setSupportName(payload: string) {
  return {
    type: SET_SUPPORT_NAME,
    payload
  }
}

export function setWithdrawNFTActivity(payload: Array<NodeNFTServiceType>) {
  return {
    type: SET_WITHDRAW_NFT_DATA,
    payload
  }
}

export function setFreezeBalance(payload: FreezeBalanceStateType) {
  return {
    type: SET_FREEZE_BALANCE,
    payload
  }
}
