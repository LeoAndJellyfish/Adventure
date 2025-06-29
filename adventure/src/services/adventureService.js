import { aiService } from './aiService.js';
import { settingsService } from './settingsService.js';

// 冒险服务
export class AdventureService {
  constructor() {
    this.storyHistory = [];
    this.currentStory = null;
    this.branchOptions = [];
    this.isGenerating = false;
    this.settings = settingsService.getAdventureSettings();
  }

  // 获取设置
  getSettings() {
    return this.settings;
  }

  // 保存设置
  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    settingsService.saveAdventureSettings(this.settings);
  }

  // 开始新冒险
  async startNewAdventure(theme = null, background = null) {
    const adventureTheme = theme || this.settings.defaultTheme || '奇幻冒险';
    let prompt = this.settings.startPrompt.replace('{theme}', adventureTheme);
    
    // 如果有自定义背景，添加到提示词中
    if (background) {
      const backgroundInfo = this.formatBackgroundInfo(background);
      prompt = prompt.replace('请开始讲述故事：', `\n\n故事背景设定：\n${backgroundInfo}\n\n请基于以上背景设定开始讲述故事：`);
    }

    this.isGenerating = true;
    try {
      const response = await aiService.generateResponse(prompt);
      this.isGenerating = false;
      
      const { storyText, options } = this.parseStoryResponse(response);
      
      this.currentStory = {
        id: Date.now(),
        text: storyText,
        options: options,
        timestamp: new Date(),
        theme: adventureTheme,
        background: background
      };
      
      this.storyHistory.push(this.currentStory);
      
      return this.currentStory;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  // 格式化背景信息
  formatBackgroundInfo(background) {
    let info = '';
    
    if (background.characterName) {
      info += `主角名称：${background.characterName}\n`;
    }
    
    if (background.characterRole) {
      info += `主角身份：${background.characterRole}\n`;
    }
    
    if (background.worldSetting) {
      info += `世界设定：${background.worldSetting}\n`;
    }
    
    if (background.storyGoal) {
      info += `故事目标：${background.storyGoal}\n`;
    }
    
    return info;
  }

  // 格式化故事历史
  formatStoryHistory() {
    if (this.storyHistory.length === 0) {
      return '';
    }
    
    let history = '\n\n故事历史：\n';
    
    this.storyHistory.forEach((story, index) => {
      history += `第${index + 1}章：${story.text}\n`;
      
      // 如果有玩家选择，显示选择
      if (story.previousChoice) {
        history += `玩家选择：${story.previousChoice}\n`;
        // console.log(`第${index + 1}章的玩家选择:`, story.previousChoice); // 调试日志
      }
      
      // 如果有玩家自定义消息，显示消息
      if (story.playerMessage) {
        history += `玩家说：${story.playerMessage}\n`;
      }
      
      history += '\n';
    });
    
    // console.log('格式化的故事历史:', history); // 调试日志
    return history;
  }

  // 选择分支继续故事
  async continueStory(optionIndex) {
    if (!this.currentStory || !this.currentStory.options[optionIndex]) {
      throw new Error('无效的分支选择');
    }

    const selectedOption = this.currentStory.options[optionIndex];
    
    // 先更新当前故事的选择，这样历史记录就会包含正确的选择
    this.currentStory.previousChoice = selectedOption;
    
    // console.log('玩家选择了:', selectedOption); // 调试日志
    
    let prompt = this.settings.continuePrompt.replace('{choice}', selectedOption);
    
    // 添加故事历史（现在会包含正确的选择）
    const storyHistory = this.formatStoryHistory();
    // console.log('发送给AI的完整提示词:', prompt); // 调试日志
    prompt = prompt.replace('继续故事：', `${storyHistory}\n继续故事：`);

    this.isGenerating = true;
    try {
      const response = await aiService.generateResponse(prompt);
      this.isGenerating = false;
      
      const { storyText, options } = this.parseStoryResponse(response);
      
      // 创建新的故事节点
      this.currentStory = {
        id: Date.now(),
        text: storyText,
        options: options,
        timestamp: new Date()
      };
      
      this.storyHistory.push(this.currentStory);
      
      return this.currentStory;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  // 解析AI回复，提取故事文本和分支选项
  parseStoryResponse(response) {
    // console.log('原始AI回复:', response); // 调试日志
    
    let options = [];
    let storyText = response;
    
    // 方法1：使用split分割，查找【选项】格式
    if (response.includes('【选项')) {
      const parts = response.split(/【选项\d+】/);
      if (parts.length > 1) {
        // 第一部分是故事文本
        storyText = parts[0].trim();
        
        // 后续部分是选项
        for (let i = 1; i < parts.length; i++) {
          const optionText = parts[i].trim();
          if (optionText && optionText.length > 0) {
            options.push(optionText);
            // console.log(`提取选项${i}:`, optionText);
          }
        }
      }
    }
    // 方法2：如果方法1失败，尝试正则表达式
    else {
      const optionRegex = /【选项(\d+)】(.*?)(?=【选项\d+】|$)/g;
      optionRegex.lastIndex = 0;
      
      let match;
      while ((match = optionRegex.exec(response)) !== null) {
        const optionNumber = parseInt(match[1]);
        const optionText = match[2].trim();
        if (optionText && optionText.length > 0) {
          options[optionNumber - 1] = optionText;
          // console.log(`正则提取选项${optionNumber}:`, optionText);
        }
      }
      
      // 移除选项标记，保留纯故事文本
      storyText = response.replace(/【选项\d+】.*?(?=【选项\d+】|$)/g, '').trim();
    }
    
    console.log('解析后的故事文本:', storyText); // 调试日志
    console.log('解析后的选项:', options); // 调试日志
    
    // 如果没有找到选项，尝试手动解析
    if (options.length === 0) {
      console.log('未找到标准格式选项，尝试手动解析...');
      // 查找包含"选项"的行
      const lines = response.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.includes('选项') || trimmedLine.match(/^\d+[.．]/)) {
          console.log('找到可能的选项行:', trimmedLine);
        }
      }
    }
    
    return {
      storyText,
      options: options.filter(option => option && option.length > 0)
    };
  }

  // 获取故事历史
  getStoryHistory() {
    return this.storyHistory;
  }

  // 清空故事历史
  clearStoryHistory() {
    this.storyHistory = [];
    this.currentStory = null;
    this.branchOptions = [];
  }

  // 获取当前故事
  getCurrentStory() {
    return this.currentStory;
  }

  // 检查是否正在生成
  isGeneratingStory() {
    return this.isGenerating;
  }

  // 发送自定义消息（用于玩家输入）
  async sendCustomMessage(message) {
    let prompt = this.settings.customMessagePrompt.replace('{message}', message);
    
    // 添加故事历史
    const storyHistory = this.formatStoryHistory();
    prompt = prompt.replace('继续故事：', `${storyHistory}\n继续故事：`);

    this.isGenerating = true;
    try {
      const response = await aiService.generateResponse(prompt);
      this.isGenerating = false;
      
      const { storyText, options } = this.parseStoryResponse(response);
      
      this.currentStory = {
        id: Date.now(),
        text: storyText,
        options: options,
        timestamp: new Date(),
        playerMessage: message
      };
      
      this.storyHistory.push(this.currentStory);
      
      return this.currentStory;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  // 流式：开始新冒险
  async streamStartNewAdventure(theme = null, background = null, onData) {
    const adventureTheme = theme || this.settings.defaultTheme || '奇幻冒险';
    let prompt = this.settings.startPrompt.replace('{theme}', adventureTheme);
    if (background) {
      const backgroundInfo = this.formatBackgroundInfo(background);
      prompt = prompt.replace('请开始讲述故事：', `\n\n故事背景设定：\n${backgroundInfo}\n\n请基于以上背景设定开始讲述故事：`);
    }
    this.isGenerating = true;
    let fullText = '';
    const adventureSettings = settingsService.getAdventureSettings();
    const useStream = adventureSettings.adventureUseStream;
    try {
      if (useStream) {
        await aiService.generateResponse(prompt, (all, delta) => {
          fullText = all;
          if (onData) onData(all, delta);
        });
      } else {
        fullText = await aiService.generateResponse(prompt);
        if (onData) onData(fullText, fullText);
      }
      this.isGenerating = false;
      const { storyText, options } = this.parseStoryResponse(fullText);
      this.currentStory = {
        id: Date.now(),
        text: storyText,
        options: options,
        timestamp: new Date(),
        theme: adventureTheme,
        background: background
      };
      this.storyHistory.push(this.currentStory);
      return this.currentStory;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  // 流式：继续故事
  async streamContinueStory(optionIndex, onData) {
    if (!this.currentStory || !this.currentStory.options[optionIndex]) {
      throw new Error('无效的分支选择');
    }
    const selectedOption = this.currentStory.options[optionIndex];
    this.currentStory.previousChoice = selectedOption;
    let prompt = this.settings.continuePrompt.replace('{choice}', selectedOption);
    const storyHistory = this.formatStoryHistory();
    prompt = prompt.replace('继续故事：', `${storyHistory}\n继续故事：`);
    this.isGenerating = true;
    let fullText = '';
    const adventureSettings = settingsService.getAdventureSettings();
    const useStream = adventureSettings.adventureUseStream;
    try {
      if (useStream) {
        await aiService.generateResponse(prompt, (all, delta) => {
          fullText = all;
          if (onData) onData(all, delta);
        });
      } else {
        fullText = await aiService.generateResponse(prompt);
        if (onData) onData(fullText, fullText);
      }
      this.isGenerating = false;
      const { storyText, options } = this.parseStoryResponse(fullText);
      this.currentStory = {
        id: Date.now(),
        text: storyText,
        options: options,
        timestamp: new Date()
      };
      this.storyHistory.push(this.currentStory);
      return this.currentStory;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  // 流式：自定义消息
  async streamSendCustomMessage(message, onData) {
    let prompt = this.settings.customMessagePrompt.replace('{message}', message);
    const storyHistory = this.formatStoryHistory();
    prompt = prompt.replace('继续故事：', `${storyHistory}\n继续故事：`);
    this.isGenerating = true;
    let fullText = '';
    const adventureSettings = settingsService.getAdventureSettings();
    const useStream = adventureSettings.adventureUseStream;
    try {
      if (useStream) {
        await aiService.generateResponse(prompt, (all, delta) => {
          fullText = all;
          if (onData) onData(all, delta);
        });
      } else {
        fullText = await aiService.generateResponse(prompt);
        if (onData) onData(fullText, fullText);
      }
      this.isGenerating = false;
      const { storyText, options } = this.parseStoryResponse(fullText);
      this.currentStory = {
        id: Date.now(),
        text: storyText,
        options: options,
        timestamp: new Date(),
        playerMessage: message
      };
      this.storyHistory.push(this.currentStory);
      return this.currentStory;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }
}

// 创建单例实例
export const adventureService = new AdventureService(); 