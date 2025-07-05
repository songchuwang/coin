

export const isAndroidBelow10 = ()=> {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/android/i.test(userAgent)) {
    const match = userAgent.match(/Android\s([0-9.]+)/);
    if (match && match[1]) {
      const version = parseFloat(match[1]);
      return version < 10;
    }
  }

  return false;
}
