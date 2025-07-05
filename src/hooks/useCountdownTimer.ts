

import { useState, useEffect } from 'react';

const useCountdownTimer = (initialSeconds) => {
  const [time, setTime] = useState(initialSeconds);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 10 : 0));
    }, 10);

    return () => clearInterval(countdown);
  }, []);

  // 计算各个部分
  const days = Math.floor(time / 86400000);
  const hours = Math.floor((time % 86400000) / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;

  // 补零
  const formattedDays = String(days).padStart(2, '0');
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMilliseconds = String(milliseconds).padStart(3, '0');

  return {
    milliseconds: formattedMilliseconds,
    seconds: formattedSeconds,
    minutes: formattedMinutes,
    hours: formattedHours,
    days: formattedDays
  };
};

export default useCountdownTimer;
