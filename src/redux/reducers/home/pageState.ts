import {
  hasStatsType,
  LevelUpgradeType, NodeItemType, NodeListStatsType, NodeNFTServiceType, NodeStatsType,
  NodeUserNftType,
  NodeUserPledgeType,
  NodeUserStatsType,
  RankItemType, RewardTaskLItemType,
  ServicePackageType,
  TaskItemType,
  TeamInfoDataType,
} from "@/types";
import {
  HAS_NODE_STATE,
  SER_LEVEL_UPGRADE_LIST,
  SER_SERVICE_PACKAGE_LIST,
  SET_HOME_ACTIVITY_NFT_DATA, SET_HOME_LIMIT_NFT,
  SET_HOME_SCREEN,
  SET_INIT_LOADING, SET_KLINE_DATA,
  SET_NODE_LIST,
  SET_NODE_STATE,

  SET_NODE_USER_STATE,
  SET_RANK_LIST,
  SET_REWARD_TASK_LIST, SET_SUPER_NFT_ACTIVITY,
  SET_TASK_LIST,
  SET_TEAM_INFO_DATA, SET_WITHDRAW_NFT_DATA
} from "@/constants/ActionTypes.ts";


export type PageStateInitialStateTyp = {
  servicePackageList?: Array<ServicePackageType>,
  levelUpgradeList?: Array<LevelUpgradeType>,
  teamState?: TeamInfoDataType,
  taskList?: Array<TaskItemType>,
  rankList?: Array<RankItemType>,
  rewardTaskList?: Array<RewardTaskLItemType>,
  nodeList?: Array<NodeItemType>,
  nodeState?: NodeStatsType,
  nodeHasStats?: hasStatsType,
  nodeUserState?: NodeUserStatsType,
  nodeUserPledge?: NodeUserPledgeType,
  nodeUserNft?: NodeUserNftType,
  nodeListStats?: Array<NodeListStatsType>,
  initLoading?: boolean,
  isHomeScreen?: boolean,
  homeActivityNFTData?: Array<NodeNFTServiceType>,
  homeLimitNftList?: Array<NodeNFTServiceType>,
  superNFTActivityList?: Array<NodeNFTServiceType>
  withdrawNFTActivityList?: Array<NodeNFTServiceType>
}

const initialState: PageStateInitialStateTyp = {
  servicePackageList: [],
  levelUpgradeList: [],
  teamState: null,
  taskList: [],
  rankList: [],
  rewardTaskList: [],
  nodeList: [],
  nodeState: null,
  nodeHasStats: null,
  nodeUserState:  {

    nftAmount: 0,
    nftCommissionAmount: 0,
    nftCount: 0,
    nftUsers: 0,
    pledgeAmount: 0,
    pledgeCommissionAmount: 0,
    pledgeCount: 0,
    pledgeUsers: 0,
    userId: 0
  },
  initLoading: true,
  isHomeScreen: false,
  homeActivityNFTData: [],
  homeLimitNftList: [],
  superNFTActivityList: [],
  withdrawNFTActivityList: []
}

const pageState = (state = initialState, data: { type: string, payload: any }) => {
  switch (data.type) {
    case SER_SERVICE_PACKAGE_LIST:
      return {
        ...state,
        servicePackageList: data.payload
      }
    case SER_LEVEL_UPGRADE_LIST:
      return {
        ...state,
        levelUpgradeList: data.payload
      }
    case SET_TEAM_INFO_DATA:
      return {
        ...state,
        teamState: data.payload
      }
    case SET_TASK_LIST:
      return {
        ...state,
        taskList: data.payload
      }
    case SET_RANK_LIST:
      return {
        ...state,
        rankList: data.payload
      }
    case SET_REWARD_TASK_LIST:
      return {
        ...state,
        rewardTaskList: data.payload
      }
    case SET_NODE_LIST:
      return {
        ...state,
        nodeList: data.payload
      }
    case SET_NODE_STATE:
      return {
        ...state,
        nodeState: data.payload
      }
    case HAS_NODE_STATE:
      console.log('HAS_NODE_STATE', state)

      console.log('HAS_NODE_STATE', data.payload)
      return {
        ...state,
        nodeHasStats: data.payload
      }
    case SET_NODE_USER_STATE:
      return {
        ...state,
        nodeUserState: data.payload
      }
    case SET_INIT_LOADING:
      return {
        ...state,
        initLoading: data.payload
      }
    case SET_HOME_SCREEN:
      return {
        ...state,
        isHomeScreen: data.payload
      }
    case SET_HOME_ACTIVITY_NFT_DATA:
      return {
        ...state,
        homeActivityNFTData: data.payload
      }
    case SET_HOME_LIMIT_NFT:
      return {
        ...state,
        homeLimitNftList: data.payload
      }
    case SET_KLINE_DATA:
      return {
        ...state,
        kLineData: data.payload
      }
    case SET_SUPER_NFT_ACTIVITY:
      return {
        ...state,
        superNFTActivityList: data.payload
      }
    case SET_WITHDRAW_NFT_DATA:
      return {
        ...state,
        withdrawNFTActivityList: data.payload
      }
    default:
      return state
  }
}

export default pageState
