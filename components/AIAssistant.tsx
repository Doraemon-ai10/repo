'use client';

import { useEffect, useMemo, useState } from 'react';

type Game = 'roblox' | 'freefire' | 'general';
type Message = { role: 'user' | 'ai'; text: string };
type Chat = { id: string; title: string; game: Game; messages: Message[]; updatedAt: string };

const STORE = 'rblxfinder_ai_chats';
const SESSION = 'rblx_session';

function fallback(game: Game, q: string) {
  const x = q.toLowerCase();
  if (game === 'general') {
    if (/plus/.test(x)) return 'RBLXFinder Plus là khu tính năng nâng cao cho Roblox, còn các công cụ Roblox cốt lõi vẫn có bản Free.';
    if (/creator|tích xanh|verify|xác minh/.test(x)) return 'Khu Creator dùng cho quản lý Creator, donation, cấp Plus và trạng thái xác minh theo quyền quản trị. Tích xanh nên chỉ được cấp bởi hệ thống Creator/Admin, không tự nhận.';
    if (/đồng bộ|sync|apk|app/.test(x)) return 'RBLXFinder hiện có đồng bộ cloud qua tài khoản Supabase cho dữ liệu người dùng đã được đưa vào snapshot. Bạn có thể đăng nhập trên Web và APK để tải/lưu dữ liệu.';
    if (/support|feedback|hỗ trợ/.test(x)) return 'Email hỗ trợ RBLXFinder: supportrobloxfinder@gmail.com.';
    return 'Mình là RBLXFinder AI. Bạn có thể hỏi về Roblox, Free Fire, Plus, Creator, tài khoản, đồng bộ Web ↔ APK, cộng đồng hoặc cách dùng từng tính năng.';
  }
  if (game === 'roblox') {
    if (/server|sv|ít người|low.?pop/.test(x)) return 'Vào Roblox → Game Search, chọn game rồi mở danh sách public server. RBLXFinder sắp xếp server ít người trước.';
    if (/username|user.?id|avatar|profile/.test(x)) return 'Nhập username Roblox để lấy User ID, Display Name, avatar và hồ sơ công khai. Không cần mật khẩu hay cookie.';
    if (/game|trò chơi/.test(x)) return 'Bạn có thể tìm game theo tên/từ khóa, xem thumbnail, người chơi, visits và mở danh sách server của game đó.';
    if (/plus/.test(x)) return 'Plus dành cho Roblox và mở thêm các công cụ nâng cao như lọc server, theo dõi/refresh và intelligence.';
    return 'Mình là RBLXFinder AI cho Roblox. Hỏi mình về username, game, server, Plus hoặc cách sử dụng web.';
  }
  if (/sensitivity|sens|độ nhạy|kéo tâm/.test(x)) return 'Vào Sensitivity Lab, chọn thiết bị rồi chỉnh General/Red Dot từng bước nhỏ và test trong Training.';
  if (/dpi/.test(x)) return 'Giữ DPI ổn định trước, sau đó tinh chỉnh sensitivity để cảm giác điều khiển nhất quán.';
  if (/hud|nút|fire button|nút bắn/.test(x)) return 'Đặt nút bắn ở vị trí ngón tay chạm tự nhiên, đủ lớn nhưng không che mục tiêu.';
  return 'Mình là RBLXFinder AI cho Free Fire. Bạn có thể hỏi về sensitivity, DPI, HUD, aim hoặc nút bắn.';
}

