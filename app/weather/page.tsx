import React from 'react';

// 假数据，和图片内容一致
const weatherData = {
  city: 'New York, New York',
  date: 'Sunday, July 24',
  temperature: 94,
  feelsLike: 98,
  advisory: 'Heat Advisory',
  airQualityAlert: 'Air Quality Alert',
  sunrise: '5:45am',
  sunset: '8:19pm',
  wind: '18mph',
  humidity: 43,
  pressure: '29.91in',
  visibility: '> 6mi',
  uvIndex: 0,
  airQualityIndex: 80,
  indoorTemp: 71,
  indoorHumidity: 44,
  forecast: [
    { day: 'Sun', high: 95, low: 80, icon: '🌧️' },
    { day: 'Mon', high: 91, low: 75, icon: '🌧️' },
    { day: 'Tue', high: 87, low: 72, icon: '⛅' },
    { day: 'Wed', high: 85, low: 73, icon: '⛅' },
    { day: 'Thu', high: 91, low: 76, icon: '🌧️' },
  ],
  tempChart: [94, 90, 85, 82, 81, 80, 80, 82, 85, 90, 95, 91],
  rainChart: [0, 0, 20, 0, 0, 0, 10, 20, 40, 60, 100, 20],
};

// 折线图组件（SVG实现，黑白风格，简单易懂）
function LineChart({ temps, rains }: { temps: number[]; rains: number[] }) {
  const width = 400;
  const height = 120;
  const tempMin = 75, tempMax = 100;
  const rainMax = 100;
  const tempPoints = temps.map((t, i) => [
    (i / (temps.length - 1)) * width,
    height - ((t - tempMin) / (tempMax - tempMin)) * height,
  ]);
  const rainBars = rains.map((r, i) => ({
    x: (i / (rains.length - 1)) * width,
    y: height - (r / rainMax) * height,
    h: (r / rainMax) * height,
  }));
  const tempPath = tempPoints.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  return (
    <svg width={width} height={height} style={{ background: '#fff', border: '1px solid #111' }}>
      {rainBars.map((bar, i) => (
        <rect key={i} x={bar.x - 6} y={bar.y} width={12} height={bar.h} fill="#ccc" opacity={0.5} />
      ))}
      <path d={tempPath} stroke="#111" strokeWidth={2} fill="none" />
    </svg>
  );
}

export default function WeatherPage() {
  return (
    <div className="font-sans bg-white p-6 max-w-3xl mx-auto border-2 border-black rounded-xl text-black">
      {/* 标题和警告 */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-black">{weatherData.city}</div>
        <div className="text-lg text-black">{weatherData.date}</div>
        <div className="mt-2 text-base text-black">
          <span role="img" aria-label="thermometer">🌡️</span> {weatherData.advisory} &nbsp;
          <span role="img" aria-label="air quality">💨</span> {weatherData.airQualityAlert}
        </div>
      </div>
      {/* 当前温度 */}
      <div className="mb-6">
        <div className="text-6xl font-bold leading-none text-black">{weatherData.temperature}°F</div>
        <div className="text-xl text-black">Feels Like {weatherData.feelsLike}°</div>
      </div>
      {/* 主要数据 */}
      <div className="mb-6 flex flex-wrap gap-6">
        <div>
          <div className="text-black text-sm">Sunrise</div>
          <div className="font-bold text-lg text-black">{weatherData.sunrise}</div>
        </div>
        <div>
          <div className="text-black text-sm">Sunset</div>
          <div className="font-bold text-lg text-black">{weatherData.sunset}</div>
        </div>
        <div>
          <div className="text-black text-sm">Wind</div>
          <div className="font-bold text-lg text-black">{weatherData.wind}</div>
        </div>
        <div>
          <div className="text-black text-sm">Humidity</div>
          <div className="font-bold text-lg text-black">{weatherData.humidity}%</div>
        </div>
        <div>
          <div className="text-black text-sm">Pressure</div>
          <div className="font-bold text-lg text-black">{weatherData.pressure}</div>
        </div>
        <div>
          <div className="text-black text-sm">Visibility</div>
          <div className="font-bold text-lg text-black">{weatherData.visibility}</div>
        </div>
        <div>
          <div className="text-black text-sm">UV Index</div>
          <div className="font-bold text-lg text-black">{weatherData.uvIndex} Low</div>
        </div>
        <div>
          <div className="text-black text-sm">Air Quality Index</div>
          <div className="font-bold text-lg text-black">{weatherData.airQualityIndex} Moderate</div>
        </div>
        <div>
          <div className="text-black text-sm">Indoor Temp</div>
          <div className="font-bold text-lg text-black">{weatherData.indoorTemp}°</div>
        </div>
        <div>
          <div className="text-black text-sm">Indoor Humidity</div>
          <div className="font-bold text-lg text-black">{weatherData.indoorHumidity}%</div>
        </div>
      </div>
      {/* 未来天气预报 */}
      <div className="mb-6">
        <div className="text-lg font-bold mb-2 text-black">Forecast</div>
        <div className="flex gap-6">
          {weatherData.forecast.map((f, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl text-black">{f.icon}</div>
              <div className="text-black">{f.day}</div>
              <div className="text-sm text-black">{f.high}°|{f.low}°</div>
            </div>
          ))}
        </div>
      </div>
      {/* 折线图 */}
      <div className="mb-6">
        <LineChart temps={weatherData.tempChart} rains={weatherData.rainChart} />
        <div className="text-xs text-black mt-1">温度（黑线）和降水概率（灰色柱状）</div>
      </div>
      {/* 设备信息（可选） */}
      <div className="text-xs text-black mt-4">
        <span role="img" aria-label="wifi">📶</span> Excellent (-39dBm) &nbsp; <span role="img" aria-label="battery">🔋</span> 73%
      </div>
    </div>
  );
} 