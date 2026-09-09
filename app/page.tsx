import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export default function Home() {
  const file = path.join(process.cwd(), 'rblxfinder-ui-preview.html');
  let html = fs.readFileSync(file, 'utf8');
  const enhancement = `
<script>
(() => {
  const api = async (action, payload={}) => {
    const r = await fetch('/api/roblox', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})});
    const d = await r.json().catch(()=>({}));
    if (!r.ok) throw new Error(d.error || 'API error');
    return d;
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => Number(n||0).toLocaleString('vi-VN');
  const icon = name => ({
    game:'<rect x="3" y="6" width="18" height="13" rx="4"/><path d="M8 11v5M5.5 13.5h5M16 11h.01M19 14h.01"/>',
    server:'<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>',
    heart:'<path d="M20.8 8.6c0 5.1-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.6A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5Z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    refresh:'<path d="M20 11a8 8 0 0 0-14.8-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.8 4L21 14M21 19v-5h-5"/>',
    rocket:'<path d="M14 5c3-3 6-2 6-2s1 3-2 6l-5 5-4-4z"/><path d="M9 10 5 11l-2 4 5-1M14 15l-1 5 4-2 1-4"/><circle cx="16" cy="7" r="1.5"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  });
  const svg = n => '<svg class="uiIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(icon(n)||icon('info'))+'</svg>';
  function polishButtons(){
    const map=[[/^🎮\\s*/,'game'],[/^🚀\\s*/,'rocket'],[/^✨\\s*/,'info'],[/^💜\\s*/,'heart'],[/^👤\\s*/,'user'],[/^✉\\s*/,'mail'],[/^🛡️\\s*/,'server'],[/^🎟️\\s*/,'heart'],[/^↻\\s*/,'refresh']];
    document.querySelectorAll('button').forEach(b=>{if(b.dataset.iconDone)return;const t=(b.textContent||'').trim();for(const [re,n] of map)if(re.test(t)){b.innerHTML=svg(n)+'<span>'+esc(t.replace(re,'').trim())+'</span>';b.dataset.iconDone='1';break;}});
  }
  async function realVerify(){
    const input=document.getElementById('uname'); const n=input?.value.trim(); if(!n)return toast('Hãy nhập username trước');
    try{
      toast('Đang tìm tài khoản Roblox…');
      const d=await api('username',{username:n}); const u=d?.data?.[0]; if(!u)throw new Error('not found');
      document.getElementById('cn').textContent=u.displayName||u.name; document.getElementById('ca').textContent='@'+u.name;
      const img=document.querySelector('#confirm .user img');
      try{const a=await api('avatar',{userId:u.id}); const url=a?.data?.[0]?.imageUrl;if(url&&img)img.src=url;}catch{}
      window.__rblxUser=u; closeM('login'); openM('confirm');
    }catch{toast('Không tìm thấy username Roblox. Hãy kiểm tra lại.');}
  }
  window.verify=realVerify;
  window.confirmedReal=()=>{const u=window.__rblxUser;if(u)localStorage.setItem('rblx_username',u.name);closeM('confirm');toast('✓ Đã xác nhận username');page('games');};
  window.confirmed=window.confirmedReal;
  async function realGames(q){
    if(!q?.trim())return toast('Nhập tên game trước');
    try{
      toast('Đang tìm game Roblox…'); const d=await api('games',{query:q.trim()}); const list=Array.isArray(d?.data)?d.data:[];
      const ids=list.map(x=>x.universeId).filter(Boolean); let thumbs=[]; if(ids.length){try{thumbs=(await api('thumbs',{universeIds:ids})).data||[]}catch{}}
      const tm={}; thumbs.forEach(x=>{const z=x?.thumbnails?.find(v=>v?.imageUrl);if(z)tm[x.universeId]=z.imageUrl;});
      window.__games=list; window.__thumbs=tm; renderGames(list,tm); if(!list.length)toast('Không tìm thấy game.');
    }catch{toast('API Roblox đang lỗi hoặc tạm thời không phản hồi.');}
  }
  function renderGames(list,tm){
    const root=document.getElementById('root');
    root.innerHTML='<section class="pagehead"><span class="eyebrow">ROBLOX DISCOVERY</span><h2>🎮 Tìm game</h2><p>Dữ liệu game và thumbnail lấy trực tiếp qua API.</p></section><div class="search"><input id="q" placeholder="Brookhaven, Blox Fruits…"><button class="btn primary" id="realSearch">Tìm game</button></div><div class="chips"><button class="chip">Brookhaven</button><button class="chip">Blox Fruits</button><button class="chip">Grow a Garden</button></div><div class="games">'+list.map((g,i)=>'<button class="game" data-id="'+g.universeId+'"><div class="thumb">'+(tm[g.universeId]?'<img src="'+esc(tm[g.universeId])+'" alt="" style="width:100%;height:100%;object-fit:cover">':'')+'</div><div class="gamebody"><h3>'+esc(g.name)+'</h3><p>👥 '+fmt(g.playing)+' đang chơi</p></div></button>').join('')+'</div>';
    document.getElementById('realSearch').onclick=()=>realGames(document.getElementById('q').value);
    root.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{document.getElementById('q').value=b.textContent;realGames(b.textContent)});
    root.querySelectorAll('.game').forEach(b=>b.onclick=()=>openRealGame(list.find(x=>String(x.universeId)===b.dataset.id)));
    const q=document.getElementById('q');q.onkeydown=e=>{if(e.key==='Enter')realGames(q.value)};polishButtons();
  }
  async function openRealGame(g){
    if(!g)return; window.__selectedGame=g; page('servers');
    try{
      toast('Đang tải server…');
      const [det,priv,srv]=await Promise.all([api('details',{universeId:g.universeId}),api('private',{universeId:g.universeId}),api('servers',{placeId:g.rootPlaceId})]);
      const d=det?.data?.[0]||g; const enabled=priv?.data===true||priv?.data?.enabled===true; const servers=Array.isArray(srv?.data)?srv.data:[];
      window.__serverData=servers;
      renderServers(g,d,enabled,servers);
    }catch{toast('Không thể tải server của game này.');}
  }
  function renderServers(g,d,enabled,servers){
    const root=document.getElementById('root');
    const rows=servers.map((s,i)=>'<article class="panel server"><div class="rank">'+(i+1)+'</div><div class="serverinfo"><b>Server #'+String(s.id).slice(0,8)+'</b><small>'+fmt(s.playing)+' / '+fmt(s.maxPlayers)+' người</small><div class="bar"><i style="width:'+Math.min(100,(s.playing/Math.max(1,s.maxPlayers))*100)+'%"></i></div></div><div class="count"><strong>'+fmt(s.playing)+'</strong><small>/ '+fmt(s.maxPlayers)+'</small></div><button class="btn primary joinBtn" data-sid="'+esc(s.id)+'">Vào →</button></article>').join('');
    root.innerHTML='<button class="btn ghost" id="backGames">← Tìm game</button><section class="pagehead"><span class="eyebrow">SERVER BROWSER</span><h2>'+esc(d.name||g.name)+'</h2><p>👥 '+fmt(d.playing)+' đang chơi · Creator: '+esc(d.creator?.name||'Roblox')+'</p></section><div class="panel" style="padding:20px;margin-bottom:13px"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><strong>Private Server:</strong><span style="font-weight:900;color:'+(enabled?'#16a34a':'#dc2626')+'">'+(enabled?'✓ Có thể tạo':'✕ Game không cho tạo')+'</span><button class="btn '+(enabled?'primary':'ghost')+'" id="svvBtn" '+(enabled?'':'disabled')+'>'+svg('server')+' Tạo SVV</button></div></div><div class="panel toolbar"><select id="sort"><option value="few">Ít người nhất</option><option value="space">Nhiều chỗ trống nhất</option></select><button class="btn ghost" id="refresh">'+svg('refresh')+' Làm mới</button></div><div style="margin-top:13px" id="serverList">'+(rows||'<div class="empty">Không có server công khai.</div>')+'</div>';
    document.getElementById('backGames').onclick=()=>page('games');
    document.getElementById('refresh').onclick=()=>openRealGame(g);
    document.getElementById('svvBtn')?.addEventListener('click',()=>{location.href=location.origin+'/servers?create='+g.rootPlaceId});
    root.querySelectorAll('.joinBtn').forEach(b=>b.onclick=()=>{const s=servers.find(x=>x.id===b.dataset.sid);if(s){window.__targetServer=s;openM('apps')}});
    polishButtons();
  }
  window.launchReal=(kind)=>{
    const g=window.__selectedGame,s=window.__targetServer;if(!g||!s)return toast('Không tìm thấy server.');
    const pkg=kind==='vng'?'com.roblox.client.vnggames':'com.roblox.client';
    closeM('apps'); toast(kind==='vng'?'Đang mở Roblox VN…':'Đang mở Roblox Global…');
    location.href='intent://placeId='+encodeURIComponent(g.rootPlaceId)+'&gameInstanceId='+encodeURIComponent(s.id)+'#Intent;scheme=roblox;package='+pkg+';end';
    setTimeout(()=>location.href='https://www.roblox.com/games/start?placeId='+g.rootPlaceId+'&gameInstanceId='+encodeURIComponent(s.id),1200);
  };
  const oldGames=window.gamesPage; window.gamesPage=()=>{document.getElementById('root').innerHTML='<section class="pagehead"><span class="eyebrow">ROBLOX DISCOVERY</span><h2>🎮 Tìm game</h2><p>Tìm game thật từ Roblox.</p></section><div class="search"><input id="q" placeholder="Brookhaven, Blox Fruits…"><button class="btn primary" id="realSearch">Tìm game</button></div><div class="chips"><button class="chip">Brookhaven</button><button class="chip">Blox Fruits</button><button class="chip">Grow a Garden</button></div>';document.getElementById('realSearch').onclick=()=>realGames(document.getElementById('q').value);document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>realGames(b.textContent));document.getElementById('q').onkeydown=e=>{if(e.key==='Enter')realGames(e.target.value)};polishButtons();};
  const oldOpenM=window.openM;
  window.openM=oldOpenM;
  document.addEventListener('click',e=>{const b=e.target.closest('#apps .apps button');if(!b)return;const text=b.textContent||'';launchReal(text.includes('VN')?'vng':'global');});
  function addSupport(){const d=document.querySelector('.donates');if(!d||d.querySelector('.supportCard'))return;const c=document.createElement('article');c.className='card donate supportCard';c.innerHTML='<div class="donateicon">'+svg('mail')+'</div><span class="eyebrow">SUPPORT WEBSITE</span><h2>Hỗ trợ website</h2><p>Gặp lỗi hoặc có góp ý? Gửi email trực tiếp cho đội ngũ hỗ trợ RBLXFinder.</p><button class="btn primary">'+svg('mail')+' Gửi email hỗ trợ</button>';c.querySelector('button').onclick=()=>location.href='mailto:supportrobloxfinder@gmail.com?subject=H%E1%BB%97%20tr%E1%BB%A3%20RBLXFinder';d.appendChild(c)}
  const style=document.createElement('style');style.textContent='.uiIcon{width:18px;height:18px;display:inline-block;flex:0 0 auto}.btn,.links button,.chip,.apps button{display:inline-flex;align-items:center;justify-content:center;gap:8px}.donates{grid-template-columns:repeat(3,1fr)!important}@media(max-width:850px){.donates{grid-template-columns:1fr!important}}';document.head.appendChild(style);
  const oldPage=window.page; window.page=function(p){oldPage(p);setTimeout(()=>{polishButtons();addSupport();},30);};
  setTimeout(()=>{polishButtons();addSupport();},0);
})();
</script>`;
  html = html.replace('</body>', enhancement + '\n</body>');
  return <iframe title="RBLXFinder" srcDoc={html} style={{display:'block',width:'100%',height:'100vh',border:0}} />;
}
