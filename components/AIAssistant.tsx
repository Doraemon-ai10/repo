'use client';

import { useState } from 'react';

type Props = { game: 'roblox' | 'freefire' };

export default function AIAssistant({ game }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{role:'user'|'ai';text:string}[]>([]);

  const title = game === 'roblox' ? 'Roblox AI Assistant' : 'Free Fire AI Assistant';
  const send = async () => {
    const text = q.trim();
    if (!text || busy) return;
    setQ('');
    setMessages(m => [...m, { role: 'user', text }]);
    setBusy(true);
    try {
      const r = await fetch('/api/assistant', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ game, message:text }) });
      const d = await r.json();
      setMessages(m => [...m, { role:'ai', text:d.answer || 'Mình chưa hiểu câu hỏi này.' }]);
    } catch {
      setMessages(m => [...m, { role:'ai', text:'Assistant đang gặp lỗi kết nối. Hãy thử lại.' }]);
    } finally { setBusy(false); }
  };

  return <>
    <button className="ai-fab" onClick={()=>setOpen(v=>!v)} aria-label={title}>AI</button>
    {open && <aside className="ai-panel">
      <div className="ai-head"><div><strong>{title}</strong><small>Free cho mọi người · {game === 'roblox' ? 'Roblox only' : 'Free Fire only'}</small></div><button onClick={()=>setOpen(false)}>×</button></div>
      <div className="ai-messages">
        {!messages.length && <div className="ai-welcome">Xin chào! Hỏi mình về {game === 'roblox' ? 'game, username, avatar, server hoặc RBLXFinder.' : 'sensitivity, DPI, HUD, nút bắn hoặc kéo tâm.'}</div>}
        {messages.map((m,i)=><div key={i} className={'ai-msg '+m.role}>{m.text}</div>)}
        {busy && <div className="ai-msg ai">Đang suy nghĩ…</div>}
      </div>
      <div className="ai-input"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Hỏi AI…"/><button onClick={send}>Gửi</button></div>
    </aside>}
  </>;
}
