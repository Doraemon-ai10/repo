'use client';

import { FormEvent, useEffect, useState } from 'react';

type Access = 'private' | 'friends' | 'public';
type SavedServer = {
  id: string;
  name: string;
  access: Access;
  gameName: string;
  placeId?: number;
  createdAt: number;
};

const KEY = 'rblxfinder_saved_private_servers_v1';
const labels: Record<Access, string> = {
  private: '🔒 Chỉ mình',
  friends: '👥 Bạn bè',
  public: '🌎 Có link',
};

export default function PrivateServersPage() {
  const [servers, setServers] = useState<SavedServer[]>([]);
  const [name, setName] = useState('');
  const [gameName, setGameName] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [access, setAccess] = useState<Access>('friends');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setServers(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: SavedServer[]) => {
    setServers(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  function create(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setNotice('Hãy nhập tên SVV.');
    const server: SavedServer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      access,
      gameName: gameName.trim() || 'Roblox Experience',
      placeId: Number(placeId) || undefined,
      createdAt: Date.now(),
    };
    persist([server, ...servers]);
    setName('');
    setNotice(`✓ Đã tạo và lưu “${server.name}”.`);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function remove(id: string) {
    persist(servers.filter((s) => s.id !== id));
  }

  function enter(server: SavedServer) {
    if (server.placeId) {
      window.location.href = `https://www.roblox.com/games/start?placeId=${server.placeId}`;
      return;
    }
    setNotice(`SVV “${server.name}” đã được lưu. Để vào một Private Server Roblox thật, cần privateServerId hợp lệ từ Roblox.`);
  }

  return (
    <main className="site" style={{ minHeight: '100vh' }}>
      <header className="top"><div className="nav">
        <a className="brand" href="/"><span className="logo">R</span><span><b>RBLXFinder</b><small>PRIVATE SERVERS</small></span></a>
        <div className="online"><i />Online</div>
      </div></header>

      <section className="page" style={{ maxWidth: 1100 }}>
        <div className="pagehead">
          <span className="badge">🛡️ PRIVATE SERVERS</span>
          <h2>SVV của bạn.</h2>
          <p>Tạo tên, chọn quyền truy cập và lưu lại. F5/reset trang vẫn giữ danh sách trên thiết bị này.</p>
        </div>

        <form className="panel" onSubmit={create} style={{ padding: 24, marginBottom: 24 }}>
          <span className="eyebrow">TẠO SVV</span>
          <h3 style={{ margin: '6px 0 18px', fontSize: 24 }}>Tạo Private Server</h3>
          <div className="search" style={{ marginBottom: 12 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên SVV, ví dụ: Noobie's Server" />
          </div>
          <div className="search" style={{ marginBottom: 12 }}>
            <input value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="Tên game Roblox (tuỳ chọn)" />
          </div>
          <div className="search" style={{ marginBottom: 12 }}>
            <input inputMode="numeric" value={placeId} onChange={(e) => setPlaceId(e.target.value)} placeholder="Place ID Roblox (tuỳ chọn)" />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {(['private', 'friends', 'public'] as Access[]).map((x) => (
              <button type="button" key={x} className={access === x ? 'btn primary' : 'btn ghost'} onClick={() => setAccess(x)}>{labels[x]}</button>
            ))}
          </div>
          <button className="btn primary" type="submit">🚀 Tạo SVV</button>
          {notice && <div className="error" style={{ marginTop: 14 }}>ℹ️ {notice}</div>}
        </form>

        <div className="pagehead" style={{ marginTop: 30 }}>
          <span className="eyebrow">ĐÃ LƯU</span>
          <h2>SVV có thể truy cập</h2>
        </div>

        {!servers.length ? <div className="empty">🛡️<h3>Chưa có SVV</h3><p>Tạo SVV đầu tiên ở phía trên.</p></div> : (
          <div style={{ display: 'grid', gap: 14 }}>
            {servers.map((server) => <article className="server panel" key={server.id} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div className="rank">🛡️</div>
              <div className="serverinfo" style={{ flex: 1, minWidth: 220 }}>
                <b>{server.name}</b>
                <small>{server.gameName} · {labels[server.access]}</small>
                <small style={{ color: '#16a34a' }}>🟢 Đã lưu trên thiết bị</small>
              </div>
              <button className="btn primary" onClick={() => enter(server)}>Vào SVV →</button>
              <button className="btn ghost" onClick={() => remove(server.id)}>Xoá</button>
            </article>)}
          </div>
        )}
      </section>
    </main>
  );
}
