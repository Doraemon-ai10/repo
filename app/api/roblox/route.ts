import { NextRequest, NextResponse } from 'next/server';

async function roblox(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, cache: 'no-store', headers: { 'User-Agent': 'RBLX-Server-Finder/5.0', ...(init?.headers || {}) } });
  const text = await r.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { data = { message: text || 'Roblox API returned an invalid response' }; }
  if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(data)}`);
  return data;
}

function normalizeSearch(raw: any) {
  const out: any[] = [];
  const seen = new Set<number>();
  const walk = (v: any) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(walk); return; }
    const universeId = Number(v.universeId ?? v.universeID ?? v.id);
    const rootPlaceId = Number(v.rootPlaceId ?? v.placeId ?? v.rootPlaceID);
    const name = typeof v.name === 'string' ? v.name : '';
    if (Number.isInteger(universeId) && universeId > 0 && Number.isInteger(rootPlaceId) && rootPlaceId > 0 && name) {
      if (!seen.has(universeId)) {
        seen.add(universeId);
        out.push({ universeId, rootPlaceId, name, description: v.description, playing: Number(v.playing ?? v.playerCount ?? 0) || 0, visits: Number(v.visits ?? 0) || 0, maxPlayers: Number(v.maxPlayers ?? 0) || undefined, creator: v.creator ?? (v.creatorName ? { name: v.creatorName } : undefined) });
      }
    }
    Object.values(v).forEach(walk);
  };
  walk(raw);
  return out.slice(0, 30);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action;
    if (action === 'username') {
      const username = String(body.username || '').trim();
      if (!username || username.length > 20) return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
      return NextResponse.json(await roblox('https://users.roblox.com/v1/usernames/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }) }));
    }
    if (action === 'avatar') {
      const id = Number(body.userId);
      if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
      return NextResponse.json(await roblox(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=true`));
    }
    if (action === 'games') {
      const q = String(body.query || '').trim();
      if (!q) return NextResponse.json({ data: [] });
      const sessionId = crypto.randomUUID();
      const raw = await roblox(`https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(q)}&sessionId=${sessionId}&pageType=all`);
      return NextResponse.json({ data: normalizeSearch(raw) });
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
