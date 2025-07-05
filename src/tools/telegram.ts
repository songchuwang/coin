
export type HapticType = {
  impactOccurred: (style: string) => void,
}

export type BackButtonType = {
  show: () => void,
  hide: () => void
}

export type AppUserType = {
  id: number,
  is_bot: boolean,
  first_name: string,
  last_name: string,
  username: string,
  language_code: string,
  photo_url: string,
}

export type InitDataType = {
  user: AppUserType
}

export type TGWebAppType = {
  initData: string,
  initDataUnsafe: InitDataType,
  isExpanded: boolean,
  HapticFeedback: HapticType,
  setHeaderColor: (color: string) => void,
  setBackgroundColor: (color: string) => void,
  setBottomBarColor: (color: string) => void,
  openLink: (url: string) => void,
  openTelegramLink: (url: string) => void,
  ready: () => void,
  expand: () => void,
  close: () => void,
  disableVerticalSwipes: () => void,
  enableVerticalSwipes: () => void,
  onEvent: (eventType: string, eventHandler: () => void) => void,
  offEvent: (eventType: string, eventHandler: () => void) => void,
  enableClosingConfirmation: () => void,
  BackButton: BackButtonType,
  showScanQrPopup: (title: string, callBack: (v: any) => void) => void,
  headerColor: string,
  backgroundColor: string,
  bottomBarColor: string

}

let webApp: TGWebAppType|null = null


export const initTelegram = () => {

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  webApp = window["Telegram"].WebApp as TGWebAppType

  if (!webApp.isExpanded) {
    webApp.expand()
  }
  webApp.setHeaderColor("#000000")
  webApp.setBackgroundColor("#000000")
  webApp.setBottomBarColor("#000000")
  webApp.disableVerticalSwipes()
  webApp.enableClosingConfirmation()

}

export const getTelegramUserData = (): AppUserType => {
  return <AppUserType>webApp?.initDataUnsafe?.user
}

export const getTelegramWebApp = (): TGWebAppType => {
  return <TGWebAppType>webApp
}
