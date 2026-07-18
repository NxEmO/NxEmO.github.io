import { profile } from "@/lib/resume";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a href="#home" className="sidebar-brand">
        {profile.name}
      </a>
      <div className="sidebar-tagline">{profile.studio}</div>

      <div className="sidebar-nav" aria-hidden="true" />

      <div className="sidebar-footer">
        <div>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
        <div>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>
    </aside>
  );
}
