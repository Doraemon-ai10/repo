const hosts = {
  users: 'https://users.roblox.com',
  thumbnails: 'https://thumbnails.roblox.com',
  presence: 'https://presence.roblox.com',
  groups: 'https://groups.roblox.com',
  friends: 'https://friends.roblox.com',
  badges: 'https://badges.roblox.com',
  games: 'https://games.roblox.com',
  avatar: 'https://avatar.roblox.com',
  catalog: 'https://catalog.roblox.com',
  economy: 'https://economy.roblox.com',
  inventory: 'https://apis.roblox.com',
};

export async function GET(request, context) { return proxy(request, context); }
export async function POST(request, context) { return proxy(request, context); }

async function proxy(request, context) {
  const { domain, path } = await context.params;
  const host = hosts[domain];
  if (!host) return Response.json({ error: 'Unsupported Roblox API domain' }, { status: 400 });

  const url = new URL(`${host}/${(path || []).join('/')}`);
  new URL(request.url).searchParams.forEach((value, key) => url.searchParams.set(key, value));

  try {
    const body = request.method === 'POST' ? await request.text() : undefined;
    const headers = { Accept: 'application/json' };
    if (body) headers['Content-Type'] = 'application/json';
    if (domain === 'inventory' && process.env.ROBLOX_API_KEY) headers['x-api-key'] = process.env.ROBLOX_API_KEY;
    const response = await fetch(url, { method: request.method, headers, body, next: { revalidate: 30 } });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Roblox API proxy error:', error);
    return Response.json({ error: 'Roblox API request failed' }, { status: 502 });
  }
}
