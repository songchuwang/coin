import {message} from "antd";
import i18n from "@/locales/index.ts"
import {MAIN_CURRENCY_COIN} from "@/config/appConfig.ts";

export function textCopyToClipboard(text: string) {

  // 创建一个隐藏的文本域
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // 将文本域添加到文档中
  document.body.appendChild(textarea);

  // 选择文本域中的文本
  textarea.select();
  textarea.setSelectionRange(0, 99999); // 对移动设备的兼容性处理

  try {
    // 执行复制命令
    document.execCommand('copy');
    message.success(i18n.t("common_copy_success" as any))
  } catch (err) {
    console.error('error', err);
  }

  // 移除文本域
  document.body.removeChild(textarea);
}

export async function textCopyToClipboardV2(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    message.success(i18n.t("common_copy_success" as any))
  } catch (e) {
    console.error('error', e);
  }
}


export const formatUnitByCurrency = (currency: number): string => {
  if (currency === 1) return "USDT"
  if (currency === 2) return MAIN_CURRENCY_COIN
}


export const formatPriceIfUsdt = (currency: number, amount: number): number => {
  if (currency === 1) {
    return amount / 1000000
  }
  return amount / 100
}
