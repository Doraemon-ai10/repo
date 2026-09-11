'use client';

import { useEffect, useMemo, useState } from 'react';

type Favorite = { id: string; name: string; kind: 'roblox' | 'freefire' | 'tool'; url?: string };

const updates = [
  { v: 'V3.1', title: 'Gaming Hub+', text: 'Thêm Global Search, Favorites, Daily Reward, Daily Quest và Share.' },
  { v: 'V3.0', title: 'Roblox + Free Fire Hub', text: 'Power Tools, Game Intelligence, Low-Pop Server Finder, Sensitivity Lab và Aim Challenge.' },
  { v: 'V2.x', title: 'Creator & Community', text: 'AI Assistant, YouTube, Discord, Donate và cộng đồng Noobie.' },
];

const searchItems = [
  ['Roblox Tools', 'roblox', '/tools/'],
  ['Free Fire Lab', 'freefire', '/tools/'],
  ['Game Intelligence', 'tool', '/tools/'],
  ['Low-Pop Server Finder', 'tool', '/tools/'],
  ['Profile Scanner', 'tool', '/tools/'],
  ['Game Compare', 'tool', '/tools/'],
  ['Sensitivity Lab', 'tool', '/tools/'],
  ['Aim Challenge', 'tool', '/tools/'],
  ['HUD Builder', 'tool', '/tools/'],
  ['AI Assistant', 'tool', '#'],
  ['Donate Creator', 'tool', '/'],
  ['Discord Noobie', 'tool', 'https://discord.gg/nePuZm3kcu'],
  ['YouTube Noobie', 'tool', 'https://youtube.com/@noobieroblox_vn'],
] as const;

