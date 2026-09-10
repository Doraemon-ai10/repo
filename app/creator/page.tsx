'use client';

import { useState } from 'react';

const api = (body: any) => fetch('/api/creator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async r => ({ ok: r.ok, data: await r.json() }));

export default function CreatorPage() {
  const [mode, setMode] = useState<'creator'|'plus'>('creator');
  const [creatorUser, setCreatorUser] = useState('khoungbell7777');
  const [password, setPassword] = useState('');
  const [logged, setLogged] = useState(false);
  const [target, setTarget] = useState('');
  const [targetUser, setTargetUser] = useState<any>(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const notify = (x: string) => { setMessage(x); setTimeout(() => setMessage(''), 3500); };

  async function login() {
    setBusy(true);
    try {
      const r = await api({ action: 'creator-login', username: creatorUser, password });
      if (!r.data?.ok) return notify('Sai thông tin Creator.');
      sessionStorage.setItem('rblxf_creator_user', creatorUser);
      sessionStorage.setItem('rblxf_creator_pw', password);
      setLogged(true); notify('Đăng nhập Creator thành công.');
    } finally { setBusy(false); }
  }

  async function resolve() {
    if (!target.trim()) return notify('Nhập Roblox username.');
    setBusy(true);
    try {
      const r = await api({ action: 'resolve', username: target.trim() });
      if (!r.data?.ok) return notify('Không tìm thấy username Roblox.');
      setTargetUser(r.data.user);
      const s = await api({ action: 'status', userId: r.data.user.id });
      setStatus(s.data);
    } finally { setBusy(false); }
  }

  async function grant() {
    if (!targetUser) return;
    setBusy(true);
    try {
      const r = await api({ action: 'grant', creatorUsername: creatorUser, password, username: targetUser.name, note: 'RBLXFinder Plus donation' });
      if (!r.data?.ok) return notify('Không cấp Plus được.');
      notify(`Đã cấp Plus cho ${targetUser.name}.`);
      const s = await api({ action: 'status', userId: targetUser.id }); setStatus(s.data);
    } finally { setBusy(false); }
  }

  async function startVerification() {
    if (!targetUser) return;
    setBusy(true);
    try {
      const r = await api({ action: 'start-verification', userId: targetUser.id });
      if (!r.data?.ok) return notify('Tài khoản này chưa được Creator cấp Plus.');
      setCode(r.data.code); notify('Đã tạo mã xác minh.');
    } finally { setBusy(false); }
  }

  async function verify() {
    if (!targetUser || !code) return notify('Chưa có mã xác minh.');
    setBusy(true);
    try {
      const r = await api({ action: 'verify', userId: targetUser.id, code });
      if (!r.data?.ok) return notify(r.data?.error === 'code_not_in_profile' ? 'Chưa thấy mã trong mô tả profile Roblox.' : 'Mã không đúng.');
      notify('✓ Xác minh thành công — Plus đã được kích hoạt.');
      const s = await api({ action: 'status', userId: targetUser.id }); setStatus(s.data);
    } finally { setBusy(false); }
  }

  const styles = `*{box-sizing:border-box}body{margin:0}main{min-height:100vh;padding:24px;background:radial-gradient(circle at 10% 10%,#e9e5ff,transparent 35%),#f7f8fc;color:#171827;font-family:Inter,system-ui,sans-serif}.wrap{max-width:900px;margin:auto}.top{display:flex;justify-content:space-between;align-items:center;gap:15px;flex-wrap:wrap}.brand{font-size:28px;font-weight:950}.muted{color:#73778a}.tabs{display:flex;gap:8px;margin:22px 0;flex-wrap:wrap}.btn{border:1px solid #ddddea;background:#fff;border-radius:12px;padding:11px 15px;font-weight:900;cursor:pointer}.btn.primary{background:linear-gradient(135deg,#6252d8,#9b70ff);color:#fff;border:0}.card{background:#fff;border:1px solid #e7e7ef;border-radius:22px;padding:22px;margin-bottom:15px;box-shadow:0 15px 50px #302a7b12}.input{width:100%;padding:13px;border:1px solid #ddddea;border-radius:12px;margin:7px 0 13px;font:inherit}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.profile{display:flex;gap:14px;align-items:center;background:#faf9ff;border-radius:16px;padding:14px}.avatar{width:64px;height:64px;border-radius:16px;background:#eee;object-fit:cover}.code{font-size:28px;letter-spacing:3px;font-weight:950;background:#f2efff;color:#5e4fd1;border-radius:15px;padding:18px;text-align:center;margin:15px 0}.ok{padding:12px;border-radius:12px;background:#eafaf0;color:#16763c;font-weight:800}.warn{padding:12px;border-radius:12px;background:#fff7e6;color:#895c00;font-weight:700}.msg{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#171827;color:white;padding:12px 18px;border-radius:999px;font-weight:800}@media(max-width:650px){main{padding:14px}.grid{grid-template-columns:1fr}}`;

  if (!logged && mode === 'creator') return <main><style>{styles}</style><div className="wrap"><div className="top"><div><div className="brand">👑 RBLXFinder Creator</div><div className="muted">Creator-only dashboard</div></div><button className="btn" onClick={() => setMode('plus')}>Verify Plus →</button></div><section className="card" style={{marginTop:22}}><h2>Creator Login</h2><p className="muted">Chỉ tài khoản Creator <b>khoungbell7777</b> dùng khu vực này.</p><label>Username<input className="input" value={creatorUser} onChange={e=>setCreatorUser(e.target.value)} /></label><label>Mật khẩu Creator<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><button className="btn primary" disabled={busy} onClick={login}>{busy?'Đang kiểm tra...':'Đăng nhập Creator'}</button></section></div>{message&&<div className="msg">{message}</div>}</main>;

  if (mode === 'plus' && !logged) return <main><style>{styles}</style><div className="wrap"><div className="top"><div><div className="brand">👑 RBLXFinder Plus</div><div className="muted">Donate → cấp Plus → xác minh quyền sở hữu Roblox</div></div><button className="btn" onClick={() => setMode('creator')}>Creator Login</button></div><section className="card" style={{marginTop:22}}><h2>1. Tìm tài khoản</h2><p className="muted">Nhập username Roblox đã được Creator cấp Plus.</p><input className="input" value={target} onChange={e=>setTarget(e.target.value)} placeholder="Roblox username"/><button className="btn primary" disabled={busy} onClick={resolve}>Tìm tài khoản</button></section>{targetUser&&<section className="card"><div className="profile"><div className="avatar"/><div><b>{targetUser.name}</b><div className="muted">User ID: {targetUser.id}</div></div></div><hr/><h3>2. Tạo mã xác minh</h3><p>Dán mã vào <b>mô tả profile Roblox</b> rồi bấm xác minh.</p><button className="btn primary" disabled={busy} onClick={startVerification}>Tạo mã</button>{code&&<><div className="code">{code}</div><p className="muted">Sau khi dán mã vào profile, quay lại đây và bấm Verify.</p><button className="btn primary" disabled={busy} onClick={verify}>✓ Xác minh Plus</button></>}{status?.plus&&<div className={status.verified?'ok':'warn'} style={{marginTop:14}}>{status.verified?'✓ Tài khoản đã Verify và có Plus.':'✓ Đã được cấp Plus — chưa Verify profile.'}</div>}</section>}{message&&<div className="msg">{message}</div>}</div></main>;

  return <main><style>{styles}</style><div className="wrap"><div className="top"><div><div className="brand">👑 Creator Dashboard</div><div className="muted">Cấp Plus cho người đã donate</div></div><button className="btn" onClick={()=>{setLogged(false);setPassword('');sessionStorage.removeItem('rblxf_creator_pw')}}>Đăng xuất</button></div><section className="card" style={{marginTop:22}}><h2>Cấp RBLXFinder Plus</h2><p className="muted">Bạn xác nhận donation trước, sau đó người nhận phải Verify bằng mô tả profile Roblox.</p><div className="grid"><div><label>Roblox username<input className="input" value={target} onChange={e=>setTarget(e.target.value)} placeholder="username người donate"/></label><button className="btn" onClick={resolve}>Kiểm tra username</button></div><div><label>Ghi chú<input className="input" placeholder="Ví dụ: donate 50 Robux" /></label></div></div>{targetUser&&<div className="profile"><div className="avatar"/><div><b>{targetUser.name}</b><div className="muted">User ID: {targetUser.id}</div></div></div>}<button className="btn primary" disabled={!targetUser||busy} onClick={grant} style={{marginTop:14}}>👑 Cấp Plus</button></section><section className="card"><h3>Quy trình</h3><ol><li>Người dùng donate cho Creator.</li><li>Creator tìm username và bấm Cấp Plus.</li><li>Người dùng tạo mã xác minh.</li><li>Người dùng dán mã vào Roblox Profile Description.</li><li>RBLXFinder đọc mô tả public và xác minh User ID.</li></ol><p className="muted">Không yêu cầu mật khẩu hoặc cookie Roblox của người dùng.</p></section></div>{message&&<div className="msg">{message}</div>}</main>;
}
