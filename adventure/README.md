# AI 聊天桌面应用

一个基于 Tauri 的现代化 AI 聊天桌面应用，支持多种 AI 服务提供商。

## 功能特性

### 🤖 AI 聊天功能
- 支持多种 AI 服务提供商：
  - OpenAI (GPT-3.5, GPT-4, GPT-4 Turbo)
  - Anthropic (Claude 3 Opus, Sonnet, Haiku)
  - Ollama (本地大语言模型)
  - 自定义 API 服务
- 实时聊天界面，支持消息历史记录
- AI 输入状态指示器
- 智能消息回复和上下文理解
- 自定义模型名称支持

### ⚙️ 设置管理
- API 密钥安全存储（本地存储）
- 模型选择和参数配置
- 自定义模型名称输入
- 温度控制（创造性程度）
- 最大 Token 数限制
- 自定义系统提示词
- API 连接测试功能
- 可滚动的设置界面

### 💾 数据管理
- 聊天记录导出/导入
- 本地数据清空
- 历史记录限制设置

### 🎨 用户界面
- 现代化设计风格
- 响应式布局
- 侧边栏导航
- 深色主题支持
- 流畅的动画效果
- 滚动优化

## 快速开始

### 1. 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 安装 Rust 依赖 (Tauri)
cd src-tauri
cargo build
```

### 2. 配置 AI 服务

1. 启动应用
2. 点击侧边栏的"设置"
3. 选择 AI 服务提供商
4. 输入您的 API 密钥（Ollama 不需要）
5. 选择模型和配置参数
6. 如需自定义模型，选择"自定义模型"并输入模型名称
7. 点击"测试连接"验证配置
8. 保存设置

### 3. 开始聊天

1. 点击侧边栏的"聊天"
2. 在输入框中输入消息
3. 按 Enter 或点击发送按钮
4. 等待 AI 回复

## API 配置说明

### OpenAI
- **API 密钥**: 从 [OpenAI 平台](https://platform.openai.com/api-keys) 获取
- **基础 URL**: `https://api.openai.com/v1`
- **推荐模型**: `gpt-3.5-turbo` (经济), `gpt-4` (高质量)
- **自定义模型**: 支持输入任何 OpenAI 兼容的模型名称

### Anthropic (Claude)
- **API 密钥**: 从 [Anthropic 控制台](https://console.anthropic.com/) 获取
- **基础 URL**: `https://api.anthropic.com/v1`
- **推荐模型**: `claude-3-sonnet-20240229` (平衡), `claude-3-opus-20240229` (高质量)
- **自定义模型**: 支持输入任何 Claude 模型名称

### Ollama (本地)
- **API 密钥**: 不需要
- **基础 URL**: `http://localhost:11434` (默认)
- **推荐模型**: `llama2`, `mistral`, `codellama`
- **安装 Ollama**: 访问 [Ollama 官网](https://ollama.ai/) 下载安装
- **拉取模型**: `ollama pull llama2`
- **自定义模型**: 支持任何已安装的 Ollama 模型

### 自定义 API
- 支持兼容 OpenAI API 格式的自定义服务
- 需要配置自定义的基础 URL 和 API 密钥
- 确保 API 返回格式与 OpenAI 兼容

## 参数说明

### 温度 (Temperature)
- **0.0**: 最保守，回复最确定
- **0.7**: 平衡，推荐设置
- **2.0**: 最创造性，回复最随机

### 最大 Token 数
- 控制 AI 回复的最大长度
- 建议设置：500-2000
- 影响 API 调用成本

### 系统提示词
- 定义 AI 助手的角色和行为
- 影响所有对话的风格和内容
- 建议用中文编写

### 自定义模型名称
- 当选择"自定义模型"时启用
- 输入具体的模型名称
- 支持任何兼容的模型标识符

## Ollama 使用指南

### 安装 Ollama
1. 访问 [ollama.ai](https://ollama.ai/)
2. 下载适合您系统的版本
3. 安装并启动 Ollama 服务

### 常用模型
```bash
# 拉取基础模型
ollama pull llama2
ollama pull mistral
ollama pull codellama

# 拉取中文模型
ollama pull qwen
ollama pull chinese-llama-2

# 查看已安装模型
ollama list
```

### 配置应用
1. 在设置中选择"Ollama (本地)"
2. 确认基础 URL 为 `http://localhost:11434`
3. 选择已安装的模型或输入自定义模型名称
4. 测试连接

## 开发

### 项目结构
```
src/
├── components/          # 页面组件
│   ├── Chat.js         # 聊天页面
│   ├── Settings.js     # 设置页面
│   └── ...
├── services/           # 服务层
│   └── aiService.js    # AI 服务
├── styles.css          # 样式文件
└── main.js            # 主入口
```

### 运行开发服务器
```bash
npm run tauri dev
```

### 构建生产版本
```bash
npm run tauri build
```

## 安全说明

- API 密钥仅存储在本地浏览器中
- 不会发送到任何第三方服务器
- 建议定期更换 API 密钥
- 不要在公共设备上保存敏感信息
- Ollama 完全本地运行，无需网络连接

## 故障排除

### 常见问题

1. **API 连接失败**
   - 检查 API 密钥是否正确
   - 确认网络连接正常
   - 验证 API 服务是否可用

2. **Ollama 连接失败**
   - 确认 Ollama 服务已启动
   - 检查端口 11434 是否被占用
   - 验证模型是否已安装

3. **模型不可用**
   - 确认您的 API 账户有权限访问所选模型
   - 检查 API 配额是否充足
   - 对于 Ollama，确认模型已正确安装

4. **回复质量不佳**
   - 调整温度参数
   - 优化系统提示词
   - 尝试不同的模型

5. **设置页面无法滚动**
   - 确认浏览器支持现代 CSS 特性
   - 检查是否有 JavaScript 错误

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
