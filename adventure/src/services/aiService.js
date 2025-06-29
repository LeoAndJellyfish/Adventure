import { settingsService } from './settingsService.js';

// AI聊天服务
export class AIService {
  constructor() {
    this.conversationHistory = [];
    this.isTyping = false;
    this.settings = settingsService.getAISettings();
  }

  // 获取设置
  getSettings() {
    return this.settings;
  }

  // 保存设置
  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    settingsService.saveAISettings(this.settings);
  }

  // 添加消息到历史记录
  addMessage(message, sender) {
    this.conversationHistory.push({
      id: Date.now(),
      text: message,
      sender: sender,
      timestamp: new Date()
    });
  }

  // 获取对话历史
  getHistory() {
    return this.conversationHistory;
  }

  // 清空对话历史
  clearHistory() {
    this.conversationHistory = [];
  }

  // 通用AI回复（支持流式和非流式）
  async generateResponse(userMessage, onData) {
    this.isTyping = true;
    try {
      let response;
      const provider = this.settings.provider;
      const messages = this.buildMessages(userMessage);
      const model = this.settings.customModelName || this.settings.model;
      // OpenAI
      if (provider === 'openai' || provider === 'custom') {
        const url = provider === 'openai' ? `${this.settings.baseUrl}/chat/completions` : `${this.settings.baseUrl}/chat/completions`;
        const headers = {
          'Content-Type': 'application/json',
        };
        if (this.settings.apiKey) headers['Authorization'] = `Bearer ${this.settings.apiKey}`;
        const body = JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: this.settings.maxTokens,
          temperature: this.settings.temperature,
          stream: !!onData
        });
        const res = await fetch(url, { method: 'POST', headers, body });
        if (!res.ok) throw new Error('API调用失败');
        if (onData) {
          // 流式
          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let result = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
            for (const line of lines) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') break;
              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content || '';
                if (content) {
                  result += content;
                  onData(result, content);
                }
              } catch {}
            }
          }
          this.isTyping = false;
          return result;
        } else {
          // 非流式
          const data = await res.json();
          this.isTyping = false;
          return data.choices[0].message.content.trim();
        }
      }
      // Anthropic
      if (provider === 'anthropic') {
        const url = 'https://api.anthropic.com/v1/messages';
        const headers = {
          'Content-Type': 'application/json',
          'x-api-key': this.settings.apiKey,
          'anthropic-version': '2023-06-01'
        };
        const systemMessage = messages.find(msg => msg.role === 'system');
        const userMessages = messages.filter(msg => msg.role === 'user');
        const body = JSON.stringify({
          model: model,
          max_tokens: this.settings.maxTokens,
          temperature: this.settings.temperature,
          system: systemMessage?.content || this.settings.customPrompt,
          messages: userMessages,
          stream: !!onData
        });
        const res = await fetch(url, { method: 'POST', headers, body });
        if (!res.ok) throw new Error('API调用失败');
        if (onData) {
          // 流式
          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let result = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
            for (const line of lines) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') break;
              try {
                const json = JSON.parse(data);
                const content = json.delta?.text || '';
                if (content) {
                  result += content;
                  onData(result, content);
                }
              } catch {}
            }
          }
          this.isTyping = false;
          return result;
        } else {
          // 非流式
          const data = await res.json();
          this.isTyping = false;
          return data.content[0].text.trim();
        }
      }
      // Ollama
      if (provider === 'ollama') {
        const url = `${this.settings.baseUrl}/api/chat`;
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({
          model: model,
          messages: messages,
          options: {
            temperature: this.settings.temperature,
            num_predict: this.settings.maxTokens
          },
          stream: !!onData
        });
        const res = await fetch(url, { method: 'POST', headers, body });
        if (!res.ok) throw new Error('Ollama API调用失败');
        if (onData) {
          // 流式
          const reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let result = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim());
            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                const content = json.message?.content || '';
                if (content) {
                  result += content;
                  onData(result, content);
                }
              } catch {}
            }
          }
          this.isTyping = false;
          return result;
        } else {
          // 非流式
          const data = await res.json();
          this.isTyping = false;
          return data.message.content.trim();
        }
      }
      throw new Error('不支持的AI服务提供商');
    } catch (error) {
      this.isTyping = false;
      throw error;
    }
  }

  // 构建消息数组
  buildMessages(userMessage) {
    const messages = [
      {
        role: 'system',
        content: this.settings.customPrompt
      }
    ];

    // 添加最近的对话历史（限制长度以避免token超限）
    const recentHistory = this.conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    }

    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  // 测试API连接
  async testConnection() {
    try {
      const testMessage = '你好';
      const response = await this.generateResponse(testMessage);
      return {
        success: true,
        message: 'API连接测试成功',
        response: response
      };
    } catch (error) {
      return {
        success: false,
        message: 'API连接测试失败',
        error: error.message
      };
    }
  }

  // 检查是否正在输入
  getTypingStatus() {
    return this.isTyping;
  }
}

// 创建全局AI服务实例
export const aiService = new AIService(); 