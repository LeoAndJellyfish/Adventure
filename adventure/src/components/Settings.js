import { aiService } from '../services/aiService.js';
import { settingsService } from '../services/settingsService.js';
import { adventureService } from '../services/adventureService.js';

export default function Settings() {
  const aiSettings = settingsService.getAISettings();
  const chatSettings = settingsService.getChatSettings();
  const adventureSettings = settingsService.getAdventureSettings();
  
  return `
    <div class="settings-container">
      <div class="settings-content">
        <h1>设置</h1>
        
        <div class="settings-form">
          <div class="settings-section">
            <h2>AI 服务配置</h2>
            
            <div class="form-group">
              <label for="provider">AI 服务提供商</label>
              <select id="provider" class="form-control">
                <option value="openai" ${aiSettings.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
                <option value="anthropic" ${aiSettings.provider === 'anthropic' ? 'selected' : ''}>Anthropic (Claude)</option>
                <option value="ollama" ${aiSettings.provider === 'ollama' ? 'selected' : ''}>Ollama (本地)</option>
                <option value="custom" ${aiSettings.provider === 'custom' ? 'selected' : ''}>自定义 API</option>
              </select>
            </div>

            <div class="form-group" id="apiKeyGroup" style="${aiSettings.provider === 'ollama' ? 'display: none;' : ''}">
              <label for="apiKey">API 密钥</label>
              <input type="password" id="apiKey" class="form-control" value="${aiSettings.apiKey || ''}" placeholder="请输入您的 API 密钥">
              <small class="form-text">您的 API 密钥将安全地存储在本地，不会发送到其他服务器。</small>
            </div>

            <div class="form-group">
              <label for="baseUrl">API 基础 URL</label>
              <input type="url" id="baseUrl" class="form-control" value="${aiSettings.baseUrl || ''}" placeholder="https://api.openai.com/v1">
              <small class="form-text">Ollama 默认: http://localhost:11434</small>
            </div>

            <div class="form-group">
              <label for="model">模型名称</label>
              <input type="text" id="model" class="form-control" value="${aiSettings.customModelName || aiSettings.model || ''}" placeholder="输入模型名称，如：gpt-4、claude-3-sonnet等">
              <small class="form-text">输入您要使用的AI模型名称。</small>
            </div>

            <div class="form-group">
              <label for="maxTokens">最大 Token 数</label>
              <input type="number" id="maxTokens" class="form-control" value="${aiSettings.maxTokens || 1000}" min="1" max="4000">
              <small class="form-text">控制 AI 回复的最大长度。</small>
            </div>

            <div class="form-group">
              <label for="temperature">温度 (创造性)</label>
              <input type="range" id="temperature" class="form-control" value="${aiSettings.temperature || 0.7}" min="0" max="2" step="0.1">
              <div class="range-labels">
                <span>保守 (0)</span>
                <span>平衡 (${aiSettings.temperature || 0.7})</span>
                <span>创造性 (2)</span>
              </div>
              <small class="form-text">控制 AI 回复的创造性程度。</small>
            </div>

            <div class="form-group">
              <label for="customPrompt">系统提示词</label>
              <textarea id="customPrompt" class="form-control" rows="4" placeholder="定义 AI 服务的行为和风格...">${aiSettings.customPrompt || ''}</textarea>
              <small class="form-text">设置 AI 服务的行为和风格。</small>
            </div>

            <div class="form-actions">
              <button id="testConnection" class="btn btn-secondary">测试连接</button>
              <button id="saveAISettings" class="btn btn-primary">保存AI服务设置</button>
            </div>
          </div>

          <div class="settings-section">
            <h2>冒险模式设置</h2>
            
            <div class="form-group">
              <label for="adventureTheme">默认冒险主题</label>
              <input type="text" id="adventureTheme" class="form-control" value="${adventureSettings.defaultTheme || '奇幻冒险'}" placeholder="如：奇幻冒险、科幻探索、悬疑推理等">
              <small class="form-text">设置冒险故事的默认主题类型。</small>
            </div>

            <div class="form-group">
              <label for="maxOptions">最大选项数量</label>
              <input type="number" id="maxOptions" class="form-control" value="${adventureSettings.maxOptions || 4}" min="2" max="6">
              <small class="form-text">每个故事节点最多提供的分支选项数量。</small>
            </div>

            <div class="form-group">
              <label for="optionMaxLength">选项最大长度</label>
              <input type="number" id="optionMaxLength" class="form-control" value="${adventureSettings.optionMaxLength || 15}" min="5" max="30">
              <small class="form-text">每个分支选项的最大字符数。</small>
            </div>

            <div class="form-group">
              <label for="startPrompt">开始冒险提示词</label>
              <textarea id="startPrompt" class="form-control" rows="6" placeholder="设置开始新冒险时的AI提示词...">${adventureSettings.startPrompt || ''}</textarea>
              <small class="form-text">使用 {theme} 作为主题占位符。控制AI如何开始新的冒险故事。</small>
            </div>

            <div class="form-group">
              <label for="continuePrompt">继续故事提示词</label>
              <textarea id="continuePrompt" class="form-control" rows="6" placeholder="设置选择分支后继续故事的AI提示词...">${adventureSettings.continuePrompt || ''}</textarea>
              <small class="form-text">使用 {choice} 作为玩家选择的占位符。控制AI如何基于玩家选择继续故事。</small>
            </div>

            <div class="form-group">
              <label for="customMessagePrompt">自定义消息提示词</label>
              <textarea id="customMessagePrompt" class="form-control" rows="6" placeholder="设置玩家输入自定义消息时的AI提示词...">${adventureSettings.customMessagePrompt || ''}</textarea>
              <small class="form-text">使用 {message} 作为玩家消息的占位符。控制AI如何回应玩家的自定义输入。</small>
            </div>

            <div class="form-group">
              <label for="adventureUseStream">使用流式传输</label>
              <input type="checkbox" id="adventureUseStream" class="form-checkbox" ${adventureSettings.adventureUseStream ? 'checked' : ''}>
              <small class="form-text">开启后，冒险故事将逐步显示。</small>
            </div>

            <div class="form-actions">
              <button id="resetAdventurePrompts" class="btn btn-secondary">重置为默认</button>
              <button id="saveAdventureSettings" class="btn btn-primary">保存冒险设置</button>
            </div>
          </div>

          <div class="settings-section">
            <h2>聊天设置</h2>
            
            <div class="form-group">
              <label for="useStream">使用流式传输</label>
              <input type="checkbox" id="useStream" class="form-checkbox" ${chatSettings.useStream ? 'checked' : ''}>
              <small class="form-text">开启后，AI回复将逐步显示（仅作用于聊天模式）。</small>
            </div>

            <div class="form-group">
              <label for="historyLimit">历史记录限制</label>
              <input type="number" id="historyLimit" class="form-control" value="${chatSettings.historyLimit || 100}" min="10" max="1000">
              <small class="form-text">保存的对话消息数量限制。</small>
            </div>

            <div class="form-actions">
              <button id="saveChatSettings" class="btn btn-primary">保存聊天设置</button>
            </div>
          </div>

          <div class="settings-section">
            <h2>数据管理</h2>
            
            <div class="form-actions">
              <button id="exportSettings" class="btn btn-secondary">导出设置</button>
              <button id="importSettings" class="btn btn-secondary">导入设置</button>
              <button id="clearHistory" class="btn btn-danger">清空所有数据</button>
            </div>
          </div>
        </div>

        <div id="testResult" class="test-result" style="display: none;"></div>
      </div>
    </div>
  `;
}

