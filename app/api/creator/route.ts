import { NextRequest, NextResponse } from 'next/server';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors });
}

const out = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: cors });

const SB = process.env.SUPABASE_URL || 'https://mbsnpcdmenfufhbctoek.supabase.co';
// Publishable/anon keys are safe for browser-facing requests. Prefer an environment variable,
// but keep a public fallback so the deployed site does not silently fail when the env var is absent.
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_rwwoH9hpk6cg3woGveNObw_C00pNZsx';
const CREATOR = 'khoungbell7777';

async function rpc(name: string, body: Record<string, unknown>) {
  if (!KEY) throw new Error('supabase_key_missing');
  const response = await fetch(`${SB}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }
  if (!response.ok) {
    throw new Error(data?.message || data?.hint || data?.error || `RPC ${response.status}`);
  }
  return data;
}

async function roblox(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      'User-Agent': 'RBLXFinder-Plus/3.1',
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  });
  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  if (!response.ok) throw new Error(data?.message || `Roblox ${response.status}`);
  return data;
}

async function resolveRobloxUsername(username: string) {
  const clean = username.trim();
  if (!clean) return null;
  const data = await roblox('https://users.roblox.com/v1/usernames/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernames: [clean], excludeBannedUsers: false }),
  });
  return data?.data?.[0] || null;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    if (action === 'leaderboard') {
      const leaderboard = await rpc('rblx_creator_leaderboard', { p_limit: 100 });
      return out({ ok: true, leaderboard: Array.isArray(leaderboard) ? leaderboard : [] });
    }
    return out({ ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    return out(
      { ok: false, error: error instanceof Error ? error.message : 'creator_api_failed' },
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body?.action || '');

    if (action === 'creator-login') {
      const password = String(body?.password || '');
      const username = String(body?.username || '').trim();
      if (username.toLowerCase() !== CREATOR.toLowerCase() || !password) {
        return out({ ok: false, error: 'invalid_creator_credentials' }, 401);
      }
      const result = await rpc('rblx_creator_login', {
        p_username: CREATOR,
        p_password: password,
      });
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

    if (action === 'record-donation') {
      const password = String(body?.password || '');
      const userId = Number(body?.userId);
      const suppliedUsername = String(body?.username || '').trim();
      const amount = Number(body?.amount);
      if (
        !password ||
        !Number.isInteger(userId) ||
        userId <= 0 ||
        !suppliedUsername ||
        !Number.isInteger(amount) ||
        amount <= 0
      ) {
        return out({ ok: false, error: 'invalid_donation' }, 400);
      }

      const resolved = await resolveRobloxUsername(suppliedUsername);
      if (!resolved?.id || Number(resolved.id) !== userId) {
        return out({ ok: false, error: 'roblox_identity_mismatch' }, 400);
      }

      return out(
        await rpc('rblx_creator_record_donation', {
          p_username: CREATOR,
          p_password: password,
          p_user_id: userId,
          p_roblox_username: resolved.name,
          p_amount: amount,
          p_note: String(body?.note || '').slice(0, 300),
        }),
      );
    }

    if (action === 'grant') {
      const password = String(body?.password || '');
      if (!password) return out({ ok: false, error: 'creator_auth_required' }, 401);
      const username = String(body?.username || '').trim();
      if (!username) return out({ ok: false, error: 'missing_username' }, 400);

      const user = await resolveRobloxUsername(username);
      if (!user?.id) return out({ ok: false, error: 'user_not_found' }, 404);

      const result = await rpc('rblx_creator_grant', {
        p_username: CREATOR,
        p_password: password,
        p_user_id: Number(user.id),
        p_note: String(body?.note || 'RBLXFinder Plus').slice(0, 300),
      });
      return out({ ...result, user });
    }

    if (action === 'status') {
      const userId = Number(body?.userId);
      if (!Number.isInteger(userId) || userId <= 0) return out({ ok: false, plus: false }, 400);
      return out(await rpc('rblx_plus_status', { p_user_id: userId }));
    }

    return out({ ok: false, error: 'unknown_action' }, 400);
  } catch (error) {
    return out(
      { ok: false, error: error instanceof Error ? error.message : 'creator_api_failed' },
      500,
    );
  }
}
