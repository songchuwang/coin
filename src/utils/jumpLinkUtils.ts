// import {getTelegramWebApp} from "@/tools/telegram.ts";
import {textCopyToClipboard} from "@/utils/textUtils.ts";


export const jumpHelpLink = (username: string) => {
  // const webApp = getTelegramWebApp()
  // webApp.openTelegramLink(`https://t.me/${username}`)

  textCopyToClipboard(`@${username}`)
}
