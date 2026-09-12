'use client';

import { useState } from 'react';

type RobloxUser = { id: number; name: string; displayName?: string };
type LeaderboardRow = { roblox_user_id: number; roblox_username: string; total_robux: number; donation_count: number };

const SB = 'https://mbsnpcdmenfufhbctoek.supabase.co';
const KEY = 'sb_publishable_rwwoH9hpk6cg3woGveNObw_C00pNZsx';
const CREATOR_EMAIL = 'giakiet0903dz@gmail.com';
const CREATOR = 'khoungbell7777';
const authHeaders = (token?: string) => ({ apikey: KEY, Authorization: `Bearer ${token || KEY}`, 'Content-Type': 'application/json' });

async function creatorApi(body: Record<string, unknown>, token?: string) {
  const response = await fetch('/api/creator', { method: 'POST', headers: { ...authHeaders(token) }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
}

async function authPassword(email: string, password: string, signup = false) {
  const response = await fetch(`${SB}/auth/v1/${signup ? 'signup' : 'token?grant_type=password'}`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error_description || data.msg || 'Không thể xác thực tài khoản.');
  return data;
}

export default function CreatorPage() {
  const [email, setEmail] = useState(CREATOR_EMAIL);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [logged, setLogged] = useState(false);
  const [target, setTarget] = useState('');
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [board, setBoard] = useState<LeaderboardRow[]>([]);

  const notify = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 3500); };
  const loadBoard = async () => { try { const r = await fetch('/api/creator?action=leaderboard', { cache: 'no-store' }); const d = await r.json(); setBoard(Array.isArray(d.leaderboard) ? d.leaderboard : []); } catch { setBoard([]); } };

  async function signInOrCreate(create: boolean) {
    if (email.trim().toLowerCase() !== CREATOR_EMAIL) return notify(`Creator chỉ dùng tài khoản ${CREATOR_EMAIL}.`);
    if (!password) return notify('Hãy tự tạo/nhập mật khẩu cho tài khoản Creator.');
    setBusy(true);
    try {
      const session = await authPassword(email.trim(), password, create);
      if (!session?.access_token) return notify(create ? 'Tài khoản đã tạo. Hãy xác nhận email nếu Supabase yêu cầu, rồi đăng nhập.' : 'Không nhận được phiên đăng nhập.');
      const checked = await creatorApi({ action: 'creator-session' }, session.access_token);
      if (!checked.data?.ok) return notify('Email này chưa được cấp quyền Creator.');
      setToken(session.access_token); setLogged(true); await loadBoard(); notify(create ? '✓ Tạo tài khoản Creator thành công.' : '✓ Creator đăng nhập thành công.');
    } catch (e: any) { notify(e?.message || 'Không thể đăng nhập.'); }
    finally { setBusy(false); }
  }

  async function resolveUser() {
    if (!target.trim()) return notify('Nhập username Roblox.');
    setBusy(true);
    try { const r = await creatorApi({ action: 'resolve', username: target.trim() }); if (!r.data?.ok) return notify('Không tìm thấy username Roblox.'); setUser(r.data.user); }
    finally { setBusy(false); }
  }

  async function recordDonation() {
    if (!user) return; const robux = Number(amount);
    if (!Number.isInteger(robux) || robux <= 0) return notify('Nhập số Robux donate hợp lệ.');
    setBusy(true);
    try { const r = await creatorApi({ action: 'record-donation-auth', userId: user.id, username: user.name, amount: robux, note }, token); if (!r.data?.ok) return notify(r.data?.error || 'Không ghi nhận donation.'); setAmount(''); setNote(''); await loadBoard(); notify(`✓ Đã xác nhận ${robux} Robux của ${user.name}.`); }
    finally { setBusy(false); }
  }

  async function grantPlus() {
    if (!user) return; setBusy(true);
    try { const r = await creatorApi({ action: 'grant-auth', username: user.name }, token); if (!r.data?.ok) return notify(r.data?.error === 'donation_required' ? 'Chưa có donation được Creator xác nhận.' : r.data?.error || 'Không cấp Plus được.'); await loadBoard(); notify(`✓ Đã cấp RBLXFinder Plus cho ${user.name}.`); }
    finally { setBusy(false); }
  }

  const css = `*{box-sizing:border-box}body{margin:0}main{min-height:100vh;padding:22px;background:radial-gradient(circle at 10% 0,#e8e4ff,transparent 35%),#f7f8fc;color:#151622;font-family:Inter,system-ui,sans-serif}.wrap{max-width:940px;margin:auto}.top{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}.brand{font-size:27px;font-weight:950}.muted{color:#717589}.card{background:#fff;border:1px solid #e7e7ef;border-radius:22px;padding:22px;margin-top:16px;box-shadow:0 15px 50px #22205a12}.input{width:100%;padding:13px;border:1px solid #d9d9e5;border-radius:12px;margin:7px 0 12px;font:inherit}.btn{border:0;border-radius:12px;padding:12px 16px;font-weight:900;cursor:pointer;background:#181827;color:#fff}.btn:disabled{opacity:.6;cursor:not-allowed}.primary{background:linear-gradient(135deg,#5b4bd6,#9b6cff)}.profile{background:#faf9ff;border-radius:15px;padding:14px;margin-top:14px}.rank{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #eee}.msg{position:fixed;z-index:20;bottom:20px;left:50%;transform:translateX(-50%);background:#171722;color:#fff;padding:12px 18px;border-radius:999px;font-weight:800;max-width:calc(100vw - 28px);text-align:center}@media(max-width:650px){main{padding:14px}.card{padding:17px;border-radius:18px}}`;

  if (!logged) return <main><style>{css}</style><div className="wrap"><div className="brand">👑 RBLXFinder Creator</div><div className="muted">Creator access is tied to your Noobie Google/email account.</div><section className="card"><h2>Creator Account</h2><p>Creator email: <b>{CREATOR_EMAIL}</b></p><p className="muted">Hãy dùng đúng email này. Bạn tự tạo mật khẩu khi đăng ký tài khoản; không cần biết mật khẩu Creator cũ.</p><input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email Creator"/><input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Mật khẩu bạn tự tạo" autoComplete="new-password"/><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button className="btn primary" disabled={busy} onClick={()=>signInOrCreate(false)}>Đăng nhập Creator</button><button className="btn" disabled={busy} onClick={()=>signInOrCreate(true)}>Tạo tài khoản Creator</button></div><p className="muted" style={{fontSize:13}}>Sau khi tài khoản {CREATOR_EMAIL} đăng nhập thành công, hệ thống tự nhận quyền Creator.</p></section></div>{message&&<div className="msg">{message}</div>}</main>;

  return <main><style>{css}</style><div className="wrap"><div className="top"><div><div className="brand">👑 Creator Dashboard</div><div className="muted">{CREATOR_EMAIL} · Donation → Plus management</div></div><button className="btn" onClick={()=>{setLogged(false);setToken('');setPassword('');setUser(null)}}>Đăng xuất</button></div><section className="card"><h2>💎 Xác nhận donation & cấp Plus</h2><p className="muted">Người dùng phải donate Robux cho <b>{CREATOR}</b>. Creator xác nhận số Robux đã nhận, sau đó mới cấp Plus.</p><input className="input" value={target} onChange={e=>setTarget(e.target.value)} placeholder="Roblox username đã donate"/><button className="btn" disabled={busy} onClick={resolveUser}>{busy?'Đang tìm...':'Tìm tài khoản'}</button>{user&&<div className="profile"><b>{user.name}</b>{user.displayName&&user.displayName!==user.name&&<div className="muted">Display Name: {user.displayName}</div>}<div className="muted">User ID: {user.id}</div><input className="input" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Số Robux đã donate" inputMode="numeric"/><input className="input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Ghi chú (không bắt buộc)"/><button className="btn" disabled={busy} onClick={recordDonation}>✓ Xác nhận donation</button><button className="btn primary" disabled={busy} onClick={grantPlus} style={{marginLeft:8}}>⭐ Cấp Plus</button></div>}</section><section className="card"><h2>🏆 Bảng xếp hạng Donate</h2>{board.length?board.map((row,i)=><div className="rank" key={row.roblox_user_id}><span><b>#{i+1}</b> &nbsp;{row.roblox_username}</span><b>{row.total_robux} Robux</b></div>):<p className="muted">Chưa có donation.</p>}</section></div>{message&&<div className="msg">{message}</div>}</main>;
}
