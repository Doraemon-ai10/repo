'use client';

const YOUTUBE_URL = 'https://youtube.com/@noobieroblox_vn';
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
      <a className="social-icon youtube" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube Noobie">
        <YouTubeIcon />
      </a>
      <a className="social-icon discord" href={DISCORD_URL} target="_blank" rel="noopener noreferrer" aria-label="Discord Noobie">
        <DiscordIcon />
      </a>
      <style jsx>{`
        .creator-links{position:fixed;top:14px;right:14px;z-index:10000;display:flex;gap:10px;align-items:center}
        .social-icon{width:54px;height:54px;display:grid;place-items:center;border-radius:50%;background:#fff;text-decoration:none;border:1px solid #e5e7eb;box-shadow:0 10px 28px #11182720;transition:transform .18s ease,box-shadow .18s ease}
        .social-icon:hover{transform:scale(1.08) translateY(-1px);box-shadow:0 16px 36px #1118272e}
        .social-icon svg{width:32px;height:32px;display:block}
        .youtube{color:#ff0000}.discord{color:#5865f2}
        @media(max-width:650px){.creator-links{top:9px;right:9px;gap:7px}.social-icon{width:50px;height:50px}.social-icon svg{width:30px;height:30px}}
      `}</style>
    </div>
  );
}
