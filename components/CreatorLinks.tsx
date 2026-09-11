'use client';

const YOUTUBE_URL = 'https://youtube.com/@noobieroblox_vn?si=WD1ALmE78H02Q_7_';
const DISCORD_URL = 'https://discord.gg/nePuZm3kcu';

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.8 3.9-6.8 3.9Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M19.5 5.2A16.4 16.4 0 0 0 15.7 4l-.5 1a14.6 14.6 0 0 0-6.4 0l-.5-1A16.4 16.4 0 0 0 4.5 5.2C2.1 8.8 1.4 12.3 1.7 15.8a16.2 16.2 0 0 0 4.7 2.4l1.1-1.5c-.6-.2-1.2-.5-1.7-.8l.4-.3c3.3 1.5 7.1 1.5 10.4 0l.4.3c-.5.3-1.1.6-1.7.8l1.1 1.5a16.2 16.2 0 0 0 4.7-2.4c.4-4.1-.7-7.5-1.6-10.6ZM8.5 14.1c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  );
}

export default function CreatorLinks() {
  return (
    <div className="creator-links" aria-label="Noobie links">
      <a className="creator-link youtube" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="Đăng ký kênh YouTube Noobie">
        <YouTubeIcon />
        <span>Đăng ký YouTube</span>
      </a>
      <a className="creator-link discord" href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Tham gia Discord Noobie">
        <DiscordIcon />
        <span>Tham gia Discord</span>
      </a>
      <style jsx>{`
        .creator-links { position: fixed; top: 14px; right: 14px; z-index: 10000; display: flex; gap: 8px; }
        .creator-link { display:flex; align-items:center; gap:8px; padding:9px 12px; border-radius:14px; color:#fff; text-decoration:none; font:800 12px/1 Inter,system-ui,sans-serif; box-shadow:0 10px 28px #11182722; backdrop-filter:blur(12px); transition:transform .18s ease, box-shadow .18s ease; }
        .creator-link:hover { transform:translateY(-2px); box-shadow:0 14px 34px #11182733; }
        .creator-link svg { width:19px; height:19px; flex:none; }
        .youtube { background:#ff0033; }
        .discord { background:#5865f2; }
        @media (max-width:650px) { .creator-links { top:9px; right:9px; gap:6px; } .creator-link { width:42px; height:42px; justify-content:center; padding:0; border-radius:13px; } .creator-link span { display:none; } .creator-link svg { width:20px; height:20px; } }
      `}</style>
    </div>
  );
}
