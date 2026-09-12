import { NextRequest, NextResponse } from 'next/server';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

const out = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: cors });
const SB = process.env.SUPABASE_URL || 'https://mbsnpcdmenfufhbctoek.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_rwwoH9hpk5cg3woGveNObw_C00pNZsx';
const CREATOR = 'khoungbell7777';
const CREATOR_EMAIL = 'giakiet0903dz@gmail.com';

function bearer(req: NextRequest) {
  const value = req.headers.get('authorization') || '';
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

async function rpc(name: string, body: Record<string, unknown>, token?: string) {
  const auth = token || KEY;
  if (!KEY || !auth) throw new Error('supabase_key_missing');
  const response = await fetch(`${SB}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const text = await response.text();
  let data: any; try { data = JSON.parse(text); } catch { data = { error: text }; }
  if (!response.ok) throw new Error(data?.message || data?.hint || data?.error || `RPC ${response.status}`);
  return data;
}

async function roblox(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: 'no-store', headers: { 'User-Agent': 'RBLXFinder-Plus/3.2', Accept: 'application/json', ...(init?.headers || {}) } });
  const text = await response.text();
  let data: any; try { data = JSON.parse(text); } catch { data = { message: text }; }
  if (!response.ok) throw new Error(data?.message || `Roblox ${response.status}`);
  return data;
}

async function resolveRobloxUsername(username: string) {
  const clean = username.trim(); if (!clean) return null;
  const data = await roblox('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [clean], excludeBannedUsers: false }) });
  return data?.data?.[0] || null;
}

async function requireCreator(req: NextRequest) {
  const token = bearer(req);
  if (!token) return { ok: false as const, token: '' };
  const session = await rpc('rblx_creator_session', {}, token);
  return { ok: session?.ok === true, token, session };
}

export async function GET(req: NextRequest) {
  try {
    const action = new URL(req.url).searchParams.get('action');
    if (action === 'leaderboard') {
      const leaderboard = await rpc('rblx_creator_leaderboard', { p_limit: 100 });
      return out({ ok: true, leaderboard: Array.isArray(leaderboard) ? leaderboard : [] });
    }
    return out({ ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    return out({ ok: false, error: error instanceof Error ? error.message : 'creator_api_failed' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body?.action || '');

    if (action === 'creator-session') {
      try {
        const auth = await requireCreator(req);
        if (!auth.ok) return out({ ok: false, error: 'creator_access_denied' }, 403);
        return out({ ok: true, email: CREATOR_EMAIL, username: auth.session.username || CREATOR, user_id: auth.session.user_id ?? null });
      } catch {
        return out({ ok: false, error: 'creator_access_denied' }, 403);
      }
    }

    if (action === 'creator-login') {
      const password = String(body?.password || '');
      const username = String(body?.username || '').trim();
      if (username.toLowerCase() !== CREATOR.toLowerCase() || !password) return out({ ok: false, error: 'invalid_creator_credentials' }, 401);
      const result = await rpc('rblx_creator_login', { p_username: CREATOR, p_password: password });
      if (!result?.ok) return out({ ok: false, error: 'invalid_creator_credentials' }, 401);
      return out({ ok: true, username: CREATOR, user_id: result.user_id ?? null });
    }

    if (action === 'resolve') {
      const username = String(body?.username || '').trim();
      if (!username) return out({ ok: false, error: 'missing_username' }, 400);
      const user = await resolveRobloxUsername(username);
      if (!user?.id) return out({ ok: false, error: 'user_not_found' }, 404);
      return out({ ok: true, user });
    }

    if (action === 'record-donation-auth' || action === 'grant-auth') {
      let auth;
      try { auth = await requireCreator(req); } catch { return out({ ok: false, error: 'creator_access_denied' }, 403); }
      if (!auth.ok) return out({ ok: false, error: 'creator_access_denied' }, 403);

      if (action === 'record-donation-auth') {
        const userId = Number(body?.userId); const username = String(body?.username || '').trim(); const amount = Number(body?.amount);
        if (!Number.isInteger(userId) || userId <= 0 || !username || !Number.isInteger(amount) || amount <= 0) return out({ ok: false, error: 'invalid_donation' }, 400);
        const resolved = await resolveRobloxUsername(username);
        if (!resolved?.id || Number(resolved.id) !== userId) return out({ ok: false, error: 'roblox_identity_mismatch' }, 400);
        return out(await rpc('rblx_creator_record_donation_auth', { p_user_id: userId, p_roblox_username: resolved.name, p_amount: amount, p_note: String(body?.note || '').slice(0, 300) }, auth.token));
      }

      const username = String(body?.username || '').trim();
      if (!username) return out({ ok: false, error: 'missing_username' }, 400);
      const user = await resolveRobloxUsername(username);
      if (!user?.id) return out({ ok: false, error: 'user_not_found' }, 404);
      const result = await rpc('rblx_creator_grant_auth', { p_user_id: Number(user.id), p_note: String(body?.note || 'RBLXFinder Plus').slice(0, 300) }, auth.token);
      return out({ ...result, user });
    }

    if (action === 'record-donation' || action === 'grant') {
      const password = String(body?.password || '');
      if (!password) return out({ ok: false, error: 'creator_auth_required' }, 401);
      if (action === 'record-donation') {
        const userId = Number(body?.userId); const username = String(body?.username || '').trim(); const amount = Number(body?.amount);
        if (!Number.isInteger(userId) || userId <= 0 || !username || !Number.isInteger(amount) || amount <= 0) return out({ ok: false, error: 'invalid_donation' }, 400);
        const resolved = await resolveRobloxUsername(username); if (!resolved?.id || Number(resolved.id) !== userId) return out({ ok: false, error: 'roblox_identity_mismatch' }, 400);
        return out(await rpc('rblx_creator_record_donation', { p_username: CREATOR, p_password: password, p_user_id: userId, p_roblox_username: resolved.name, p_amount: amount, p_note: String(body?.note || '').slice(0, 300) }));
      }
      const username = String(body?.username || '').trim(); if (!username) return out({ ok: false, error: 'missing_username' }, 400);
      const user = await resolveRobloxUsername(username); if (!user?.id) return out({ ok: false, error: 'user_not_found' }, 404);
      const result = await rpc('rblx_creator_grant', { p_username: CREATOR, p_password: password, p_user_id: Number(user.id), p_note: String(body?.note || 'RBLXFinder Plus').slice(0, 300) });
      return out({ ...result, user });
    }

    if (action === 'status') {
      const userId = Number(body?.userId); if (!Number.isInteger(userId) || userId <= 0) return out({ ok: false, plus: false }, 400);
      return out(await rpc('rblx_plus_status', { p_user_id: userId }));
    }

    return out({ ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    return out({ ok: false, error: error instanceof Error ? error.message : 'creator_api_failed' }, 500);
  }
}
