# Adventure AI

一个基于 Tauri 的现代化 AI 桌面应用，支持多种 AI 服务和本地模型。

## 功能特性

### 🤖 AI 功能
- 支持多种 AI 服务：
  - OpenAI (GPT-3.5, GPT-4, GPT-4 Turbo)
  - Anthropic (Claude 3)
  - Ollama (本地大语言模型)
  - 自定义 API 端点
- 实时对话界面
- 上下文感知的智能回复
- 自定义模型和参数配置

### ⚙️ 设置
- 安全的 API 密钥管理
- 灵活的模型配置
- 温度、Token 限制等参数调整
- 系统提示词定制
- API 连接测试

### 💾 数据
- 对话历史导出/导入
- 本地数据管理

### 🎨 界面
- 现代化设计
- 深色/浅色主题
- 响应式布局
- 流畅的交互体验

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

## 开发

### 项目结构
```
src/
├── components/          # 页面组件
│   ├── Chat.js         # 聊天页面
│   ├── Settings.js     # 设置页面
│   └── ...
├── services/           # 服务层
│   ├── aiService.js    # AI 服务
│   ├── settingsService.js # 设置服务
│   └── ...
├── styles.css          # 样式文件
├── index.html          # 主页面
└── main.js            # 主入口
```

### 运行开发服务器
```bash
cargo tauri dev
```

### 构建生产版本
```bash
cargo tauri build
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
