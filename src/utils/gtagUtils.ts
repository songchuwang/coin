// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const gtagSendEvent = (type: string, option: object) => {
  if (window['gtag']) {
    window['gtag']('event', type, {
      event_category: 'click',
      ...option
    })
  }
}
