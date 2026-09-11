'use client';

import { useEffect, useState } from 'react';

const SB = 'https://mbsnpcdmenfufhbctoek.supabase.co';
const KEY = 'sb_publishable_rwwoH9hpk6cg3woGveNObw_C00pNZsx';
const SESSION = 'rblxfinder_auth_session';

function session() {
  try { return JSON.parse(localStorage.getItem(SESSION) || 'null'); } catch { return null; }
}
function collect() {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || k === SESSION || k.startsWith('rblxfinder_auth_')) continue;
    const raw = localStorage.getItem(k);
    try { data[k] = JSON.parse(raw || 'null'); } catch { data[k] = raw; }
  }
  return data;
}
function restore(data: Record<string, unknown> | null | undefined) {
  if (!data) return;
  Object.entries(data).forEach(([k, v]) => {
    try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch {}
  });
}

export default function CloudAccount() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => { setCurrent(session()); }, []);

  const headers = (token?: string) => ({
    apikey: KEY,
    Authorization: `Bearer ${token || KEY}`,
    'Content-Type': 'application/json',
  });

  const pull = async (s: any) => {
    if (!s?.access_token || !s?.user?.id) return false;
    const r = await fetch(`${SB}/rest/v1/rblxfinder_user_data?select=data&user_id=eq.${encodeURIComponent(s.user.id)}`, { headers: headers(s.access_token) });
    if (!r.ok) return false;
    const rows = await r.json();
    if (rows[0]?.data) restore(rows[0].data);
    return true;
  };

  const push = async (s: any) => {
    if (!s?.access_token || !s?.user?.id) return false;
    const r = await fetch(`${SB}/rest/v1/rblxfinder_user_data?on_conflict=user_id`, {
      method: 'POST',
      headers: { ...headers(s.access_token), Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: s.user.id, data: collect(), updated_at: new Date().toISOString() }),
    });
    return r.ok;
  };

  const auth = async (type: 'login' | 'signup') => {
    if (!email.trim() || !password) return setStatus('Nhập email và mật khẩu.');
    setStatus('Đang xử lý...');
    try {
      const r = await fetch(`${SB}/auth/v1/${type === 'login' ? 'token?grant_type=password' : 'signup'}`, {
        method: 'POST', headers: headers(), body: JSON.stringify({ email: email.trim(), password }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error_description || d.msg || 'Đăng nhập thất bại');
      if (!d.access_token) return setStatus('Tài khoản đã tạo. Nếu Supabase yêu cầu xác nhận email, hãy xác nhận rồi đăng nhập.');
      localStorage.setItem(SESSION, JSON.stringify(d));
      setCurrent(d);
      await pull(d);
      await push(d);
      setStatus('☁️ Đã đăng nhập và đồng bộ dữ liệu.');
      setTimeout(() => location.reload(), 500);
    } catch (e: any) { setStatus(e?.message || 'Không thể kết nối tài khoản.'); }
  };

  const sync = async () => {
    const s = session();
    if (!s) return setStatus('Bạn chưa đăng nhập.');
    setStatus('☁️ Đang đồng bộ...');
    const ok = await push(s);
    setStatus(ok ? '☁️ Đã lưu dữ liệu lên Supabase.' : '⚠️ Đồng bộ thất bại.');
  };

  const restoreCloud = async () => {
    const s = session();
    if (!s) return setStatus('Bạn chưa đăng nhập.');
    setStatus('☁️ Đang tải dữ liệu...');
    const ok = await pull(s);
    setStatus(ok ? '☁️ Đã tải dữ liệu từ cloud.' : '⚠️ Chưa có dữ liệu cloud.');
    if (ok) setTimeout(() => location.reload(), 500);
  };

  const logout = () => { localStorage.removeItem(SESSION); setCurrent(null); setStatus('Đã đăng xuất.'); };

  return <>
    <button aria-label="Tài khoản cloud" onClick={() => setOpen(true)} style={{ position:'fixed', right:18, bottom:84, zIndex:9998, width:54, height:54, border:0, borderRadius:18, background:'linear-gradient(135deg,#0878ff,#16c9ff)', color:'#fff', fontSize:22, boxShadow:'0 14px 35px #0066ff35', cursor:'pointer' }}>
      {current ? '☁️' : '👤'}
    </button>
    {open && <div onClick={e => { if (e.currentTarget === e.target) setOpen(false); }} style={{ position:'fixed', inset:0, zIndex:9999, background:'#020711aa', display:'grid', placeItems:'center', padding:18 }}>
      <section style={{ width:'min(520px,100%)', maxHeight:'90vh', overflow:'auto', background:'var(--background,#fff)', color:'var(--foreground,#111827)', borderRadius:26, padding:24, boxShadow:'0 30px 90px #0008' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}><div><h2 style={{ margin:0 }}>☁️ RBLXFinder Cloud</h2><p style={{ margin:'6px 0 0', opacity:.65 }}>Web + APK dùng chung dữ liệu Supabase.</p></div><button onClick={() => setOpen(false)} style={{ border:0, borderRadius:12, padding:10, cursor:'pointer' }}>✕</button></div>
        {current ? <>
          <div style={{ marginTop:18, padding:15, borderRadius:16, background:'#eef6ff' }}><b>{current.user?.email || 'Tài khoản'}</b><div style={{ marginTop:4, opacity:.65, fontSize:13 }}>Đăng nhập bằng cùng tài khoản trên APK để lấy dữ liệu.</div></div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:9, marginTop:14 }}><button onClick={sync} style={{ border:0, borderRadius:13, padding:'12px 15px', background:'#0878ff', color:'#fff', fontWeight:800, cursor:'pointer' }}>☁️ Đồng bộ</button><button onClick={restoreCloud} style={{ border:'1px solid #ccd7e5', borderRadius:13, padding:'12px 15px', background:'#fff', fontWeight:800, cursor:'pointer' }}>↙ Tải cloud</button><button onClick={logout} style={{ border:'1px solid #f0b8c0', borderRadius:13, padding:'12px 15px', background:'#fff', color:'#b42336', fontWeight:800, cursor:'pointer' }}>Đăng xuất</button></div>
        </> : <>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" style={{ width:'100%', boxSizing:'border-box', marginTop:18, padding:14, borderRadius:14, border:'1px solid #ccd7e5' }} />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Mật khẩu" style={{ width:'100%', boxSizing:'border-box', marginTop:10, padding:14, borderRadius:14, border:'1px solid #ccd7e5' }} />
          <div style={{ display:'flex', gap:9, marginTop:12 }}><button onClick={()=>auth('login')} style={{ flex:1, border:0, borderRadius:13, padding:13, background:'#0878ff', color:'#fff', fontWeight:900, cursor:'pointer' }}>Đăng nhập</button><button onClick={()=>auth('signup')} style={{ flex:1, border:'1px solid #ccd7e5', borderRadius:13, padding:13, background:'#fff', fontWeight:900, cursor:'pointer' }}>Đăng ký</button></div>
        </>}
        {status && <p style={{ margin:'14px 0 0', fontWeight:800 }}>{status}</p>}
      </section>
    </div>}
  </>;
}
