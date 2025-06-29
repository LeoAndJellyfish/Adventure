// 设置管理服务
export class SettingsService {
  constructor() {
    this.aiSettingsKey = 'aiSettings';
    this.chatSettingsKey = 'chatSettings';
    this.adventureSettingsKey = 'adventureSettings';
  }

  // 获取AI设置
  getAISettings() {
    const savedSettings = localStorage.getItem(this.aiSettingsKey);
    return savedSettings ? JSON.parse(savedSettings) : this.getDefaultAISettings();
  }

  // 获取聊天设置
  getChatSettings() {
    const savedSettings = localStorage.getItem(this.chatSettingsKey);
    return savedSettings ? JSON.parse(savedSettings) : this.getDefaultChatSettings();
  }

  // 获取冒险设置
  getAdventureSettings() {
    const savedSettings = localStorage.getItem(this.adventureSettingsKey);
    return savedSettings ? JSON.parse(savedSettings) : this.getDefaultAdventureSettings();
  }

  // 保存AI设置
  saveAISettings(settings) {
    localStorage.setItem(this.aiSettingsKey, JSON.stringify(settings));
  }

  // 保存聊天设置
  saveChatSettings(settings) {
    localStorage.setItem(this.chatSettingsKey, JSON.stringify(settings));
  }

  // 保存冒险设置
  saveAdventureSettings(settings) {
    localStorage.setItem(this.adventureSettingsKey, JSON.stringify(settings));
  }

  // 获取默认AI设置
  getDefaultAISettings() {
    return {
      provider: 'openai',
      apiKey: '',
      model: '',
      customModelName: '',
      maxTokens: 1000,
      temperature: 0.7,
      baseUrl: 'https://api.openai.com/v1',
      customPrompt: '你是一个友好的AI助手，请用中文回答用户的问题。'
    };
  }

  // 获取默认聊天设置
  getDefaultChatSettings() {
    return {
      historyLimit: 100,
      useStream: true
    };
  }

  // 获取默认冒险设置
  getDefaultAdventureSettings() {
    return {
      startPrompt: `你是一个专业的冒险故事讲述者。请开始一个{theme}故事，故事应该：
1. 有引人入胜的开头
2. 在故事结尾提供2-4个分支选择供玩家选择
3. 分支选择必须严格按照以下格式标记：
   【选项1】选项内容
   【选项2】选项内容
   【选项3】选项内容
4. 每个分支选择应该简短明确，不超过15个字
5. 选项标记必须使用中文方括号【】，不能使用其他格式

请开始讲述故事：`,
      continuePrompt: `继续讲述冒险故事。玩家选择了：{choice}

请继续故事，要求：
1. 基于玩家的选择继续讲述
2. 故事要有连贯性和逻辑性
3. 在故事结尾提供2-4个新的分支选择
4. 分支选择必须严格按照以下格式标记：
   【选项1】选项内容
   【选项2】选项内容
   【选项3】选项内容
5. 每个分支选择应该简短明确，不超过15个字
6. 选项标记必须使用中文方括号【】，不能使用其他格式
7. 保持角色和情节的一致性

继续故事：`,
      customMessagePrompt: `在冒险故事中，玩家说："{message}"

请基于玩家的这句话继续故事，要求：
1. 回应玩家的输入
2. 保持故事的连贯性
3. 在故事结尾提供2-4个分支选择
4. 分支选择必须严格按照以下格式标记：
   【选项1】选项内容
   【选项2】选项内容
   【选项3】选项内容
5. 每个分支选择应该简短明确，不超过15个字
6. 选项标记必须使用中文方括号【】，不能使用其他格式
7. 保持角色和情节的一致性

继续故事：`,
      defaultTheme: '奇幻冒险',
      maxOptions: 4,
      optionMaxLength: 15,
      adventureUseStream: true
    };
  }

  // 获取所有设置
  getAllSettings() {
    return {
      ai: this.getAISettings(),
      chat: this.getChatSettings(),
      adventure: this.getAdventureSettings()
    };
  }

  // 保存所有设置
  saveAllSettings(aiSettings, chatSettings, adventureSettings) {
    this.saveAISettings(aiSettings);
    this.saveChatSettings(chatSettings);
    if (adventureSettings) {
      this.saveAdventureSettings(adventureSettings);
    }
  }

  // 重置所有设置
  resetAllSettings() {
    localStorage.removeItem(this.aiSettingsKey);
    localStorage.removeItem(this.chatSettingsKey);
    localStorage.removeItem(this.adventureSettingsKey);
  }

  // 导出设置
  exportSettings() {
    return JSON.stringify(this.getAllSettings(), null, 2);
  }

  // 导入设置
  importSettings(settingsData) {
    try {
      const settings = JSON.parse(settingsData);
      if (settings.ai) {
        this.saveAISettings(settings.ai);
      }
      if (settings.chat) {
        this.saveChatSettings(settings.chat);
      }
      if (settings.adventure) {
        this.saveAdventureSettings(settings.adventure);
      }
      return true;
    } catch (error) {
      console.error('导入设置失败:', error);
      return false;
    }
  }

  // 检查设置是否存在
  hasSettings() {
    return localStorage.getItem(this.aiSettingsKey) !== null || 
           localStorage.getItem(this.chatSettingsKey) !== null ||
           localStorage.getItem(this.adventureSettingsKey) !== null;
  }
}

// 创建全局设置服务实例
export const settingsService = new SettingsService(); 