import { NextRequest, NextResponse } from 'next/server';

const cors = { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization' };
export async function OPTIONS(){ return new NextResponse(null,{status:204,headers:cors}); }
function json(data:any,status=200){ return NextResponse.json(data,{status,headers:cors}); }

async function roblox(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, cache:'no-store', headers:{'User-Agent':'RBLX-Server-Finder/6.0', ...(init?.headers||{})} });
  const text=await r.text(); let data:any={};
  try{data=JSON.parse(text)}catch{data={message:text||'Roblox API returned an invalid response'}}
  if(!r.ok)throw new Error(`${r.status}: ${JSON.stringify(data)}`);
  return data;
}
function normalizeSearch(raw:any){
  const out:any[]=[]; const seen=new Set<number>();
  const walk=(v:any)=>{if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(walk);return}const universeId=Number(v.universeId??v.universeID??v.id);const rootPlaceId=Number(v.rootPlaceId??v.rootPlaceID??v.universeRootPlaceId??v.placeId);const name=typeof v.name==='string'?v.name:'';if(Number.isInteger(universeId)&&universeId>0&&Number.isInteger(rootPlaceId)&&rootPlaceId>0&&name&&!seen.has(universeId)){seen.add(universeId);out.push({universeId,rootPlaceId,name,description:v.description,playing:Number(v.playing??v.playerCount??0)||0,visits:Number(v.visits??0)||0,maxPlayers:Number(v.maxPlayers??0)||undefined,creator:v.creator??(v.creatorName?{name:v.creatorName}:undefined)})}Object.values(v).forEach(walk)};
  walk(raw);return out.slice(0,30);
}
export async function POST(req:NextRequest){try{const body=await req.json();const action=body?.action;
 if(action==='username'){const username=String(body.username||'').trim();if(!username||username.length>20)return json({error:'Invalid username'},400);return json(await roblox('https://users.roblox.com/v1/usernames/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usernames:[username],excludeBannedUsers:false})}))}
 if(action==='avatar'){const id=Number(body.userId);if(!Number.isInteger(id))return json({error:'Invalid userId'},400);return json(await roblox(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=true`))}
 if(action==='games'){const q=String(body.query||body.q||'').trim();if(!q)return json({data:[],games:[]});const raw=await roblox(`https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(q)}&sessionId=${crypto.randomUUID()}&pageType=all`);const games=normalizeSearch(raw);return json({data:games,games})}
 if(action==='thumbs'){const ids=Array.isArray(body.universeIds)?body.universeIds.map(Number).filter((n:number)=>Number.isInteger(n)&&n>0).slice(0,50):[];if(!ids.length)return json({data:[]});return json(await roblox(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${ids.join(',')}&countPerUniverse=1&defaults=true&size=768x432&format=Webp&isCircular=false`))}
 if(action==='details'){const id=Number(body.universeId);if(!Number.isInteger(id))return json({error:'Invalid universeId'},400);return json(await roblox(`https://games.roblox.com/v1/games?universeIds=${id}`))}
 if(action==='private'){const id=Number(body.universeId);if(!Number.isInteger(id))return json({error:'Invalid universeId'},400);return json(await roblox(`https://games.roblox.com/v1/private-servers/enabled-in-universe/${id}`))}
 if(action==='servers'){let placeId=Number(body.placeId);const universeId=Number(body.universeId);if(!Number.isInteger(placeId)&&Number.isInteger(universeId)){const details=await roblox(`https://games.roblox.com/v1/games?universeIds=${universeId}`);placeId=Number(details?.data?.[0]?.rootPlaceId)}if(!Number.isInteger(placeId)||placeId<=0)return json({error:'Invalid placeId/universeId'},400);let cursor='';const all:any[]=[];const seen=new Set<string>();for(let page=0;page<3;page++){const params=new URLSearchParams({sortOrder:'1',excludeFullGames:'true',limit:'100'});if(cursor)params.set('cursor',cursor);const data=await roblox(`https://games.roblox.com/v1/games/${placeId}/servers/Public?${params}`);for(const s of data?.data||[])if(s?.id&&!seen.has(s.id)){seen.add(s.id);all.push(s)}cursor=data?.nextPageCursor||'';if(!cursor)break}all.sort((a,b)=>Number(a.playing||0)-Number(b.playing||0));return json({data:all.slice(0,250),placeId})}
 throw new Error('Unknown action');
}catch(e){return json({error:e instanceof Error?e.message:'Roblox API request failed'},502)}}
