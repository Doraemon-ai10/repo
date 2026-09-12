'use client';

import { useState } from 'react';

type RobloxUser = {
  id: number;
  name: string;
  displayName?: string;
};

type LeaderboardRow = {
  roblox_user_id: number;
  roblox_username: string;
  total_robux: number;
  donation_count: number;
};

async function creatorApi(body: Record<string, unknown>) {
  const response = await fetch('/api/creator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
}

export default function CreatorPage() {
  const [password, setPassword] = useState('');
  const [logged, setLogged] = useState(false);
  const [target, setTarget] = useState('');
  const [user, setUser] = useState<RobloxUser | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [board, setBoard] = useState<LeaderboardRow[]>([]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  }

  async function loadBoard() {
    try {
      const response = await fetch('/api/creator?action=leaderboard', { cache: 'no-store' });
      const data = await response.json();
      setBoard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
    } catch {
      setBoard([]);
    }
  }

  async function login() {
    if (!password) return notify('Nhập mật khẩu Creator.');
    setBusy(true);
    try {
      const result = await creatorApi({
        action: 'creator-login',
        username: 'khoungbell7777',
        password,
      });
      if (!result.data?.ok) return notify('Sai mật khẩu Creator.');
      setLogged(true);
      await loadBoard();
      notify('✓ Creator đăng nhập thành công.');
    } finally {
      setBusy(false);
    }
  }

  async function resolveUser() {
    const username = target.trim();
    if (!username) return notify('Nhập username Roblox.');
    setBusy(true);
    try {
      const result = await creatorApi({ action: 'resolve', username });
      if (!result.data?.ok) {
        setUser(null);
        return notify('Không tìm thấy username Roblox.');
      }
      setUser(result.data.user as RobloxUser);
    } finally {
      setBusy(false);
    }
  }

  async function recordDonation() {
    if (!user) return;
    const robux = Number(amount);
    if (!Number.isInteger(robux) || robux <= 0) {
      return notify('Nhập số Robux donate hợp lệ.');
    }

    setBusy(true);
    try {
      const result = await creatorApi({
        action: 'record-donation',
        userId: user.id,
        username: user.name,
        amount: robux,
        note,
        password,
      });
      if (!result.data?.ok) {
        return notify(result.data?.error || 'Không ghi nhận donation.');
      }
      setAmount('');
      setNote('');
      await loadBoard();
      notify(`✓ Đã xác nhận donation ${robux} Robux của ${user.name}.`);
    } finally {
      setBusy(false);
    }
  }

  async function grantPlus() {
    if (!user) return;
    setBusy(true);
    try {
      const result = await creatorApi({
        action: 'grant',
        username: user.name,
        password,
      });
      if (!result.data?.ok) {
        const text =
          result.data?.error === 'donation_required'
            ? 'Chưa có donation được Creator xác nhận.'
            : result.data?.error || 'Không cấp Plus được.';
        return notify(text);
      }
      await loadBoard();
      notify(`✓ Đã cấp Plus cho ${user.name} (${result.data.donatedRobux || 0} Robux donate).`);
    } finally {
      setBusy(false);
    }
  }

  const css = `
    * { box-sizing: border-box; }
    body { margin: 0; }
    main {
      min-height: 100vh;
      padding: 22px;
      background: radial-gradient(circle at 10% 0, #e8e4ff, transparent 35%), #f7f8fc;
      color: #151622;
      font-family: Inter, system-ui, sans-serif;
    }
    .wrap { max-width: 920px; margin: 0 auto; }
    .top { display: flex; justify-content: space-between; gap: 14px; align-items: center; flex-wrap: wrap; }
    .brand { font-size: 27px; font-weight: 950; }
    .muted { color: #717589; }
    .card {
      background: #fff;
      border: 1px solid #e7e7ef;
      border-radius: 22px;
      padding: 22px;
      margin-top: 16px;
      box-shadow: 0 15px 50px #22205a12;
    }
    .input {
      width: 100%;
      padding: 13px;
      border: 1px solid #d9d9e5;
      border-radius: 12px;
      margin: 7px 0 12px;
      font: inherit;
    }
    .btn {
      border: 0;
      border-radius: 12px;
      padding: 12px 16px;
      font-weight: 900;
      cursor: pointer;
      background: #181827;
      color: #fff;
    }
    .btn:disabled { opacity: .6; cursor: not-allowed; }
    .primary { background: linear-gradient(135deg, #5b4bd6, #9b6cff); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .profile { background: #faf9ff; border-radius: 15px; padding: 14px; margin-top: 14px; }
    .rank { display: flex; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid #eee; }
    .msg {
      position: fixed;
      z-index: 20;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #171722;
      color: #fff;
      padding: 12px 18px;
      border-radius: 999px;
      font-weight: 800;
      max-width: calc(100vw - 28px);
      text-align: center;
    }
    @media (max-width: 650px) {
      main { padding: 14px; }
      .grid { grid-template-columns: 1fr; }
      .card { padding: 17px; border-radius: 18px; }
    }
  `;

  if (!logged) {
    return (
      <main>
        <style>{css}</style>
        <div className="wrap">
          <div className="brand">RBLXFinder Creator</div>
          <div className="muted">Creator-only control center</div>
          <section className="card">
            <h2>Creator Login</h2>
            <p className="muted">
              Creator: <b>khoungbell7777</b>
            </p>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mật khẩu Creator"
              autoComplete="current-password"
            />
            <button className="btn primary" disabled={busy} onClick={login}>
              {busy ? 'Đang kiểm tra...' : 'Đăng nhập'}
            </button>
          </section>
        </div>
        {message && <div className="msg">{message}</div>}
      </main>
    );
  }

  return (
    <main>
      <style>{css}</style>
      <div className="wrap">
        <div className="top">
          <div>
            <div className="brand">Creator Dashboard</div>
            <div className="muted">Donation → Plus management</div>
          </div>
          <button
            className="btn"
            onClick={() => {
              setLogged(false);
              setPassword('');
              setUser(null);
            }}
          >
            Đăng xuất
          </button>
        </div>

        <section className="card">
          <h2>💎 Xác nhận donation &amp; cấp Plus</h2>
          <p className="muted">
            Người dùng phải donate Robux cho <b>khoungbell7777</b>. Creator xác nhận số Robux đã nhận,
            sau đó mới cấp Plus. Không dùng ownership verification bằng Description.
          </p>
          <input
            className="input"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="Roblox username đã donate"
            autoComplete="off"
          />
          <button className="btn" disabled={busy} onClick={resolveUser}>
            {busy ? 'Đang tìm...' : 'Tìm tài khoản'}
          </button>

          {user && (
            <div className="profile">
              <b>{user.name}</b>
              {user.displayName && user.displayName !== user.name && (
                <div className="muted">Display Name: {user.displayName}</div>
              )}
              <div className="muted">User ID: {user.id}</div>
              <input
                className="input"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Số Robux đã donate"
                inputMode="numeric"
              />
              <input
                className="input"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ghi chú (không bắt buộc)"
              />
              <button className="btn" disabled={busy} onClick={recordDonation}>
                ✓ Xác nhận donation
              </button>
              <button
                className="btn primary"
                disabled={busy}
                onClick={grantPlus}
                style={{ marginLeft: 8 }}
              >
                ⭐ Cấp Plus
              </button>
            </div>
          )}
        </section>

        <section className="card">
          <h2>🏆 Bảng xếp hạng Donate</h2>
          {board.length ? (
            board.map((row, index) => (
              <div className="rank" key={row.roblox_user_id}>
                <span>
                  <b>#{index + 1}</b> &nbsp;{row.roblox_username}
                </span>
                <b>{row.total_robux} Robux</b>
              </div>
            ))
          ) : (
            <p className="muted">Chưa có donation.</p>
          )}
        </section>
      </div>
      {message && <div className="msg">{message}</div>}
    </main>
  );
}
