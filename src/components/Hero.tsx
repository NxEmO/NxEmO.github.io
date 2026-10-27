import { profile } from "@/lib/resume";
import Icon from "./Icon";

export default function Hero({ articleCount = 0 }: { articleCount?: number }) {
  return (
    <section id="home" className="hero glass-panel" aria-labelledby="home-title">
      <div className="hero-kicker"><span className="status-dot" /> {profile.studio}</div>
      <p className="hero-eyebrow">GAME DEVELOPMENT & PERSONAL NOTES</p>
      <h1 id="home-title">Build, play<br /><span>& explore.</span></h1>
      <p className="hero-description">我是 {profile.name}，一名游戏开发者。<br />在这里记录学习、开发，以及从想法到实现的过程。</p>
      <div className="hero-actions">
        <a href="#writing" className="button button-primary"><Icon name="book" /> 浏览文章 <span aria-hidden="true">↓</span></a>
        <a href={profile.github} className="button button-quiet" target="_blank" rel="noopener noreferrer">GitHub <Icon name="arrow" /></a>
      </div>
      <div className="hero-bottom"><span><strong>{articleCount.toString().padStart(2, "0")}</strong> 篇文章</span><span>Game Developer</span><span className="hero-signature">{profile.name} / NOTES</span></div>
    </section>
  );
}
