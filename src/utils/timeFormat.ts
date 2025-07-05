
export function formatTimeDifference(startTimestamp: number, endTimestamp: number) {
  const distance = endTimestamp - startTimestamp;

  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  }
}

export function formatHoursToDay(hours: number): string {
  const days = hours / 24;
  return days % 1 === 0 ? days.toString() : days.toFixed(2);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTimestampYYYYMMDD(timestamp: number): string {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatTimestampToDHMS(milliseconds: number): string {
  if (milliseconds < 0) {
    return '0d 0h 0m 0s'
  }
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60

  return `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
}

export type TimeDHMSStateType = {
  day: string,
  hours: string,
  minutes: string,
  seconds: string
}

export function formatTimestampToDHMSState(milliseconds: number): TimeDHMSStateType {
  if (milliseconds < 0) {
    return {
      day: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    }
  }
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60

  return {
    day: String(days).padStart(2, '0'),
    hours: String(remainingHours).padStart(2, '0'),
    minutes: String(remainingMinutes).padStart(2, '0'),
    seconds: String(remainingSeconds).padStart(2, '0')
  }
}

export function formatTimestampToDHMSNumState(milliseconds: number) {
  if (milliseconds < 0) {
    return {
      day: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60

  return {
    day: days,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds
  }
}
