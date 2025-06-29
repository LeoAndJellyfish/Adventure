import { aiService } from '../services/aiService.js';
import { settingsService } from '../services/settingsService.js';

export default function Chat() {
  return `
    <div class="chat-container">
      <div class="chat-header">
        <h2>AI 助手</h2>
        <div class="chat-status">
          <span class="status-dot online"></span>
          <span class="status-text">在线</span>
        </div>
      </div>
      
      <div class="chat-messages" id="chatMessages"></div>
      
      <div class="typing-indicator" id="typingIndicator" style="display: none;">
        <div class="message ai-message">
          <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
              <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
              <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
              <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
            </svg>
          </div>
          <div class="message-content">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input-container">
        <div class="input-wrapper">
          <textarea 
            class="chat-input" 
            id="messageInput"
            placeholder="输入你的消息..." 
            rows="1"
          ></textarea>
          <div class="input-actions">
            <button class="action-btn" id="clearBtn" title="清空聊天">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            <button class="send-button" id="sendBtn" title="发送">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 聊天功能脚本
export function initChat() {
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.getElementById('chatMessages');
  const clearBtn = document.getElementById('clearBtn');
  const typingIndicator = document.getElementById('typingIndicator');

  // 自动加载本地历史
  function renderHistory() {
    const history = aiService.getHistory();
    chatMessages.innerHTML = '';
    if (history.length === 0) {
      // 显示欢迎语
      chatMessages.innerHTML = `
        <div class="message ai-message">
          <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
              <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
              <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
              <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-text">
              你好！我是你的AI助手，有什么可以帮助你的吗？
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
      `;
      return;
    }
    for (const msg of history) {
      addMessage(msg.text, msg.sender, msg.timestamp);
    }
  }

  // 自动调整输入框高度
  messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // 显示输入状态
  function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 隐藏输入状态
  function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
  }

  // 发送消息
  async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // 添加用户消息
    addMessage(message, 'user');
    aiService.addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // 显示AI正在输入
    showTypingIndicator();

    // 判断是否流式
    const chatSettings = settingsService.getChatSettings();
    const useStream = chatSettings.useStream;
    let aiDiv = document.createElement('div');
    aiDiv.className = 'message ai-message';
    aiDiv.innerHTML = `
      <div class="message-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
          <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
          <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
          <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-text" id="streamingAIText"></div>
        <div class="message-time">正在输入...</div>
      </div>
    `;
    chatMessages.appendChild(aiDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let fullText = '';
    try {
      if (useStream) {
        await aiService.generateResponse(message, (all, delta) => {
          fullText = all;
          const textDiv = aiDiv.querySelector('.message-text');
          if (textDiv) textDiv.textContent = all;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      } else {
        fullText = await aiService.generateResponse(message);
        const textDiv = aiDiv.querySelector('.message-text');
        if (textDiv) textDiv.textContent = fullText;
      }
    } catch (e) {
      const textDiv = aiDiv.querySelector('.message-text');
      if (textDiv) textDiv.textContent = 'AI回复失败：' + e.message;
    }
    hideTypingIndicator();
    // 补充时间
    const timeDiv = aiDiv.querySelector('.message-time');
    if (timeDiv) timeDiv.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    // 存入历史
    aiService.addMessage(fullText, 'ai');
  }

  // 添加消息到聊天界面
  function addMessage(text, sender, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    let time;
    if (timestamp) {
      time = new Date(timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else {
      time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div class="message-content">
          <div class="message-text">${text}</div>
          <div class="message-time">${time}</div>
        </div>
        <div class="message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
            <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
            <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
            <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text">${text}</div>
          <div class="message-time">${time}</div>
        </div>
      `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 清空聊天记录
  function clearChat() {
    if (confirm('确定要清空所有聊天记录吗？')) {
      chatMessages.innerHTML = `
        <div class="message ai-message">
          <div class="message-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"></path>
              <path d="M19 3v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path>
              <path d="M21 9v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"></path>
              <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"></path>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-text">
              聊天记录已清空。有什么可以帮助你的吗？
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
      `;
      aiService.clearHistory();
    }
  }

  // 事件监听器
  sendBtn.addEventListener('click', sendMessage);
  clearBtn.addEventListener('click', clearChat);
  
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 在初始化时调用
  renderHistory();
}