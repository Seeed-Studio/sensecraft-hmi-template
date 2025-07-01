'use client';

import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Time Clock',
      description: '实时数字时钟显示，简约设计',
      path: '/time-clock',
      icon: '🕐'
    },
    {
      title: 'World Clock',
      description: '世界时钟显示，支持多个时区',
      path: '/world-clock',
      icon: '🌍'
    },
    {
      title: 'GitHub Org',
      description: 'Seeed-Studio GitHub 组织数据统计',
      path: '/github-org',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8" style={{width:800, height:480, margin:'0 auto'}}>
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">SenseCraft HMI Template</h1>
        <p className="text-lg text-gray-600">选择你需要的功能</p>
      </div>

      {/* 功能分类 */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-2xl">
        {features.map((feature) => (
          <Link 
            key={feature.path} 
            href={feature.path}
            className="flex items-center p-6 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="text-3xl mr-4">{feature.icon}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
            <div className="text-2xl text-gray-400">→</div>
          </Link>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="text-xs text-gray-400 mt-8 text-center">
        专为 800x480 分辨率优化的深黑色主题设计
      </div>
    </div>
  );
} 