'use client';

import { useEffect, useState } from 'react';
import { format, addHours } from 'date-fns';

interface CityTime {
  city: string;
  country: string;
  utcOffset: number;
}

const cities: CityTime[] = [
  { city: 'London', country: 'UK', utcOffset: 1 },
  { city: 'Los Angeles', country: 'US', utcOffset: -7 },
  { city: 'Beijing', country: 'CN', utcOffset: 8 },
];

const AnalogClock = ({ time }: { time: Date }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  return (
    <div className="clock-face relative">
      {/* Clock numbers */}
      {[...Array(12)].map((_, i) => {
        const number = i === 0 ? 12 : i;
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const radius = 80;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        return (
          <div
            key={i}
            className="absolute font-bold text-xl text-black"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              left: '50%',
              top: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-12px',
              marginTop: '-12px',
            }}
          >
            {number}
          </div>
        );
      })}
      
      {/* Small dots for minutes */}
      {[...Array(60)].map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const radius = 90;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        return (
          <div
            key={`dot-${i}`}
            className="absolute bg-black rounded-full w-1 h-1"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              left: '50%',
              top: '50%',
            }}
          />
        );
      })}
      
      {/* Hour hand */}
      <div
        className="absolute w-2 h-16 bg-black rounded-full origin-bottom"
        style={{
          transform: `rotate(${hourDegrees}deg)`,
          bottom: '50%',
          left: 'calc(50% - 1px)',
        }}
      />
      
      {/* Minute hand */}
      <div
        className="absolute w-1.5 h-24 bg-black rounded-full origin-bottom"
        style={{
          transform: `rotate(${minuteDegrees}deg)`,
          bottom: '50%',
          left: 'calc(50% - 0.75px)',
        }}
      />
      
      {/* Second hand */}
      <div
        className="absolute w-1 h-28 bg-red-500 rounded-full origin-bottom"
        style={{
          transform: `rotate(${secondDegrees}deg)`,
          bottom: '50%',
          left: 'calc(50% - 0.5px)',
        }}
      />
      
      {/* Center dot */}
      <div className="absolute w-4 h-4 bg-black rounded-full" style={{
        top: 'calc(50% - 8px)',
        left: 'calc(50% - 8px)',
      }} />
    </div>
  );
};

const TimeCard = ({ 
  city,
  country,
  time,
  date,
  utcOffset,
  isDaytime 
}: { 
  city: string;
  country: string;
  time: string;
  date: string;
  utcOffset: string;
  isDaytime: boolean;
}) => (
  <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl border border-gray-100">
    <div className="flex justify-between items-center mb-2">
      <div>
        <h2 className="text-2xl font-bold text-black">{city}, {country}</h2>
      </div>
    </div>
    <div className="text-[72px] font-bold tracking-wider mb-4 text-black">{time}</div>
    <div className="flex items-center justify-between text-lg text-black font-bold">
      <span>{date}</span>
      <span>{isDaytime ? 'Day' : 'Night'}</span>
    </div>
  </div>
);

const MainClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto mb-16">
      <div className="scale-75 origin-left">
        <AnalogClock time={currentTime} />
      </div>
      <div className="text-center flex-1 px-8">
        <h1 className="text-[120px] font-bold tracking-wider leading-none text-black">
          {format(currentTime, 'HH:mm:ss')}
        </h1>
        <div className="text-2xl mt-2 text-black font-bold">Local, New York</div>
        <div className="text-xl mt-1 text-black font-bold">
          {format(currentTime, 'MMMM d, yyyy')} ({format(currentTime, 'EEEE')})
        </div>
      </div>
      <div className="text-2xl text-black whitespace-nowrap"></div>
    </div>
  );
};

const WorldClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white p-12">
      <MainClock />
      <div className="grid grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        {cities.map((city) => {
          // 获取当前 UTC 时间
          const now = new Date();
          const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
          // 用 utcOffset 计算城市时间
          const cityTime = addHours(utcTime, city.utcOffset);
          const hour = parseInt(format(cityTime, 'H'));
          const isDaytime = hour >= 6 && hour < 18;

          return (
            <TimeCard
              key={city.city}
              city={city.city}
              country={city.country}
              time={format(cityTime, 'HH:mm')}
              date={format(cityTime, 'MMM. dd (EEE)')}
              utcOffset={`UTC${city.utcOffset >= 0 ? '+' : ''}${city.utcOffset}`}
              isDaytime={isDaytime}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WorldClock; 