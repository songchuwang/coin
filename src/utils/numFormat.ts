

export const numberKMFormat = (num: number) => {
  if (!num) {
    return '0'
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.?0+$/, '').toString() + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.?0+$/, '') + 'K';
    return num;
  } else {
    return Number(num).toFixed(4).replace(/\.?0+$/, '').toString()
  }
}

export const numberMFormat = (num: number) => {
  if (!num) {
    return '0'
  }
  if (num >= 1_000_000) {
    return (Math.floor(num / 1_000_000 * 10) / 10).toFixed(1).replace(/\.?0+$/, '').toString() + 'M';
  } else {
    return numberFormatToEnglish(num, 6)
  }
}

export const numberFormat3 = (num: number) => {
  return Number(num).toFixed(3).replace(/\.?0+$/, '').toString()
}

export const numberFormatToEnglish = (num: number, digit = 2) => {
  if (!num) {
    return 0
  }
  return num.toLocaleString('en-US',  {
    minimumFractionDigits: 0,
    maximumFractionDigits: digit,
  })
}

export const numberFormatToEnglishKMB = (num: number, digit: number = 1): string => {
  const factor = Math.pow(10, digit);

  if (num >= 1_000_000_000) {
    return (Math.floor(num / 1_000_000_000 * factor) / factor).toFixed(digit).replace(/\.0$/, '') + 'B';
  } else if (num >= 1_000_000) {
    return (Math.floor(num / 1_000_000 * factor) / factor).toFixed(digit).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000) {
    return (Math.floor(num / 1_000 * factor) / factor).toFixed(digit).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

export const numberFormatZero = (numData: number, digit: number = 1) => {
  const num = numberFormatToEnglish(numData, digit)
  const str = num.toString();
  if (!str.startsWith("0.")) return str; // 仅对小于1的数处理

  // 分离整数部分和小数部分
  const [intPart, decPart] = str.split(".");

  // 统计小数部分开始连续的 "0" 个数
  let zeroCount = 0;
  for (const ch of decPart) {
    if (ch === '0') {
      zeroCount++;
    } else {
      break;
    }
  }

  // 如果存在多个连续的 0，则用压缩形式表示
  if (zeroCount > 0) {
    // remainder 为第一个非零数字后面的字符串
    const remainder = decPart.slice(zeroCount);
    // 格式说明：在 "0." 后先显示一个 "0"，再用 {n} 表示有 n 个连续的 0，最后加上 remainder
    return `${intPart}.0{${zeroCount}}${remainder}`;
  }

  return str;
}
