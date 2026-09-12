'use client';

const CREATOR = 'khoungbell7777';
const SUPPORT_EMAIL = 'supportrobloxfinder@gmail.com';

export default function SupportCenter() {
  return (
    <div className="support-center" aria-label="RBLXFinder support">
      <a className="support-card plus" href="/plus/">⭐ <span>Roblox Plus</span></a>
      <a className="support-card donate" href="https://www.roblox.com/search/users?keyword=khoungbell7777" target="_blank" rel="noopener noreferrer">💎 <span>Donate {CREATOR}</span></a>
      <a className="support-card creator" href="/creator/">👑 <span>Creator</span></a>
      <a className="support-card feedback" href={`mailto:${SUPPORT_EMAIL}?subject=RBLXFinder%20Feedback&body=Xin%20ch%C3%A0o%20Noobie%2C%0A%0A`}>✉️ <span>Feedback</span></a>
      <style jsx>{`
        .support-center{position:fixed;right:16px;bottom:18px;z-index:9995;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;max-width:min(520px,calc(100vw - 32px))}
        .support-card{display:flex;align-items:center;gap:7px;padding:10px 12px;border-radius:14px;background:#fff;color:#111827;text-decoration:none;font:900 12px/1 Inter,system-ui,sans-serif;border:1px solid #e5e7eb;box-shadow:0 10px 30px #11182718;transition:transform .18s ease,box-shadow .18s ease}
        .support-card:hover{transform:translateY(-2px);box-shadow:0 16px 36px #11182726}
        .plus{color:#5b4bd6}.donate{color:#b45309}.creator{color:#7c3aed}.feedback{color:#0f766e}
        @media(max-width:700px){.support-center{right:10px;bottom:10px;gap:6px}.support-card{padding:10px 11px}.support-card span{display:none}.support-card{width:42px;height:42px;justify-content:center;padding:0;border-radius:13px;font-size:18px}}
      `}</style>
    </div>
  );
}