// 设置页面功能
export function initSettings() {
  const providerSelect = document.getElementById('provider');
  const apiKeyInput = document.getElementById('apiKey');
  const baseUrlInput = document.getElementById('baseUrl');
  const modelInput = document.getElementById('model');
  const maxTokensInput = document.getElementById('maxTokens');
  const temperatureInput = document.getElementById('temperature');
  const customPromptInput = document.getElementById('customPrompt');
  const historyLimitInput = document.getElementById('historyLimit');
  const useStreamInput = document.getElementById('useStream');
  
  // 冒险模式设置元素
  const adventureThemeInput = document.getElementById('adventureTheme');
  const maxOptionsInput = document.getElementById('maxOptions');
  const optionMaxLengthInput = document.getElementById('optionMaxLength');
  const startPromptInput = document.getElementById('startPrompt');
  const continuePromptInput = document.getElementById('continuePrompt');
  const customMessagePromptInput = document.getElementById('customMessagePrompt');
  const resetAdventurePromptsBtn = document.getElementById('resetAdventurePrompts');
  const saveAdventureSettingsBtn = document.getElementById('saveAdventureSettings');
  const adventureUseStreamInput = document.getElementById('adventureUseStream');
  
  const testConnectionBtn = document.getElementById('testConnection');
  const saveAISettingsBtn = document.getElementById('saveAISettings');
  const exportSettingsBtn = document.getElementById('exportSettings');
  const importSettingsBtn = document.getElementById('importSettings');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const testResultDiv = document.getElementById('testResult');
  const saveChatSettingsBtn = document.getElementById('saveChatSettings');

  // 更新模型选项
  async function updateModels() {
    const provider = providerSelect.value;
    
    // 只有在用户主动改变提供商时才更新基础URL
    // 初始化时不更新，保持已保存的设置
    if (providerSelect.dataset.initialized !== 'true') {
      // 更新基础URL
      switch (provider) {
        case 'openai':
          baseUrlInput.value = 'https://api.openai.com/v1';
          break;
        case 'anthropic':
          baseUrlInput.value = 'https://api.anthropic.com/v1';
          break;
        case 'ollama':
          baseUrlInput.value = 'http://localhost:11434';
          break;
        case 'custom':
          // 对于自定义提供商，保持当前值或设为空
          if (!baseUrlInput.value) {
            baseUrlInput.value = '';
          }
          break;
      }
    }

    // 显示/隐藏API密钥输入框
    const apiKeyGroup = document.getElementById('apiKeyGroup');
    if (provider === 'ollama') {
      apiKeyGroup.style.display = 'none';
    } else {
      apiKeyGroup.style.display = 'block';
    }
  }

  // 保存AI服务设置
  function saveAISettings() {
    const aiSettings = {
      provider: providerSelect.value,
      apiKey: apiKeyInput.value,
      baseUrl: baseUrlInput.value,
      model: modelInput.value,
      customModelName: modelInput.value,
      maxTokens: parseInt(maxTokensInput.value),
      temperature: parseFloat(temperatureInput.value),
      customPrompt: customPromptInput.value
    };
    aiService.saveSettings(aiSettings);
    showMessage('AI服务设置已保存', 'success');
  }

  // 保存聊天设置
  function saveChatSettings() {
    const chatSettings = {
      historyLimit: parseInt(historyLimitInput.value),
      useStream: useStreamInput.checked
    };
    settingsService.saveChatSettings(chatSettings);
    showMessage('聊天设置已保存', 'success');
  }

  // 保存冒险设置
  function saveAdventureSettings() {
    const adventureSettings = {
      defaultTheme: adventureThemeInput.value,
      maxOptions: parseInt(maxOptionsInput.value),
      optionMaxLength: parseInt(optionMaxLengthInput.value),
      startPrompt: startPromptInput.value,
      continuePrompt: continuePromptInput.value,
      customMessagePrompt: customMessagePromptInput.value,
      adventureUseStream: adventureUseStreamInput.checked
    };
    adventureService.saveSettings(adventureSettings);
    showMessage('冒险设置已保存', 'success');
  }

  // 重置冒险提示词为默认值
  function resetAdventurePrompts() {
    const defaultSettings = settingsService.getDefaultAdventureSettings();
    
    startPromptInput.value = defaultSettings.startPrompt;
    continuePromptInput.value = defaultSettings.continuePrompt;
    customMessagePromptInput.value = defaultSettings.customMessagePrompt;
    
    showMessage('冒险提示词已重置为默认值', 'info');
  }

  // 测试连接
  async function testConnection() {
    testConnectionBtn.disabled = true;
    testConnectionBtn.textContent = '测试中...';
    
    try {
      const result = await aiService.testConnection();
      
      if (result.success) {
        showTestResult('连接测试成功！', 'success', result.response);
      } else {
        showTestResult('连接测试失败', 'error', result.error);
      }
    } catch (error) {
      showTestResult('测试过程中发生错误', 'error', error.message);
    } finally {
      testConnectionBtn.disabled = false;
      testConnectionBtn.textContent = '测试连接';
    }
  }

  // 显示测试结果
  function showTestResult(title, type, content) {
    testResultDiv.innerHTML = `
      <div class="alert alert-${type}">
        <h4>${title}</h4>
        <pre>${content}</pre>
      </div>
    `;
    testResultDiv.style.display = 'block';
    
    // 滚动到测试结果
    testResultDiv.scrollIntoView({ behavior: 'smooth' });
  }

  // 显示消息
  function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const settingsContent = document.querySelector('.settings-content');
    settingsContent.insertBefore(alertDiv, document.querySelector('.settings-form'));
    
    // 滚动到消息
    alertDiv.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  // 导出设置
  function exportSettings() {
    const settings = settingsService.exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showMessage('设置已导出', 'success');
  }

  // 导入设置
  function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const success = settingsService.importSettings(e.target.result);
            if (success) {
              showMessage('设置导入成功，请刷新页面', 'success');
              // 重新加载页面以应用新设置
              setTimeout(() => {
                location.reload();
              }, 1500);
            } else {
              showMessage('设置导入失败', 'error');
            }
          } catch (error) {
            showMessage('文件格式错误', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }

  // 清空所有数据
  function clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      aiService.clearHistory();
      settingsService.resetAllSettings();
      showMessage('所有数据已清空', 'success');
      
      // 重新加载页面
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }

  // 事件监听器
  providerSelect.addEventListener('change', function() {
    // 用户主动切换提供商时，清除初始化标记以允许更新基础URL
    this.dataset.initialized = 'false';
    updateModels();
    // 重新标记为已初始化
    this.dataset.initialized = 'true';
  });
  saveAISettingsBtn.addEventListener('click', saveAISettings);
  testConnectionBtn.addEventListener('click', testConnection);
  exportSettingsBtn.addEventListener('click', exportSettings);
  importSettingsBtn.addEventListener('click', importSettings);
  clearHistoryBtn.addEventListener('click', clearAllData);
  saveAdventureSettingsBtn.addEventListener('click', saveAdventureSettings);
  resetAdventurePromptsBtn.addEventListener('click', resetAdventurePrompts);
  saveChatSettingsBtn.addEventListener('click', saveChatSettings);

  // 温度滑块实时显示
  temperatureInput.addEventListener('input', function() {
    const value = this.value;
    const labels = this.parentElement.querySelector('.range-labels');
    labels.querySelector('span:nth-child(2)').textContent = `平衡 (${value})`;
  });

  // 初始化
  updateModels();
  
  // 标记已初始化，防止后续的提供商切换覆盖已保存的设置
  providerSelect.dataset.initialized = 'true';
  
  // ===================== 初始化设置项 =====================
  // 1. AI服务配置
  const aiSettings = settingsService.getAISettings();
  if (aiSettings.provider !== undefined) {
    providerSelect.value = aiSettings.provider;
  }
  if (aiSettings.apiKey !== undefined) {
    apiKeyInput.value = aiSettings.apiKey;
  }
  if (aiSettings.baseUrl !== undefined) {
    baseUrlInput.value = aiSettings.baseUrl;
  }
  if (aiSettings.model !== undefined || aiSettings.customModelName !== undefined) {
    modelInput.value = aiSettings.customModelName || aiSettings.model;
  }
  if (aiSettings.maxTokens !== undefined) {
    maxTokensInput.value = aiSettings.maxTokens;
  }
  if (aiSettings.temperature !== undefined) {
    temperatureInput.value = aiSettings.temperature;
    // 更新温度显示标签
    const labels = temperatureInput.parentElement.querySelector('.range-labels');
    if (labels) {
      labels.querySelector('span:nth-child(2)').textContent = `平衡 (${aiSettings.temperature})`;
    }
  }
  if (aiSettings.customPrompt !== undefined) {
    customPromptInput.value = aiSettings.customPrompt;
  }

  // 2. 聊天设置
  const chatSettings = settingsService.getChatSettings();
  if (chatSettings.historyLimit !== undefined) {
    historyLimitInput.value = chatSettings.historyLimit;
  }
  if (chatSettings.useStream !== undefined) {
    useStreamInput.checked = chatSettings.useStream;
  }

  // 3. 冒险设置
  const adventureSettings = settingsService.getAdventureSettings();
  if (adventureSettings.defaultTheme !== undefined) {
    adventureThemeInput.value = adventureSettings.defaultTheme;
  }
  if (adventureSettings.maxOptions !== undefined) {
    maxOptionsInput.value = adventureSettings.maxOptions;
  }
  if (adventureSettings.optionMaxLength !== undefined) {
    optionMaxLengthInput.value = adventureSettings.optionMaxLength;
  }
  if (adventureSettings.startPrompt !== undefined) {
    startPromptInput.value = adventureSettings.startPrompt;
  }
  if (adventureSettings.continuePrompt !== undefined) {
    continuePromptInput.value = adventureSettings.continuePrompt;
  }
  if (adventureSettings.customMessagePrompt !== undefined) {
    customMessagePromptInput.value = adventureSettings.customMessagePrompt;
  }
  if (adventureSettings.adventureUseStream !== undefined) {
    adventureUseStreamInput.checked = adventureSettings.adventureUseStream;
  }
  // ===================== 初始化设置项 END =====================
}