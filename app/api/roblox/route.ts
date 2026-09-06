import { NextRequest, NextResponse } from 'next/server';

const allowed = ['https://users.roblox.com', 'https://games.roblox.com', 'https://thumbnails.roblox.com'];

async function roblox(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, cache: 'no-store', headers: { 'User-Agent': 'RBLX-Server-Finder/4.0', ...(init?.headers || {}) } });
  const text = await r.text();
  let data: unknown = {};
  try { data = JSON.parse(text); } catch { data = { message: text || 'Roblox API returned an invalid response' }; }
  if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(data)}`);
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action;
    if (action === 'username') {
      const username = String(body.username || '').trim();
      if (!username || username.length > 20) return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
      const data = await roblox('https://users.roblox.com/v1/usernames/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
      });
      return NextResponse.json(data);
    }
    if (action === 'games') {
      const q = String(body.query || '').trim();
      if (!q) return NextResponse.json({ data: [] });
      const url = `https://games.roblox.com/v1/games/list?model.keyword=${encodeURIComponent(q)}&model.maxRows=30`;
      return NextResponse.json(await roblox(url));
    }
    if (action === 'details') {
      const id = Number(body.universeId);
      if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid universeId' }, { status: 400 });
      return NextResponse.json(await roblox(`https://games.roblox.com/v1/games?universeIds=${id}`));
    }
    if (action === 'private') {
      const id = Number(body.universeId);
      if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid universeId' }, { status: 400 });
      return NextResponse.json(await roblox(`https://games.roblox.com/v1/private-servers/enabled-in-universe/${id}`));
    }
    if (action === 'servers') {
      const placeId = Number(body.placeId);
      if (!Number.isInteger(placeId)) return NextResponse.json({ error: 'Invalid placeId' }, { status: 400 });
      return NextResponse.json(await roblox(`https://games.roblox.com/v1/games/${placeId}/servers/Public?sortOrder=2&excludeFullGames=true&limit=100`));
    }
    throw new Error('Unknown action');
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Roblox API request failed' }, { status: 502 });
  }
}
