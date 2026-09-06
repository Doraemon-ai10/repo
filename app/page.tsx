'use client';

import { useEffect, useMemo, useState } from 'react';

type U = { id: number; name: string; displayName: string; avatar?: string };
type G = {
  universeId: number; rootPlaceId: number; name: string; playing?: number; visits?: number;
  favorites?: number; description?: string; created?: string; updated?: string;
  maxPlayers?: number; genre?: string; creator?: { name?: string };
};
type S = { id: string; maxPlayers: number; playing: number };

const R = 'https://www.roblox.com';

async function api(action: string, x: Record<string, unknown> = {}) {
  const r = await fetch('/api/roblox', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...x }),
  });
  const d = await r.json();
  if (!r.ok) throw Error(d?.error || 'API error');
  return d;
}

const fallbackThumb = (g: G) => `https://www.roblox.com/asset-thumbnail/image?assetId=${g.rootPlaceId}&width=768&height=432&format=png`;

export default function Home() {
  const [name, setName] = useState('');
  const [pending, setPending] = useState<U | null>(null);
  const [user, setUser] = useState<U | null>(null);
  const [q, setQ] = useState('');
  const [games, setGames] = useState<G[]>([]);
  const [game, setGame] = useState<G | null>(null);
  const [detail, setDetail] = useState<G | null>(null);
  const [servers, setServers] = useState<S[]>([]);
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [priv, setPriv] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [target, setTarget] = useState<S | null>(null);
  const [sort, setSort] = useState('few');
  const [max, setMax] = useState('all');
  const [time, setTime] = useState('');

  async function loadThumbs(list: G[]) {
    if (!list.length) return;
    try {
      const d = await api('thumbs', { universeIds: list.map(g => g.universeId) });
      const next: Record<number, string> = {};
      for (const item of d?.data || []) {
        const url = item?.thumbnails?.find((x: any) => x?.imageUrl)?.imageUrl;
        if (url) next[Number(item.universeId)] = url;
      }
      setThumbs(prev => ({ ...prev, ...next }));
    } catch { /* fallback image remains available */ }
  }

  useEffect(() => {
    const n = localStorage.getItem('rblx_username');
    if (n) {
      setName(n);
      api('username', { username: n }).then(async d => {
        const u = d?.data?.[0];
        if (!u) return;
        try {
          const a = await api('avatar', { userId: u.id });
          setUser({ ...u, avatar: a?.data?.[0]?.imageUrl || '' });
        } catch { setUser(u); }
      }).catch(() => {});
    }
  }, []);

  async function username() {
    if (!name.trim()) return;
    setBusy(true); setError('');
    try {
      const d = await api('username', { username: name.trim() });
      const u = d?.data?.[0];
      if (!u) throw Error();
      let avatar = '';
      try { const a = await api('avatar', { userId: u.id }); avatar = a?.data?.[0]?.imageUrl || ''; } catch {}
      setPending({ ...u, avatar });
    } catch { setError('Không tìm thấy username. Hãy kiểm tra chính tả.'); }
    finally { setBusy(false); }
  }

  function confirm() {
    if (!pending) return;
    setUser(pending); setName(pending.name); localStorage.setItem('rblx_username', pending.name); setPending(null);
  }

  async function search() {
    if (!q.trim()) return;
    setBusy(true); setError('');
    try {
      const d = await api('games', { query: q.trim() });
      const list: G[] = Array.isArray(d?.data) ? d.data : [];
      setGames(list);
      if (!list.length) setError(`Không có game nào khớp “${q.trim()}”. Thử tên game ngắn hơn.`);
      loadThumbs(list);
    } catch { setError('Không thể tìm game lúc này. Hãy thử lại sau vài giây.'); }
    finally { setBusy(false); }
  }

  async function open(g: G) {
    setGame(g); setDetail(null); setServers([]); setPriv(null); setBusy(true); setError('');
    loadThumbs([g]);
    try {
      const [d, p, s] = await Promise.all([
        api('details', { universeId: g.universeId }),
        api('private', { universeId: g.universeId }),
        api('servers', { placeId: g.rootPlaceId }),
      ]);
      setDetail(d?.data?.[0] || g); setPriv(Boolean(p)); setServers(s?.data || []); setTime(new Date().toLocaleTimeString('vi-VN'));
    } catch { setError('Game hoặc server chưa tải đủ. Bấm Làm mới để thử lại.'); }
    finally { setBusy(false); }
  }

  const shown = useMemo(() => [...servers]
    .filter(s => max === 'all' || s.playing <= Number(max))
    .sort((a, b) => sort === 'few'
      ? a.playing - b.playing
      : (b.maxPlayers - b.playing) - (a.maxPlayers - a.playing)), [servers, max, sort]);

  function launch(kind: 'vng' | 'global') {
    if (!game || !target) return;
    const pkg = kind === 'vng' ? 'com.roblox.client.vnggames' : 'com.roblox.client';
    const u = `intent://placeId=${game.rootPlaceId}&gameInstanceId=${encodeURIComponent(target.id)}#Intent;scheme=roblox;package=${pkg};end`;
    window.location.href = u;
    setTimeout(() => location.href = `${R}/games/start?placeId=${game.rootPlaceId}&gameInstanceId=${encodeURIComponent(target.id)}`, 1200);
    setTarget(null);
  }

  const gameImage = (g: G) => thumbs[g.universeId] || fallbackThumb(g);

  return <main className="wrap">
    <nav className="nav">
      <div className="brand"><span className="brandIcon">🎮</span><span><b>RBLX</b> Server Finder<small>Smart server browser</small></span></div>
      <div className="pill"><i /> LIVE API</div>
    </nav>

    {!game ? <>
      <section className="hero">
        <div className="userbox">
          <div className="userintro"><b>👤 Username Roblox</b><div className="small">Tra cứu công khai · không mật khẩu · không cookie</div></div>
          <div className="userrow"><input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && username()} placeholder="Nhập username Roblox"/><button className="btn" onClick={username}><span>{busy ? '⏳' : '✨'}</span>{busy ? 'Đang kiểm tra…' : 'Kiểm tra'}</button></div>
          {user && <div className="userok"><img src={user.avatar || `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=150&height=150&format=png`} /><div><span>✓ Đã xác nhận</span><b>{user.displayName}</b><small>@{user.name} · ID {user.id}</small></div></div>}
        </div>
        <div className="eyebrow">⚡ FIND A BETTER SERVER</div>
        <h1>Tìm server <em>nhanh hơn.</em></h1>
        <p>Chọn game → xem thông tin → lọc server ít người → mở <b>đúng server</b> bạn chọn.</p>
        <div className="search"><span className="searchIcon">⌕</span><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Tìm game Roblox… ví dụ: Brookhaven, Blox Fruits"/><button className="btn" onClick={search}><span>{busy ? '⏳' : '🔎'}</span>{busy ? 'Đang tìm…' : 'Tìm game'}</button></div>
        <div className="quick"><span>Gợi ý:</span><button onClick={() => { setQ('Brookhaven'); }}>Brookhaven</button><button onClick={() => { setQ('Blox Fruits'); }}>Blox Fruits</button><button onClick={() => { setQ('Grow a Garden'); }}>Grow a Garden</button></div>
      </section>
      {error && <div className="notice danger">⚠️ {error}</div>}
      <section className="section">
        <div className="sectionHead"><div><div className="sectionKicker">ROBLOX DISCOVERY</div><h2>🔥 Game</h2></div>{games.length > 0 && <span className="resultCount">{games.length} kết quả</span>}</div>
        {games.length ? <div className="games">{games.map((g, i) => <button className="card gamecard" style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }} key={g.universeId} onClick={() => open(g)}>
          <div className="thumbWrap"><img className="thumb" src={gameImage(g)} alt={g.name} loading={i < 4 ? 'eager' : 'lazy'} onError={e => { const el = e.currentTarget; if (!el.src.includes('asset-thumbnail')) el.src = fallbackThumb(g); }} /><span className="playBadge">▶</span></div>
          <div className="title">{g.name}</div><div className="gameMeta"><span>👥 {(g.playing || 0).toLocaleString()}</span><span>▶ Chơi</span></div>
        </button>)}</div> : <div className="empty"><div className="emptyIcon">🎮</div><b>Tìm game để bắt đầu</b><span>Ảnh game thật sẽ được tải trực tiếp từ Roblox.</span></div>}
      </section>
    </> : <>
      <button className="back" onClick={() => setGame(null)}>← Chọn game khác</button>
      {busy && !detail ? <div className="card empty"><span className="spinner">⟳</span><br/>Đang quét server…</div> : <>
        <div className="card selectedCard">
          <div className="gamehead"><img src={gameImage(game)} alt={game.name} /><div><div className="sectionKicker">SELECTED EXPERIENCE</div><h2>{detail?.name || game.name}</h2><div className="muted">{detail?.creator?.name ? `Bởi ${detail.creator.name}` : 'Roblox Experience'}</div></div></div>
          <div className="stats"><div><b>{(detail?.playing || 0).toLocaleString()}</b><span>Đang chơi</span></div><div><b>{(detail?.visits || 0).toLocaleString()}</b><span>Visits</span></div><div><b>{(detail?.favorites || 0).toLocaleString()}</b><span>Yêu thích</span></div><div><b>{detail?.maxPlayers || '—'}</b><span>Max/server</span></div></div>
          {detail?.description && <p className="description">{detail.description}</p>}
          <div className="meta">{detail?.genre && <span>🎮 {detail.genre}</span>}{detail?.created && <span>📅 {new Date(detail.created).toLocaleDateString('vi-VN')}</span>}{detail?.updated && <span>🔄 {new Date(detail.updated).toLocaleDateString('vi-VN')}</span>}</div>
        </div>
        <div className="notice privateNotice">🔐 <div><b>Private Server</b><span>{priv === true ? 'Game đang bật Private Server.' : priv === false ? 'Game không bật Private Server.' : 'Chưa xác định.'}</span></div><button className="linkbtn" onClick={() => window.open(`${R}/games/${game.rootPlaceId}`, '_blank')}>Mở Roblox ↗</button>{priv && <div className="vpnbox">💡 Chưa có server riêng? Tạo Private Server trên Roblox rồi quay lại đây để làm mới.</div>}</div>
        <div className="toolbar"><div className="toolbarTitle"><b>👥 Server công khai</b><small>Đã ưu tiên server ít người từ API</small></div><select className="select" value={sort} onChange={e => setSort(e.target.value)}><option value="few">Ít người nhất</option><option value="space">Nhiều chỗ trống</option></select><select className="select" value={max} onChange={e => setMax(e.target.value)}><option value="all">Tất cả</option><option value="5">≤ 5 người</option><option value="10">≤ 10 người</option><option value="20">≤ 20 người</option></select><button className="refresh" onClick={() => game && open(game)}>↻ Làm mới</button><span className="muted countText">{shown.length} server {time && `· ${time}`}</span></div>
        {shown.length ? <div className="serverList">{shown.map((s, i) => { const pct = s.maxPlayers ? Math.min(100, Math.round(s.playing / s.maxPlayers * 100)) : 0; return <div className="server" style={{ animationDelay: `${Math.min(i, 15) * 25}ms` }} key={s.id}><div className="serverMain"><div className="serverTop"><b>Server {s.id.slice(0, 8)}…</b><span className={`status ${pct < 35 ? 'good' : pct < 70 ? 'mid' : 'full'}`}>{pct < 35 ? 'Rất thoáng' : pct < 70 ? 'Ổn' : 'Đông'}</span></div><div className="small">{s.playing}/{s.maxPlayers} người · còn {Math.max(0, s.maxPlayers - s.playing)} chỗ</div><div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div></div><button className="join" onClick={() => setTarget(s)}>🚀 Vào server</button></div> })}</div> : <div className="empty compact">Không có server phù hợp với bộ lọc.</div>}
      </>}
      {error && <div className="notice danger">⚠️ {error}</div>}
    </>}

    {pending && <div className="modalBackdrop"><div className="modal"><div className="modalIcon">✨</div><h2>Có phải username của bạn?</h2><div className="confirmUser">{pending.avatar ? <img className="confirmAvatar" src={pending.avatar} /> : <div className="avatarCircle">{pending.name[0]}</div>}<div><b>{pending.displayName}</b><div className="small">@{pending.name} · ID {pending.id}</div></div></div><p>Avatar và username được lấy từ dữ liệu công khai của Roblox. Không cần mật khẩu hoặc cookie.</p><div className="modalActions"><button className="btn secondary" onClick={() => setPending(null)}>Không phải</button><button className="btn" onClick={confirm}>✓ Đúng, đó là tôi</button></div></div></div>}
    {target && <div className="modalBackdrop"><div className="modal"><div className="modalIcon">🚀</div><h2>Chọn ứng dụng Roblox</h2><p>Mở <b>đúng server vừa chọn</b> bằng:</p><div className="appChoices"><button onClick={() => launch('vng')}><span>🇻🇳</span><div><b>Roblox VN</b><small>Roblox VNG</small></div></button><button onClick={() => launch('global')}><span>🌎</span><div><b>Roblox quốc tế</b><small>Roblox</small></div></button></div><button className="cancel" onClick={() => setTarget(null)}>Hủy</button></div></div>}
    <footer className="footer">RBLX Server Finder · Không phải sản phẩm chính thức của Roblox.</footer>
  </main>;
}
