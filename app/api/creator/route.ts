import { NextRequest, NextResponse } from 'next/server';

const SB = 'https://mbsnpcdmenfufhbctoek.supabase.co';
const KEY = 'sb_publishable_rwwoH9hpk6cg3woGveNObw_C00pNZsx';

async function rpc(name: string, body: Record<string, unknown>) {
  const r = await fetch(`${SB}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const text = await r.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { data = { error: text }; }
  if (!r.ok) throw new Error(data?.message || data?.error || `RPC ${r.status}`);
  return data;
}

async function roblox(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, cache: 'no-store', headers: { 'User-Agent': 'RBLXFinder-Plus/1.0', ...(init?.headers || {}) } });
  const text = await r.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { data = { message: text }; }
  if (!r.ok) throw new Error(data?.message || `Roblox ${r.status}`);
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body?.action || '');

    if (action === 'creator-login') {
      const username = String(body.username || '').trim();
      const password = String(body.password || '');
      if (!username || !password) return NextResponse.json({ ok: false, error: 'missing_credentials' }, { status: 400 });
      const result = await rpc('rblx_creator_login', { p_username: username, p_password: password });
      return NextResponse.json(result);
    }

    if (action === 'resolve') {
      const username = String(body.username || '').trim();
      if (!username) return NextResponse.json({ ok: false, error: 'missing_username' }, { status: 400 });
      const data = await roblox('https://users.roblox.com/v1/usernames/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
      });
      const u = data?.data?.[0];
      if (!u?.id) return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 });
      return NextResponse.json({ ok: true, user: u });
    }

    if (action === 'grant') {
      const creatorUsername = String(body.creatorUsername || '').trim();
      const password = String(body.password || '');
      const username = String(body.username || '').trim();
      if (!creatorUsername || !password || !username) return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
      const data = await roblox('https://users.roblox.com/v1/usernames/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
      });
      const u = data?.data?.[0];
      if (!u?.id) return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 });
      const result = await rpc('rblx_creator_grant', {
        p_username: creatorUsername,
        p_password: password,
        p_user_id: Number(u.id),
        p_note: String(body.note || '').slice(0, 300) || null,
      });
      return NextResponse.json({ ...result, user: u });
    }

    if (action === 'start-verification') {
      const userId = Number(body.userId);
      if (!Number.isInteger(userId) || userId <= 0) return NextResponse.json({ ok: false, error: 'invalid_user_id' }, { status: 400 });
      return NextResponse.json(await rpc('rblx_plus_start', { p_user_id: userId }));
    }

    if (action === 'verify') {
      const userId = Number(body.userId);
      const code = String(body.code || '').trim();
      if (!Number.isInteger(userId) || userId <= 0 || !code) return NextResponse.json({ ok: false, error: 'missing_verification' }, { status: 400 });
      const profile = await roblox(`https://users.roblox.com/v1/users/${userId}`);
      const description = String(profile?.description || '');
      if (!description.toUpperCase().includes(code.toUpperCase())) {
        return NextResponse.json({ ok: false, error: 'code_not_in_profile' });
      }
      return NextResponse.json(await rpc('rblx_plus_verify', { p_user_id: userId, p_code: code }));
    }

    if (action === 'status') {
      const userId = Number(body.userId);
      if (!Number.isInteger(userId) || userId <= 0) return NextResponse.json({ plus: false }, { status: 400 });
      return NextResponse.json(await rpc('rblx_plus_status', { p_user_id: userId }));
    }

    return NextResponse.json({ ok: false, error: 'unknown_action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'creator_api_failed' }, { status: 500 });
  }
}
