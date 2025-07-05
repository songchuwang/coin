import {
  SET_ACTIVITY_FILL_IDS,
  SET_ACTIVITY_STATE,
  SET_ASSETS_STATE,
  SET_FOLLOWED_LIST, SET_FREEZE_BALANCE,
  SET_LOGIN_USER_INF, SET_NFT_BUY_HINT_VIS,
  SET_RATE_GEN_TO_USDT,
  SET_USER_INFO_DATA, SET_USER_INVITE_URL,
  SET_USER_REFERRAL_CODE
} from "@/constants/ActionTypes.ts";
import {AssetsStateType, FreezeBalanceStateType, PrizeActivityItemType} from "@/types";

export type UserAuthDataType = {
  accessToken?: string,
  expiresTime?: number,
  openid?: any,
  refreshToken?: string,
  userId?: number
}

export type UserInfoDataType = {
  userId?: number,
  email?: string,
  avatar?: string,
  nickName?: string,
  level?: number,
  period?: number,
  speed?: number,
  price?: number,
  priceCurrency?: number,
  status?: number,
  usdt?: number,
  usdn?: number,
  usdn2usdt?: number,
  inviterName?: string,
  isMax?: boolean,
  withdrawAmount?: number,
  referralCountA?: number,
  referralCountB?: number,
  rechargeAmount?: number,
}

export type UserInfoInitialStateType = {
  userAuthData?: UserAuthDataType,
  userInfo?: UserInfoDataType,
  rateGENToUSDT?: number,
  referralCode?: string,
  inviteUrl?: string,
  followedList?: Array<number>,
  assetsState?: AssetsStateType,
  activityState?: PrizeActivityItemType
  activityFillIds?: Array<number>,
  isOpenBuyHint?: boolean,
  freezeBalanceState?: FreezeBalanceStateType
}

const initialState: UserInfoInitialStateType = {
  userAuthData: null,
  userInfo: null,
  rateGENToUSDT: 0,
  referralCode: null,
  inviteUrl: '',
  followedList: [],
  assetsState: null,
  activityState: null,
  activityFillIds: [],
  isOpenBuyHint: false,
  freezeBalanceState: {
    usdt: 0,
    usdn: 0
  }
}

const userInfo = (state = initialState, data: { type: string, payload: any }) => {
  switch (data.type) {
    case SET_LOGIN_USER_INF:
      return {
        ...state,
        userAuthData: data.payload
      }
    case SET_USER_INFO_DATA:
      return {
        ...state,
        userInfo: {
          ...data.payload,
          usdn: data.payload.usdn / 100,
          speed: data.payload.speed / 100,
        },
      }
    case SET_USER_REFERRAL_CODE:
      return {
        ...state,
        referralCode: data.payload
      }
    case SET_RATE_GEN_TO_USDT:
      return {
        ...state,
        rateGENToUSDT: data.payload
      }
    case SET_USER_INVITE_URL:
      return {
        ...state,
        inviteUrl: data.payload
      }
    case SET_FOLLOWED_LIST:
      return {
        ...state,
        followedList: data.payload ?? []
      }
    case SET_ASSETS_STATE:
      return {
        ...state,
        assetsState: {
          ...data.payload,
          usdn: data.payload.usdn / 100,
          gnet: data.payload.gnet / 100
        }
      }
    case SET_ACTIVITY_STATE:
      return {
        ...state,
        activityState: data.payload
      }
    case SET_ACTIVITY_FILL_IDS:
      return {
        ...state,
        activityFillIds: data.payload
      }
    case SET_NFT_BUY_HINT_VIS:
      return {
        ...state,
        isOpenBuyHint: data.payload
      }
    case SET_FREEZE_BALANCE:
      return {
        ...state,
        freezeBalanceState: data.payload
      }
    default:
      return state
  }
}

export default userInfo
