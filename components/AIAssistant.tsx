'use client';

import { useState } from 'react';

type Props = { game: 'roblox' | 'freefire' };

type Message = { role: 'user' | 'ai'; text: string };

function localFallback(game: Props['game'], q: string) {
  const x = q.toLowerCase();
  if (game === 'roblox') {
    if (/server|sv|ít người|low.?pop/.test(x)) return 'Bạn có thể vào Server Finder, nhập Universe ID và tìm public server ít người. Bản Free vẫn có tìm server và lọc cơ bản.';
    if (/username|user.?id|avatar|profile/.test(x)) return 'Nhập username Roblox để tìm User ID, hồ sơ cơ bản và avatar công khai. Không cần mật khẩu hoặc cookie.';
    if (/game|trò chơi/.test(x)) return 'Hãy nhập tên hoặc từ khóa game. RBLXFinder có thể tìm game và hiển thị thông tin cơ bản.';
    if (/plus/.test(x)) return 'Plus chỉ dành cho Roblox. Bản Free vẫn giữ các công cụ cốt lõi; Plus tập trung vào tính năng nâng cao.';
    return 'Mình là Roblox AI Assistant. Bạn có thể hỏi về username, avatar, game, server hoặc RBLXFinder.';
  }
  if (/sensitivity|sens|độ nhạy|kéo tâm/.test(x)) return 'Vào Sensitivity Lab, chọn đúng thiết bị rồi test. Tăng/giảm General và Red Dot từng bước nhỏ để tìm mức phù hợp.';
  if (/dpi/.test(x)) return 'Giữ DPI ổn định rồi chỉnh sensitivity từng bước để dễ kiểm soát cảm giác kéo tâm.';
  if (/hud|nút|fire button|nút bắn/.test(x)) return 'Đặt nút bắn ở vị trí ngón tay chạm tự nhiên, đủ lớn nhưng không che mục tiêu. Sau đó test vài trận.';
  if (/headshot|one.?tap|hs|bắn đầu/.test(x)) return 'Hãy luyện kéo tâm ngắn và đều, giữ FPS ổn định và tránh đổi sensitivity liên tục.';
  return 'Mình là Free Fire AI Assistant. Bạn có thể hỏi về sensitivity, DPI, HUD, nút bắn, kéo tâm hoặc Sensitivity Lab.';
}

export default function AIAssistant({ game }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const title = game === 'roblox' ? 'Roblox AI Assistant' : 'Free Fire AI Assistant';

  const send = async () => {
    const text = q.trim();
    if (!text || busy) return;
    setQ('');
    setMessages(m => [...m, { role: 'user', text }]);
    setBusy(true);
    try {
      const r = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ game, message: text }),
      });
      const contentType = r.headers.get('content-type') || '';
      const d = contentType.includes('application/json') ? await r.json() : null;
      if (!r.ok || !d?.answer) throw new Error('assistant_api');
      setMessages(m => [...m, { role: 'ai', text: d.answer }]);
    } catch {
      // Keep the assistant usable even if the Vercel serverless API is temporarily unavailable.
      setMessages(m => [...m, { role: 'ai', text: localFallback(game, text) }]);
    } finally {
      setBusy(false);
    }
  };

  const fab = {
    position: 'fixed' as const,
    right: 20,
    bottom: 20,
    zIndex: 9998,
    width: 58,
    height: 58,
    border: 0,
    borderRadius: 18,
    background: 'linear-gradient(135deg,#111827,#2563eb)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 15,
    boxShadow: '0 12px 35px #0003',
    cursor: 'pointer',
  };

  return (
    <>
      <button onClick={() => setOpen(v => !v)} aria-label={title} style={fab}>AI</button>
      {open && (
        <aside style={{ position: 'fixed', right: 20, bottom: 88, zIndex: 9999, width: 'min(390px,calc(100vw - 28px))', height: 'min(590px,calc(100vh - 115px))', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 22, boxShadow: '0 25px 70px #0003', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef0f4', background: '#f8fafc' }}>
            <div><strong style={{ display: 'block' }}>{title}</strong><small style={{ color: '#64748b' }}>Free cho mọi người · {game === 'roblox' ? 'Roblox' : 'Free Fire'}</small></div>
            <button onClick={() => setOpen(false)} aria-label="Đóng AI" style={{ border: 0, background: 'transparent', fontSize: 25, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {!messages.length && <div style={{ padding: 14, borderRadius: 15, background: '#f1f5f9', color: '#334155', lineHeight: 1.5 }}>Xin chào! Hỏi mình về {game === 'roblox' ? 'game, username, avatar, server hoặc RBLXFinder.' : 'sensitivity, DPI, HUD, nút bắn hoặc kéo tâm.'}</div>}
            {messages.map((m, i) => <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', padding: '10px 12px', borderRadius: 14, background: m.role === 'user' ? '#2563eb' : '#f1f5f9', color: m.role === 'user' ? '#fff' : '#1e293b', lineHeight: 1.45 }}>{m.text}</div>)}
            {busy && <div style={{ padding: '10px 12px', borderRadius: 14, background: '#f1f5f9' }}>Đang xử lý…</div>}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #eef0f4', display: 'flex', gap: 8 }}>
            <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Hỏi AI…" aria-label="Câu hỏi cho AI" style={{ flex: 1, minWidth: 0, border: '1px solid #dbe1e8', borderRadius: 12, padding: '11px 12px', outline: 'none' }} />
            <button onClick={send} disabled={busy} style={{ border: 0, borderRadius: 12, padding: '0 15px', background: '#111827', color: '#fff', fontWeight: 800, cursor: busy ? 'not-allowed' : 'pointer' }}>Gửi</button>
          </div>
        </aside>
      )}
    </>
  );
}
