const { invoke } = window.__TAURI__.core;

import Home from './components/Home.js';
import Chat, { initChat } from './components/Chat.js';
import Adventure, { initAdventure } from './components/Adventure.js';
import Settings, { initSettings } from './components/Settings.js';

window.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentArea = document.querySelector('.content');
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.toggle-btn');
  
  // 侧边栏折叠功能
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // 页面内容
  const pages = {
    '首页': Home(),
    '聊天': Chat(),
    '冒险': Adventure(),
    '设置': Settings()
  };

  // 初始化显示首页
  contentArea.innerHTML = pages['首页'];

  // 首页卡片点击跳转（事件委托）
  function setupHomeCardEvents() {
    const homeFeatures = document.querySelector('.home-features');
    if (homeFeatures) {
      homeFeatures.addEventListener('click', function(e) {
        const card = e.target.closest('.feature-card');
        if (card && card.dataset.page) {
          const nav = document.querySelector(`.nav-item[data-title='${card.dataset.page}']`);
          if (nav) nav.click();
        }
      });
    }
  }
  setupHomeCardEvents();

  // 为每个导航项添加点击事件
  navItems.forEach(item => {
    // 为每个导航项添加data-page属性
    const span = item.querySelector('span');
    if (span) {
      item.dataset.page = span.textContent;
    }
    
    item.addEventListener('click', () => {
      // 移除所有active类
      navItems.forEach(navItem => navItem.classList.remove('active'));
      // 为当前点击项添加active类
      item.classList.add('active');
      // 更新内容区域
      contentArea.innerHTML = pages[item.dataset.page];
      
      // 根据页面类型初始化相应功能
      setTimeout(() => {
        if (item.dataset.page === '聊天') {
          initChat();
        } else if (item.dataset.page === '冒险') {
          initAdventure();
        } else if (item.dataset.page === '设置') {
          initSettings();
        }
      }, 100);

      // 切换到首页时重新绑定卡片事件
      if (item.dataset.page === '首页') {
        setupHomeCardEvents();
      }
    });
  });
});
