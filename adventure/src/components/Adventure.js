import { adventureService } from '../services/adventureService.js';
import { settingsService } from '../services/settingsService.js';

export default function Adventure() {
  return `
    <div class="adventure-container">
      <div class="adventure-header">
        <h2>冒险模式</h2>
        <div class="adventure-actions">
          <button class="btn btn-secondary" id="adventureSettingsBtn" title="冒险设置">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button class="btn btn-primary" id="startNewBtn">开始新冒险</button>
          <button class="btn btn-secondary" id="clearStoryBtn">清空故事</button>
        </div>
      </div>
      
      <div class="adventure-content">
        <div class="story-container">
          <div class="story-messages" id="storyMessages">
            <div class="story-welcome">
              <div class="welcome-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>欢迎来到冒险世界！</h3>
              <p>点击"开始新冒险"按钮，开启你的奇幻之旅。在这里，你的每个选择都将影响故事的发展方向。</p>
              
              <div class="theme-selection" id="themeSelection" style="display: none;">
                <h4>选择冒险主题：</h4>
                <div class="theme-grid" id="themeGrid">
                  <div class="theme-card" data-theme="奇幻冒险">
                    <div class="theme-icon">🧙‍♂️</div>
                    <div class="theme-name">奇幻冒险</div>
                    <div class="theme-desc">魔法、巨龙、骑士与公主</div>
                  </div>
                  <div class="theme-card" data-theme="科幻探索">
                    <div class="theme-icon">🚀</div>
                    <div class="theme-name">科幻探索</div>
                    <div class="theme-desc">太空、机器人、未来科技</div>
                  </div>
                  <div class="theme-card" data-theme="悬疑推理">
                    <div class="theme-icon">🔍</div>
                    <div class="theme-name">悬疑推理</div>
                    <div class="theme-desc">谜题、线索、真相探索</div>
                  </div>
                  <div class="theme-card" data-theme="古代武侠">
                    <div class="theme-icon">⚔️</div>
                    <div class="theme-name">古代武侠</div>
                    <div class="theme-desc">江湖、武功、侠义精神</div>
                  </div>
                  <div class="theme-card" data-theme="现代都市">
                    <div class="theme-icon">🏙️</div>
                    <div class="theme-name">现代都市</div>
                    <div class="theme-desc">城市、职场、生活故事</div>
                  </div>
                  <div class="theme-card" data-theme="恐怖惊悚">
                    <div class="theme-icon">👻</div>
                    <div class="theme-name">恐怖惊悚</div>
                    <div class="theme-desc">鬼怪、惊悚、生存挑战</div>
                  </div>
                </div>
                
                <div class="story-background-section" id="storyBackgroundSection">
                  <h5>故事背景设定（可选）：</h5>
                  <div class="background-inputs">
                    <div class="background-input-group">
                      <label for="characterName">主角名称：</label>
                      <input type="text" id="characterName" placeholder="如：艾莉娅、杰克等" maxlength="20">
                    </div>
                    <div class="background-input-group">
                      <label for="characterRole">主角身份：</label>
                      <input type="text" id="characterRole" placeholder="如：魔法师、侦探、武士等" maxlength="30">
                    </div>
                    <div class="background-input-group">
                      <label for="worldSetting">世界设定：</label>
                      <textarea id="worldSetting" placeholder="描述故事发生的世界背景，如：一个被魔法笼罩的中世纪王国，科技与魔法并存..." rows="3" maxlength="200"></textarea>
                    </div>
                    <div class="background-input-group">
                      <label for="storyGoal">故事目标：</label>
                      <textarea id="storyGoal" placeholder="描述主角的目标或任务，如：寻找失落的魔法宝石，解开古老的谜题..." rows="3" maxlength="200"></textarea>
                    </div>
                  </div>
                </div>
                
                <div class="theme-actions">
                  <button class="btn btn-secondary" id="customThemeBtn">自定义主题</button>
                  <button class="btn btn-secondary" id="toggleBackgroundBtn">详细背景设定</button>
                  <button class="btn btn-primary" id="confirmThemeBtn" disabled>开始冒险</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="typing-indicator" id="storyTypingIndicator" style="display: none;">
            <div class="story-message ai-story">
              <div class="story-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
                  <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
                  <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
                  <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
                </svg>
              </div>
              <div class="story-content">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="branch-options" id="branchOptions" style="display: none;">
          <h4>选择你的行动：</h4>
          <div class="options-grid" id="optionsGrid"></div>
        </div>
        
        <div class="adventure-input-container">
          <div class="input-wrapper">
            <textarea 
              class="adventure-input" 
              id="adventureInput"
              placeholder="输入你的想法或行动..." 
              rows="1"
            ></textarea>
            <div class="input-actions">
              <button class="action-btn" id="clearInputBtn" title="清空输入">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button class="send-button" id="sendAdventureBtn" title="发送">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 冒险功能脚本
export function initAdventure() {
  const startNewBtn = document.getElementById('startNewBtn');
  const clearStoryBtn = document.getElementById('clearStoryBtn');
  const adventureSettingsBtn = document.getElementById('adventureSettingsBtn');
  const sendAdventureBtn = document.getElementById('sendAdventureBtn');
  const clearInputBtn = document.getElementById('clearInputBtn');
  const adventureInput = document.getElementById('adventureInput');
  const storyMessages = document.getElementById('storyMessages');
  const storyTypingIndicator = document.getElementById('storyTypingIndicator');
  const branchOptions = document.getElementById('branchOptions');
  const optionsGrid = document.getElementById('optionsGrid');
  
  // 主题选择相关元素
  const themeSelection = document.getElementById('themeSelection');
  const themeGrid = document.getElementById('themeGrid');
  const customThemeBtn = document.getElementById('customThemeBtn');
  const confirmThemeBtn = document.getElementById('confirmThemeBtn');
  
  // 故事背景相关元素
  const storyBackgroundSection = document.getElementById('storyBackgroundSection');
  const toggleBackgroundBtn = document.getElementById('toggleBackgroundBtn');
  const characterNameInput = document.getElementById('characterName');
  const characterRoleInput = document.getElementById('characterRole');
  const worldSettingInput = document.getElementById('worldSetting');
  const storyGoalInput = document.getElementById('storyGoal');
  
  let selectedTheme = null;
  let storyBackground = null;
  let backgroundSectionVisible = false;

  // 自动调整输入框高度
  adventureInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // 显示输入状态
  function showTypingIndicator() {
    storyTypingIndicator.style.display = 'block';
    storyMessages.scrollTop = storyMessages.scrollHeight;
  }

  // 隐藏输入状态
  function hideTypingIndicator() {
    storyTypingIndicator.style.display = 'none';
  }

  // 显示主题选择
  function showThemeSelection() {
    themeSelection.style.display = 'block';
    selectedTheme = null;
    storyBackground = null;
    confirmThemeBtn.disabled = true;
    backgroundSectionVisible = false;
    
    // 清除之前的选择
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // 隐藏自定义主题输入框
    const customInput = document.querySelector('.custom-theme-input');
    if (customInput) {
      customInput.classList.remove('show');
    }
    
    // 隐藏背景设定区域
    storyBackgroundSection.classList.remove('show');
    toggleBackgroundBtn.textContent = '详细背景设定';
    
    // 清空背景输入框
    clearBackgroundInputs();
  }

  // 隐藏主题选择
  function hideThemeSelection() {
    themeSelection.style.display = 'none';
  }

  // 选择主题
  function selectTheme(theme) {
    selectedTheme = theme;
    updateConfirmButton();
    
    // 更新UI
    document.querySelectorAll('.theme-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-theme="${theme}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
  }

  // 切换背景设定显示
  function toggleBackgroundSection() {
    backgroundSectionVisible = !backgroundSectionVisible;
    
    if (backgroundSectionVisible) {
      storyBackgroundSection.classList.add('show');
      toggleBackgroundBtn.textContent = '隐藏背景设定';
    } else {
      storyBackgroundSection.classList.remove('show');
      toggleBackgroundBtn.textContent = '详细背景设定';
    }
  }

  // 清空背景输入框
  function clearBackgroundInputs() {
    if (characterNameInput) characterNameInput.value = '';
    if (characterRoleInput) characterRoleInput.value = '';
    if (worldSettingInput) worldSettingInput.value = '';
    if (storyGoalInput) storyGoalInput.value = '';
    
    // 清除字符计数
    document.querySelectorAll('.char-count').forEach(count => {
      count.remove();
    });
  }

  // 收集背景信息
  function collectBackgroundInfo() {
    const background = {};
    
    if (characterNameInput && characterNameInput.value.trim()) {
      background.characterName = characterNameInput.value.trim();
    }
    
    if (characterRoleInput && characterRoleInput.value.trim()) {
      background.characterRole = characterRoleInput.value.trim();
    }
    
    if (worldSettingInput && worldSettingInput.value.trim()) {
      background.worldSetting = worldSettingInput.value.trim();
    }
    
    if (storyGoalInput && storyGoalInput.value.trim()) {
      background.storyGoal = storyGoalInput.value.trim();
    }
    
    // 只有当至少有一个字段有内容时才返回背景对象
    return Object.keys(background).length > 0 ? background : null;
  }

  // 更新确认按钮状态
  function updateConfirmButton() {
    const hasTheme = selectedTheme !== null;
    
    // 背景设定是完全可选的，只要选择了主题就可以开始冒险
    // 如果用户填写了背景信息，会在开始冒险时收集
    const hasBackground = true; // 背景设定是可选的，不需要验证
    
    confirmThemeBtn.disabled = !hasTheme;
  }

  // 添加字符计数功能
  function addCharCount(input, maxLength) {
    const charCount = document.createElement('div');
    charCount.className = 'char-count';
    charCount.textContent = `0/${maxLength}`;
    
    input.parentNode.appendChild(charCount);
    
    function updateCount() {
      const count = input.value.length;
      charCount.textContent = `${count}/${maxLength}`;
      
      // 根据字符数更新样式
      charCount.classList.remove('near-limit', 'at-limit');
      if (count >= maxLength) {
        charCount.classList.add('at-limit');
      } else if (count >= maxLength * 0.8) {
        charCount.classList.add('near-limit');
      }
    }
    
    input.addEventListener('input', updateCount);
    updateCount(); // 初始化计数
  }

  // 显示自定义主题输入
  function showCustomThemeInput() {
    // 移除现有输入框
    const existingInput = document.querySelector('.custom-theme-input');
    if (existingInput) {
      existingInput.remove();
    }
    
    // 创建新的输入框
    const customInput = document.createElement('div');
    customInput.className = 'custom-theme-input show';
    customInput.innerHTML = `
      <input type="text" id="customThemeInput" placeholder="输入自定义主题，如：西部牛仔、海底探险等" maxlength="20">
      <div class="input-actions">
        <button class="btn btn-secondary" id="cancelCustomThemeBtn">取消</button>
        <button class="btn btn-primary" id="confirmCustomThemeBtn">确定</button>
      </div>
    `;
    
    themeSelection.appendChild(customInput);
    
    // 添加事件监听器
    const customThemeInput = document.getElementById('customThemeInput');
    const cancelCustomThemeBtn = document.getElementById('cancelCustomThemeBtn');
    const confirmCustomThemeBtn = document.getElementById('confirmCustomThemeBtn');
    
    customThemeInput.focus();
    
    cancelCustomThemeBtn.addEventListener('click', () => {
      customInput.remove();
    });
    
    confirmCustomThemeBtn.addEventListener('click', () => {
      const customTheme = customThemeInput.value.trim();
      if (customTheme) {
        selectTheme(customTheme);
        customInput.remove();
      }
    });
    
    customThemeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const customTheme = customThemeInput.value.trim();
        if (customTheme) {
          selectTheme(customTheme);
          customInput.remove();
        }
      }
    });
  }

  // 添加故事消息
  function addStoryMessage(story, type = 'ai') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `story-message ${type}-story`;
    
    const time = new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (type === 'user') {
      messageDiv.innerHTML = `
        <div class="story-content">
          <div class="story-text">${story}</div>
          <div class="story-time">${time}</div>
        </div>
        <div class="story-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="story-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
            <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
            <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
            <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
          </svg>
        </div>
        <div class="story-content">
          <div class="story-text">${story.text}</div>
          <div class="story-time">${time}</div>
        </div>
      `;
    }

    storyMessages.appendChild(messageDiv);
    storyMessages.scrollTop = storyMessages.scrollHeight;
  }

  // 显示分支选项
  function showBranchOptions(options) {
    optionsGrid.innerHTML = '';
    
    options.forEach((option, index) => {
      const optionCard = document.createElement('div');
      optionCard.className = 'option-card';
      optionCard.innerHTML = `
        <div class="option-content">
          <span class="option-number">${index + 1}</span>
          <span class="option-text">${option}</span>
        </div>
      `;
      
      optionCard.addEventListener('click', () => selectBranch(index));
      optionsGrid.appendChild(optionCard);
    });
    
    branchOptions.style.display = 'block';
  }

  // 隐藏分支选项
  function hideBranchOptions() {
    branchOptions.style.display = 'none';
  }

  // 选择分支
  async function selectBranch(optionIndex) {
    hideBranchOptions();
    showTypingIndicator();
    let aiDiv = document.createElement('div');
    aiDiv.className = 'story-message ai-story';
    aiDiv.innerHTML = `
      <div class="story-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
          <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
          <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
          <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
        </svg>
      </div>
      <div class="story-content">
        <div class="story-text" id="streamingStoryText"></div>
        <div class="story-time">正在输入...</div>
      </div>
    `;
    storyMessages.appendChild(aiDiv);
    storyMessages.scrollTop = storyMessages.scrollHeight;
    let fullText = '';
    try {
      const story = await adventureService.streamContinueStory(optionIndex, (all, delta) => {
        fullText = all;
        const textDiv = aiDiv.querySelector('.story-text');
        if (textDiv) textDiv.textContent = all;
        storyMessages.scrollTop = storyMessages.scrollHeight;
      });
      hideTypingIndicator();
      // 补充时间
      const timeDiv = aiDiv.querySelector('.story-time');
      if (timeDiv) timeDiv.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      // story对象已自动入库
      if (story.options && story.options.length > 0) {
        showBranchOptions(story.options);
      }
    } catch (error) {
      hideTypingIndicator();
      const textDiv = aiDiv.querySelector('.story-text');
      if (textDiv) textDiv.textContent = '生成故事失败：' + error.message;
      alert('选择分支时出现错误：' + error.message);
    }
  }

  // 开始新冒险
  async function startNewAdventure() {
    // 显示主题选择
    showThemeSelection();
    // 自动选择默认冒险主题
    const adventureSettings = settingsService.getAdventureSettings();
    if (adventureSettings.defaultTheme) {
      // 查找并高亮对应主题卡片
      const themeCards = document.querySelectorAll('.theme-card');
      let found = false;
      themeCards.forEach(card => {
        if (card.dataset.theme === adventureSettings.defaultTheme) {
          card.classList.add('selected');
          selectedTheme = adventureSettings.defaultTheme;
          found = true;
        } else {
          card.classList.remove('selected');
        }
      });
      // 激活确认按钮
      if (found) {
        confirmThemeBtn.disabled = false;
      }
    }
  }

  // 确认主题并开始冒险
  async function confirmThemeAndStart() {
    if (!selectedTheme) return;
    storyBackground = collectBackgroundInfo();
    hideThemeSelection();
    storyMessages.innerHTML = '';
    hideBranchOptions();
    showTypingIndicator();
    let aiDiv = document.createElement('div');
    aiDiv.className = 'story-message ai-story';
    aiDiv.innerHTML = `
      <div class="story-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
          <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
          <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
          <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
        </svg>
      </div>
      <div class="story-content">
        <div class="story-text" id="streamingStoryText"></div>
        <div class="story-time">正在输入...</div>
      </div>
    `;
    storyMessages.appendChild(aiDiv);
    storyMessages.scrollTop = storyMessages.scrollHeight;
    let fullText = '';
    try {
      const story = await adventureService.streamStartNewAdventure(selectedTheme, storyBackground, (all, delta) => {
        fullText = all;
        const textDiv = aiDiv.querySelector('.story-text');
        if (textDiv) textDiv.textContent = all;
        storyMessages.scrollTop = storyMessages.scrollHeight;
      });
      hideTypingIndicator();
      const timeDiv = aiDiv.querySelector('.story-time');
      if (timeDiv) timeDiv.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      if (story.options && story.options.length > 0) {
        showBranchOptions(story.options);
      }
      updateActionButtons();
    } catch (error) {
      hideTypingIndicator();
      const textDiv = aiDiv.querySelector('.story-text');
      if (textDiv) textDiv.textContent = '生成故事失败：' + error.message;
      alert('开始冒险时出现错误：' + error.message);
    }
  }

  // 发送自定义消息
  async function sendCustomMessage() {
    const message = adventureInput.value.trim();
    if (!message) return;
    addStoryMessage(message, 'user');
    adventureInput.value = '';
    adventureInput.style.height = 'auto';
    hideBranchOptions();
    showTypingIndicator();
    let aiDiv = document.createElement('div');
    aiDiv.className = 'story-message ai-story';
    aiDiv.innerHTML = `
      <div class="story-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
          <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
          <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
          <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
        </svg>
      </div>
      <div class="story-content">
        <div class="story-text" id="streamingStoryText"></div>
        <div class="story-time">正在输入...</div>
      </div>
    `;
    storyMessages.appendChild(aiDiv);
    storyMessages.scrollTop = storyMessages.scrollHeight;
    let fullText = '';
    try {
      const story = await adventureService.streamSendCustomMessage(message, (all, delta) => {
        fullText = all;
        const textDiv = aiDiv.querySelector('.story-text');
        if (textDiv) textDiv.textContent = all;
        storyMessages.scrollTop = storyMessages.scrollHeight;
      });
      hideTypingIndicator();
      const timeDiv = aiDiv.querySelector('.story-time');
      if (timeDiv) timeDiv.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      if (story.options && story.options.length > 0) {
        showBranchOptions(story.options);
      }
    } catch (error) {
      hideTypingIndicator();
      const textDiv = aiDiv.querySelector('.story-text');
      if (textDiv) textDiv.textContent = '生成故事失败：' + error.message;
      alert('发送消息时出现错误：' + error.message);
    }
  }

  // 清空故事
  function clearStory() {
    if (confirm('确定要清空所有故事记录吗？')) {
      adventureService.clearStoryHistory();
      // 只刷新冒险页面内容，不刷新整个页面
      const contentArea = document.querySelector('.content');
      if (contentArea) {
        contentArea.innerHTML = Adventure();
        setTimeout(() => {
          initAdventure();
        }, 0);
      }
    }
  }

  // 清空输入
  function clearInput() {
    adventureInput.value = '';
    adventureInput.style.height = 'auto';
  }

  // 打开冒险设置
  function openAdventureSettings() {
    // 切换到设置页面并滚动到冒险设置部分
    const settingsNavItem = document.querySelector('.nav-item[data-page="设置"]');
    if (settingsNavItem) {
      settingsNavItem.click();
      
      // 延迟滚动到冒险设置部分
      setTimeout(() => {
        const adventureSection = document.querySelector('.settings-section h2');
        if (adventureSection && adventureSection.textContent.includes('冒险模式设置')) {
          adventureSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  // 初始化主题选择事件
  function initThemeSelection() {
    // 主题卡片点击事件
    document.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const theme = card.dataset.theme;
        selectTheme(theme);
      });
    });
    
    // 自定义主题按钮
    const customThemeBtn = document.getElementById('customThemeBtn');
    if (customThemeBtn) {
      customThemeBtn.addEventListener('click', showCustomThemeInput);
    }
    
    // 背景设定切换按钮
    const toggleBackgroundBtn = document.getElementById('toggleBackgroundBtn');
    if (toggleBackgroundBtn) {
      toggleBackgroundBtn.addEventListener('click', toggleBackgroundSection);
    }
    
    // 确认主题按钮
    const confirmThemeBtn = document.getElementById('confirmThemeBtn');
    if (confirmThemeBtn) {
      confirmThemeBtn.addEventListener('click', confirmThemeAndStart);
    }
    
    // 为背景输入框添加字符计数
    if (characterNameInput) {
      addCharCount(characterNameInput, 20);
    }
    if (characterRoleInput) {
      addCharCount(characterRoleInput, 30);
    }
    if (worldSettingInput) {
      addCharCount(worldSettingInput, 200);
    }
    if (storyGoalInput) {
      addCharCount(storyGoalInput, 200);
    }
  }

  // 自动读取历史冒险记录并渲染
  function renderHistory() {
    const history = adventureService.getStoryHistory();
    if (history && history.length > 0) {
      storyMessages.innerHTML = '';
      history.forEach(story => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'story-message ai-story';
        aiDiv.innerHTML = `
          <div class="story-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
              <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
              <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
              <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
            </svg>
          </div>
          <div class="story-content">
            <div class="story-text">${story.text}</div>
            <div class="story-time">${story.timestamp ? new Date(story.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
          </div>
        `;
        storyMessages.appendChild(aiDiv);
      });
      storyMessages.scrollTop = storyMessages.scrollHeight;
    }
    updateActionButtons();
  }

  // 按照冒险历史控制按钮显示
  function updateActionButtons() {
    const history = adventureService.getStoryHistory();
    if (history && history.length > 0) {
      clearStoryBtn.style.display = '';
      startNewBtn.style.display = 'none';
    } else {
      clearStoryBtn.style.display = 'none';
      startNewBtn.style.display = '';
    }
    // 设置按钮始终显示（保险起见）
    adventureSettingsBtn.style.display = '';
  }

  // 初始化时渲染历史
  renderHistory();

  // 事件监听器
  startNewBtn.addEventListener('click', startNewAdventure);
  clearStoryBtn.addEventListener('click', clearStory);
  adventureSettingsBtn.addEventListener('click', openAdventureSettings);
  sendAdventureBtn.addEventListener('click', sendCustomMessage);
  clearInputBtn.addEventListener('click', clearInput);
  
  adventureInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCustomMessage();
    }
  });
  
  // 初始化主题选择
  initThemeSelection();
}