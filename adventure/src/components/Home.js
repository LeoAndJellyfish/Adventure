export default function Home() {
  return `
    <div class="home-container">
      <h1>欢迎来到 Adventure!</h1>
      <p style="font-size:1.2rem;margin-bottom:2rem;">这是一个集聊天、冒险和个性化设置于一体的桌面应用。</p>
      <div class="home-features">
        <div class="feature-card" data-page="聊天" tabindex="0">
          <h2>💬 聊天</h2>
          <p>与AI进行自然流畅的对话，获取灵感与帮助。</p>
        </div>
        <div class="feature-card" data-page="冒险" tabindex="0">
          <h2>🗺️ 冒险</h2>
          <p>体验互动式冒险故事，做出你的选择，开启专属旅程。</p>
        </div>
        <div class="feature-card" data-page="设置" tabindex="0">
          <h2>⚙️ 设置</h2>
          <p>自定义主题、偏好和更多，打造专属体验。</p>
        </div>
      </div>
    </div>
  `;
}