export default function GamingExtras() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<'home' | 'updates' | 'daily' | 'favorites' | 'search'>('home');
  const [q, setQ] = useState('');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    setXp(Number(localStorage.getItem('rblx_xp') || 0));
    setStreak(Number(localStorage.getItem('rblx_streak') || 0));
    try { setFavorites(JSON.parse(localStorage.getItem('noobie_favorites') || '[]')); } catch { setFavorites([]); }
    const today = new Date().toISOString().slice(0, 10);
    setClaimed(localStorage.getItem('noobie_daily_claim') === today);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return searchItems.slice(0, 8);
    return searchItems.filter(x => x[0].toLowerCase().includes(needle));
  }, [q]);

  const addXp = (amount: number) => {
    setXp(v => {
      const next = v + amount;
      localStorage.setItem('rblx_xp', String(next));
      return next;
    });
  };

  const claimDaily = () => {
    if (claimed) return;
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('noobie_daily_claim', today);
    const nextStreak = Math.max(1, streak + 1);
    localStorage.setItem('rblx_streak', String(nextStreak));
    setStreak(nextStreak);
    setClaimed(true);
    addXp(25);
  };

  const share = async () => {
    const data = { title: 'RBLXFinder — Noobie Gaming Hub', text: 'Roblox + Free Fire tools của Noobie', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard?.writeText(window.location.href); alert('Đã copy link trang!'); }
    } catch {}
  };

  const addFavorite = (item: Favorite) => {
    setFavorites(old => {
      const exists = old.some(x => x.id === item.id);
      const next = exists ? old.filter(x => x.id !== item.id) : [...old, item];
      localStorage.setItem('noobie_favorites', JSON.stringify(next));
      return next;
    });
  };

  const go = (url: string) => {
    if (url === '#') { setOpen(false); return; }
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.href = url;
  };

  return <>
    <button className="gx-launch" onClick={() => setOpen(v => !v)} aria-label="Noobie Gaming Hub">⚡ <span>Hub</span></button>
    {open && <div className="gx-overlay" onClick={() => setOpen(false)}>
      <section className="gx-panel" onClick={e => e.stopPropagation()}>
        <header className="gx-head">
          <div><strong>⚡ Noobie Gaming Hub</strong><small>Roblox + Free Fire · Free-first</small></div>
          <button onClick={() => setOpen(false)} aria-label="Đóng">×</button>
        </header>
        <nav className="gx-tabs">
          {([['home','Hub'],['search','Tìm kiếm'],['daily','Daily'],['favorites','Yêu thích'],['updates','Updates']] as const).map(([k,v]) => <button key={k} className={panel===k?'active':''} onClick={() => setPanel(k)}>{v}</button>)}
        </nav>
        <div className="gx-body">
          {panel === 'home' && <>
            <div className="gx-hero"><b>Level {Math.floor(xp / 100) + 1}</b><span>{xp % 100}/100 XP</span><span>🔥 {streak} ngày</span></div>
            <div className="gx-grid">
              <button onClick={() => setPanel('search')}>🔎<b>Global Search</b><small>Tìm mọi công cụ</small></button>
              <button onClick={() => setPanel('daily')}>🎁<b>Daily Reward</b><small>+25 XP mỗi ngày</small></button>
              <button onClick={() => setPanel('favorites')}>⭐<b>Favorites</b><small>{favorites.length} mục đã lưu</small></button>
              <button onClick={share}>↗️<b>Share</b><small>Chia sẻ trang hiện tại</small></button>
            </div>
          </>}
          {panel === 'search' && <div>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm Roblox, Free Fire, server, AI..." className="gx-input" />
            <div className="gx-list">{results.map(x => <button key={x[0]} onClick={() => go(x[2])}><span>⌕</span><b>{x[0]}</b><small>{x[1]}</small></button>)}{!results.length && <p>Không tìm thấy.</p>}</div>
          </div>}
          {panel === 'daily' && <div className="gx-daily">
            <div className="gx-card"><span className="badge">DAILY REWARD</span><h3>🎁 Nhận thưởng hôm nay</h3><p>Nhận XP và tăng Daily Streak. Dữ liệu lưu ngay trên thiết bị.</p><button disabled={claimed} onClick={claimDaily}>{claimed ? '✓ Đã nhận hôm nay' : 'Nhận +25 XP'}</button></div>
            <div className="gx-card"><span className="badge">DAILY QUEST</span><h3>🏆 Explorer</h3><p>Vào Game Hub và sử dụng ít nhất 2 công cụ hôm nay.</p><button onClick={() => { addXp(10); alert('Quest hoàn thành! +10 XP'); }}>Hoàn thành quest</button></div>
          </div>}
          {panel === 'favorites' && <div className="gx-list">{favorites.length ? favorites.map(f => <div className="gx-fav" key={f.id}><span>⭐</span><div><b>{f.name}</b><small>{f.kind}</small></div><button onClick={() => addFavorite(f)}>×</button></div>) : <div className="gx-empty">Chưa có mục yêu thích. Bạn có thể lưu game từ Roblox Tools.</div>}</div>}
          {panel === 'updates' && <div className="gx-updates">{updates.map(u => <article key={u.v}><span>{u.v}</span><div><b>{u.title}</b><p>{u.text}</p></div></article>)}</div>}
        </div>
        <footer className="gx-foot"><button onClick={share}>↗ Chia sẻ</button><span>Noobie · RBLXFinder</span></footer>
      </section>
    </div>}
    <style jsx>{`
      .gx-launch{position:fixed;left:16px;bottom:18px;z-index:9997;border:0;border-radius:16px;padding:12px 15px;background:#111827;color:#fff;font:900 13px/1 Inter,system-ui,sans-serif;box-shadow:0 12px 35px #0003;cursor:pointer}.gx-overlay{position:fixed;inset:0;z-index:9996;background:#0f172a66;backdrop-filter:blur(5px);display:grid;place-items:end start;padding:78px 16px 74px}.gx-panel{width:min(480px,calc(100vw - 32px));max-height:min(690px,calc(100vh - 120px));background:#fff;border:1px solid #e5e7eb;border-radius:24px;box-shadow:0 30px 90px #0004;overflow:hidden;display:flex;flex-direction:column}.gx-head{padding:16px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eef0f4}.gx-head strong{display:block;font-size:16px}.gx-head small{display:block;margin-top:3px;color:#64748b}.gx-head button{border:0;background:#f1f5f9;border-radius:10px;width:34px;height:34px;font-size:22px;cursor:pointer}.gx-tabs{display:flex;gap:6px;padding:9px 12px;overflow:auto;border-bottom:1px solid #eef0f4}.gx-tabs button{white-space:nowrap;border:0;border-radius:10px;padding:8px 11px;background:#f1f5f9;color:#334155;font-weight:800;cursor:pointer}.gx-tabs button.active{background:#111827;color:#fff}.gx-body{padding:14px;overflow:auto;min-height:300px}.gx-hero{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px;border-radius:17px;background:linear-gradient(135deg,#eff6ff,#f8fafc)}.gx-hero b{font-size:22px}.gx-hero span{font-size:12px;color:#475569;font-weight:800}.gx-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.gx-grid button{border:1px solid #e5e7eb;background:#fff;border-radius:15px;padding:14px;text-align:left;cursor:pointer}.gx-grid button:first-letter{font-size:20px}.gx-grid b,.gx-grid small{display:block;margin-top:5px}.gx-grid small{color:#64748b}.gx-input{width:100%;box-sizing:border-box;border:1px solid #dbe1e8;border-radius:13px;padding:12px;outline:none}.gx-list{display:grid;gap:7px;margin-top:10px}.gx-list>button{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:center;text-align:left;border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:10px;cursor:pointer}.gx-list small{color:#94a3b8}.gx-daily{display:grid;gap:10px}.gx-card{padding:16px;border:1px solid #e5e7eb;border-radius:17px}.gx-card h3{margin:9px 0 6px}.gx-card p{color:#64748b;line-height:1.5}.gx-card button{border:0;border-radius:11px;padding:10px 13px;background:#111827;color:#fff;font-weight:800;cursor:pointer}.gx-card button:disabled{opacity:.5;cursor:not-allowed}.badge{font-size:10px;font-weight:900;color:#2563eb;letter-spacing:.08em}.gx-fav{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #e5e7eb;border-radius:12px}.gx-fav>div{flex:1}.gx-fav small{display:block;color:#94a3b8;margin-top:2px}.gx-fav button{border:0;background:#f1f5f9;border-radius:8px;width:28px;height:28px;cursor:pointer}.gx-empty{padding:28px;text-align:center;color:#64748b}.gx-updates{display:grid;gap:10px}.gx-updates article{display:flex;gap:12px;padding:13px;border:1px solid #e5e7eb;border-radius:14px}.gx-updates article>span{font-weight:900;color:#2563eb}.gx-updates b{display:block}.gx-updates p{margin:4px 0 0;color:#64748b;line-height:1.45}.gx-foot{padding:10px 14px;border-top:1px solid #eef0f4;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#94a3b8}.gx-foot button{border:0;background:transparent;font-weight:900;color:#2563eb;cursor:pointer}@media(max-width:600px){.gx-launch{left:10px;bottom:10px}.gx-overlay{padding:60px 10px 62px}.gx-panel{width:100%;max-height:calc(100vh - 90px)}.gx-grid{grid-template-columns:1fr 1fr}}
    `}</style>
  </>;
}
