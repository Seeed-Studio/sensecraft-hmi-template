'use client';
import React, { useEffect, useState } from 'react';

// GitHub 组织名
const ORG_NAME = 'Seeed-Studio';
const CACHE_KEY = 'github_org_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// 获取组织基本信息
async function fetchOrgInfo() {
  const res = await fetch(`https://api.github.com/orgs/${ORG_NAME}`, {
    headers: { 'User-Agent': BROWSER_UA },
  });
  if (!res.ok) throw new Error('无法获取组织信息');
  return res.json();
}

// 获取组织项目数（需特殊 header）
async function fetchOrgProjects() {
  const res = await fetch(`https://api.github.com/orgs/${ORG_NAME}/projects`, {
    headers: { 'Accept': 'application/vnd.github.inertia-preview+json' },
  });
  if (!res.ok) return 0; // 项目功能可能未启用
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

// 获取公开成员数
async function fetchOrgMembers() {
  const res = await fetch(`https://api.github.com/orgs/${ORG_NAME}/public_members`, {
    headers: { 'User-Agent': BROWSER_UA },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

// 获取所有仓库的 star 总数（分页处理）
async function fetchOrgStars() {
  let page = 1;
  let totalStars = 0;
  let hasMore = true;
  while (hasMore) {
    const res = await fetch(`https://api.github.com/orgs/${ORG_NAME}/repos?per_page=100&page=${page}`, {
      headers: { 'User-Agent': BROWSER_UA },
    });
    if (!res.ok) break;
    const repos = await res.json();
    if (Array.isArray(repos) && repos.length > 0) {
      totalStars += repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      hasMore = repos.length === 100;
      page++;
    } else {
      hasMore = false;
    }
  }
  return totalStars;
}

export default function GithubOrgPage() {
  const [org, setOrg] = useState<any>(null);
  const [projects, setProjects] = useState<number>(0);
  const [members, setMembers] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 读取缓存
  const loadCache = () => {
    if (typeof window === 'undefined') return null;
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    try {
      const { data, timestamp } = JSON.parse(cache);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    } catch {}
    return null;
  };

  // 写入缓存
  const saveCache = (data: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  };

  // 获取所有数据，带缓存
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    // 先查缓存
    const cache = loadCache();
    if (cache) {
      setOrg(cache.org);
      setProjects(cache.projects);
      setMembers(cache.members);
      setStars(cache.stars);
      setLoading(false);
      return;
    }
    // 无缓存或过期，拉取数据
    try {
      const [orgInfo, projectCount, memberCount, starCount] = await Promise.all([
        fetchOrgInfo(),
        fetchOrgProjects(),
        fetchOrgMembers(),
        fetchOrgStars(),
      ]);
      setOrg(orgInfo);
      setProjects(projectCount);
      setMembers(memberCount);
      setStars(starCount);
      saveCache({ org: orgInfo, projects: projectCount, members: memberCount, stars: starCount });
    } catch (e: any) {
      setError(e.message || '加载失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // 每10分钟自动刷新
    const timer = setInterval(fetchAll, CACHE_DURATION);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white text-black">加载中...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-white text-red-600">{error}</div>;
  }
  if (!org) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8" style={{width:800, height:480, margin:'0 auto'}}>
      {/* 组织头像和名称 */}
      <div className="flex items-center mb-6">
        <img src={org.avatar_url} alt="avatar" className="w-24 h-24 rounded-full border-4 border-black mr-6" />
        <div>
          <div className="text-3xl font-bold mb-1">{org.name || org.login}</div>
          <a href={org.blog || org.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-base font-bold">{org.blog || org.html_url}</a>
        </div>
      </div>
      {/* 简介 */}
      {org.description && <div className="mb-6 text-lg text-gray-800 text-center max-w-xl">{org.description}</div>}
      {/* 统计数据 */}
      <div className="grid grid-cols-2 gap-8 text-center mb-6">
        <div>
          <div className="text-2xl font-bold">{stars}</div>
          <div className="text-base font-bold">Total Stars</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{org.followers}</div>
          <div className="text-base font-bold">Followers</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{org.public_repos}</div>
          <div className="text-base font-bold">Repositories</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{members}</div>
          <div className="text-base font-bold">Public Members</div>
        </div>
      </div>
      {/* 更新时间 */}
      <div className="text-xs text-gray-400 mt-4 font-bold">Data auto-refreshes every 10 minutes</div>
    </div>
  );
} 