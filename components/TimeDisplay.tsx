'use client';

import { useEffect, useState } from 'react';
import { format, addHours, subHours } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface WorldTime {
  city: string;
  offset: number;
  label: string;
}

const worldTimes: WorldTime[] = [
  { city: 'New York', offset: -12, label: 'America/New_York' },
  { city: 'London', offset: -7, label: 'Europe/London' },
  { city: 'Paris', offset: -6, label: 'Europe/Paris' },
  { city: 'Shanghai', offset: 0, label: 'Asia/Shanghai' },
  { city: 'Tokyo', offset: 1, label: 'Asia/Tokyo' },
  { city: 'Antarctica', offset: 5, label: 'Antarctica/Casey' },
];

const ClockFace = ({ time, city, className = '' }: { time: Date; city: string; className?: string }) => {
  const hours = format(time, 'HH');
  const minutes = format(time, 'mm');
  const date = format(time, 'MMM dd', { locale: enUS });
  const weekday = format(time, 'EEEE', { locale: enUS });

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* 背景圆环 */}
      <div className="absolute w-[200px] h-[200px] rounded-full border-8 border-black" />
      <div className="absolute w-[170px] h-[170px] rounded-full border-4 border-black" />
      
      {/* 时间显示 */}
      <div className="relative z-10 text-center pt-4">
        <div className="text-lg font-medium text-black mb-1">
          {weekday}
        </div>
        <div className="text-base font-medium text-black mb-3">
          {date}
        </div>
        
        <div className="flex items-center justify-center text-4xl font-medium tracking-tight text-black">
          <span className="inline-block w-[48px]">{hours}</span>
          <span className="mx-1 opacity-50">:</span>
          <span className="inline-block w-[48px]">{minutes}</span>
        </div>

        <div className="mt-3">
          <div className="text-lg font-medium text-black">{city}</div>
        </div>
      </div>
    </div>
  );
};

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[800px] h-[480px] bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent)] pointer-events-none" />
      
      <div className="w-full h-full flex items-center justify-center px-16">
        <div className="grid grid-cols-3 gap-x-24 gap-y-8 place-items-center">
          {worldTimes.map((worldTime) => {
            // 获取当前 UTC 时间
            const now = time;
            const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            // 用 offset 计算城市时间
            const cityTime = addHours(utcTime, worldTime.offset);
            return (
              <div
                key={worldTime.city}
                className="relative group"
              >
                <div className="absolute inset-0 bg-black/5 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ClockFace
                  time={cityTime}
                  city={worldTime.city}
                  className="relative transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay; 