async function cloudSave(chats: Chat[]) {
  try {
    const token = localStorage.getItem(SESSION);
    if (!token) return;
    await fetch('/api/sync', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save', data: { aiChats: chats } }) });
  } catch {}
}

export default function AIAssistant({ game = 'general' }: { game?: Game }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [active, setActive] = useState('');
  const [showChats, setShowChats] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || '[]');
      if (Array.isArray(saved)) setChats(saved);
    } catch {}
  }, []);

  const activeChat = useMemo(() => chats.find(c => c.id === active) || chats[0], [chats, active]);
  const messages = activeChat?.messages || [];

  const persist = (next: Chat[]) => {
    setChats(next);
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {}
    void cloudSave(next);
  };

  const newChat = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const chat: Chat = { id, title: 'Cuộc trò chuyện mới', game, messages: [], updatedAt: new Date().toISOString() };
    const next = [chat, ...chats];
    setChats(next);
    setActive(id);
    setShowChats(false);
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {}
  };

  const send = async () => {
    const text = q.trim();
    if (!text || busy) return;
    let chat = activeChat;
    if (!chat) {
      const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      chat = { id, title: text.slice(0, 42), game, messages: [], updatedAt: new Date().toISOString() };
      setActive(id);
    }
    const userMsg: Message = { role: 'user', text };
    const seed = chats.some(c => c.id === chat!.id) ? chats : [chat!];
    const withUser = seed.map(c => c.id === chat!.id ? { ...c, title: c.messages.length ? c.title : text.slice(0, 42), messages: [...c.messages, userMsg], updatedAt: new Date().toISOString() } : c);
    setQ('');
    setBusy(true);
    try {
      const apiGame = game === 'freefire' ? 'freefire' : 'roblox';
      const r = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game: apiGame, message: text, context: 'RBLXFinder website feature assistant' }) });
      const d = await r.json().catch(() => ({}));
      const answer = r.ok && d?.answer ? d.answer : fallback(game, text);
      const next = withUser.map(c => c.id === chat!.id ? { ...c, messages: [...c.messages, { role: 'ai', text: answer }], updatedAt: new Date().toISOString() } : c);
      persist(next);
    } catch {
      const next = withUser.map(c => c.id === chat!.id ? { ...c, messages: [...c.messages, { role: 'ai', text: fallback(game, text) }], updatedAt: new Date().toISOString() } : c);
      persist(next);
    } finally { setBusy(false); }
  };

  const removeChat = (id: string) => {
    const next = chats.filter(c => c.id !== id);
    persist(next);
    if (active === id) setActive(next[0]?.id || '');
  };

  const fab = { position: 'fixed' as const, right: 20, bottom: 20, zIndex: 9998, width: 62, height: 62, border: '2px solid #fff', borderRadius: 20, padding: 0, background: 'linear-gradient(135deg,#0b1220,#2563eb,#16b8c9)', boxShadow: '0 14px 38px #17315d45', cursor: 'pointer', overflow: 'hidden' };

  return <>
    <button onClick={() => setOpen(v => !v)} aria-label="Mở RBLXFinder AI" style={fab}><img src="/rblxfinder-icon.webp" alt="RBLXFinder AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></button>
    {open && <aside style={{ position: 'fixed', right: 20, bottom: 92, zIndex: 9999, width: 'min(430px,calc(100vw - 24px))', height: 'min(650px,calc(100vh - 110px))', background: '#fff', border: '1px solid #dfe7f2', borderRadius: 24, boxShadow: '0 28px 90px #17315d35', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ padding: 14, display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid #e8edf4', background: '#f8fbff' }}>
        <img src="/rblxfinder-icon.webp" alt="" style={{ width: 42, height: 42, borderRadius: 13 }} />
        <div style={{ flex: 1 }}><b>RBLXFinder AI</b><small style={{ display: 'block', color: '#667085', marginTop: 2 }}>Hỏi về tính năng, Roblox, Free Fire, Plus, Creator, tài khoản…</small></div>
        <button onClick={newChat} style={{ border: 0, background: '#eaf2ff', color: '#1769ff', borderRadius: 10, padding: '8px 9px', fontWeight: 900 }}>＋</button>
        <button onClick={() => setOpen(false)} style={{ border: 0, background: 'transparent', fontSize: 25 }}>×</button>
      </header>
      <div style={{ display: 'flex', borderBottom: '1px solid #eef2f6', padding: 8, gap: 7 }}><button onClick={() => setShowChats(v => !v)} style={{ border: 0, background: showChats ? '#111827' : '#f2f5f9', color: showChats ? '#fff' : '#344054', borderRadius: 10, padding: '8px 10px', fontWeight: 850 }}>Lịch sử ({chats.length})</button><button onClick={newChat} style={{ border: 0, background: '#f2f5f9', color: '#344054', borderRadius: 10, padding: '8px 10px', fontWeight: 850 }}>Cuộc trò chuyện mới</button></div>
      {showChats && <div style={{ maxHeight: 180, overflowY: 'auto', padding: 8, background: '#fbfcfe' }}>{chats.map(c => <div key={c.id} style={{ display: 'flex', gap: 6, marginBottom: 6 }}><button onClick={() => { setActive(c.id); setShowChats(false); }} style={{ flex: 1, textAlign: 'left', border: 0, borderRadius: 10, padding: 9, background: c.id === active ? '#e8f1ff' : '#fff', fontWeight: 750 }}>{c.title}</button><button onClick={() => removeChat(c.id)} style={{ border: 0, background: '#fff1f3', color: '#b4233d', borderRadius: 10 }}>×</button></div>)}</div>}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {!messages.length && <div style={{ padding: 15, borderRadius: 15, background: '#f1f5f9', color: '#334155', lineHeight: 1.55 }}>Xin chào! Mình là RBLXFinder AI. Hỏi mình bất cứ điều gì về cách dùng web/app và các tính năng.</div>}
        {messages.map((m, i) => <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', padding: '10px 12px', borderRadius: 14, background: m.role === 'user' ? '#2563eb' : '#f1f5f9', color: m.role === 'user' ? '#fff' : '#1e293b', lineHeight: 1.5 }}>{m.text}</div>)}
        {busy && <div style={{ padding: '10px 12px', borderRadius: 14, background: '#f1f5f9' }}>Đang xử lý…</div>}
      </div>
      <div style={{ padding: 11, borderTop: '1px solid #eef0f4', display: 'flex', gap: 8 }}><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Hỏi RBLXFinder AI…" style={{ flex: 1, minWidth: 0, border: '1px solid #dbe1e8', borderRadius: 12, padding: '11px 12px', outline: 'none' }} /><button onClick={send} disabled={busy} style={{ border: 0, borderRadius: 12, padding: '0 15px', background: '#111827', color: '#fff', fontWeight: 850 }}>Gửi</button></div>
    </aside>}
  </>;
}
