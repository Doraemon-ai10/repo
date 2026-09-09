import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export default function Home() {
  const file = path.join(process.cwd(), 'rblxfinder-ui-preview.html');
  let html = fs.readFileSync(file, 'utf8');

  const enhancement = `
<script>
(() => {
  const api = async (action, payload = {}) => {
    const r = await fetch('/api/roblox', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({action, ...payload})
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'API error');
    return d;
  };
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => Number(n || 0).toLocaleString('vi-VN');

  // Each main navigation button has its own real URL. pushState keeps the
  // current app loaded while the address bar, refresh and browser back/forward work.
  const ROUTES = {home:'/', games:'/games', servers:'/servers', about:'/about', donate:'/donate'};
  function go(p, replace = false) {
    if (!ROUTES[p]) p = 'home';
    history[replace ? 'replaceState' : 'pushState']({page:p}, '', ROUTES[p]);
    document.querySelectorAll('.links button').forEach(b => b.classList.toggle('on', b.id === p));
    if (p === 'home' && typeof home === 'function') home();
    else if (p === 'games') renderGamesPage();
    else if (p === 'servers' && typeof serversPage === 'function') serversPage();
    else if (p === 'about' && typeof aboutPage === 'function') aboutPage();
    else if (p === 'donate' && typeof donatePage === 'function') donatePage();
    window.scrollTo(0, 0);
    setTimeout(bindNavigation, 0);
  }
  window.page = go;

  function bindNavigation() {
    document.querySelectorAll('.links button').forEach(btn => {
      if (btn.dataset.rblxBound === '1') return;
      btn.dataset.rblxBound = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        go(btn.id);
      }, true);
    });
    document.querySelectorAll('.brand').forEach(btn => {
      if (btn.dataset.rblxBound === '1') return;
      btn.dataset.rblxBound = '1';
      btn.addEventListener('click', e => { e.preventDefault(); e.stopImmediatePropagation(); go('home'); }, true);
    });
  }

  // Persistent user profile: once the public Roblox username is confirmed,
  // it is stored locally and restored automatically on later visits.
  const USER_KEY = 'rblxfinder_user_v1';
  const getUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } };
  const saveUser = u => localStorage.setItem(USER_KEY, JSON.stringify({id:u.id,name:u.name,displayName:u.displayName || u.name,avatar:u.avatar || ''}));
  function applySavedUser() {
    const u = getUser();
    if (!u) return;
    window.__rblxUser = u;
    const loginBtn = document.querySelector('.links')?.querySelector('[data-user-button]');
    if (loginBtn) { loginBtn.textContent = u.displayName || u.name; loginBtn.dataset.userButton = '1'; }
  }

  async function verifyRoblox() {
    const input = document.getElementById('uname');
    const n = input?.value.trim();
    if (!n) return toast('Hãy nhập username trước');
    try {
      toast('Đang tìm tài khoản Roblox…');
      const d = await api('username', {username:n});
      const u = d?.data?.[0];
      if (!u) throw new Error('not found');
      let avatar = '';
      try { avatar = (await api('avatar',{userId:u.id}))?.data?.[0]?.imageUrl || ''; } catch {}
      window.__rblxUser = {...u, avatar};
      const cn=document.getElementById('cn'), ca=document.getElementById('ca'), img=document.querySelector('#confirm .user img');
      if(cn) cn.textContent=u.displayName || u.name;
      if(ca) ca.textContent='@'+u.name;
      if(img && avatar) img.src=avatar;
      closeM('login'); openM('confirm');
    } catch { toast('Không tìm thấy username Roblox. Hãy kiểm tra lại.'); }
  }
  window.verify = verifyRoblox;
  window.confirmed = () => {
    const u = window.__rblxUser;
    if (!u) return;
    saveUser(u);
    closeM('confirm');
    toast('✓ Đã lưu tài khoản — lần sau không cần đăng nhập lại');
    applySavedUser();
    go('games');
  };

  function renderGamesPage() {
    const root = document.getElementById('root');
    root.innerHTML = '<section class="pagehead"><span class="eyebrow">ROBLOX DISCOVERY</span><h2>Tìm game</h2><p>Tìm dữ liệu game Roblox thật theo username hoặc tên game.</p></section>' +
      '<div class="search"><input id="q" placeholder="Brookhaven, Blox Fruits…"><button class="btn primary" id="realSearch">Tìm game</button></div>' +
      '<div class="chips"><button class="chip">Brookhaven</button><button class="chip">Blox Fruits</button><button class="chip">Grow a Garden</button></div>' +
      '<div id="gamesResults" class="games"></div>';
    const q=document.getElementById('q');
    document.getElementById('realSearch').onclick=()=>realGames(q.value);
    q.onkeydown=e=>{if(e.key==='Enter')realGames(q.value)};
    root.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{q.value=b.textContent;realGames(q.value)});
    setTimeout(bindNavigation,0);
  }

  async function realGames(q) {
    if (!q?.trim()) return toast('Nhập tên game trước');
    try {
      toast('Đang tìm game Roblox…');
      const d=await api('games',{query:q.trim()});
      const list=Array.isArray(d?.data)?d.data:[];
      let thumbs=[];
      const ids=list.map(x=>x.universeId).filter(Boolean);
      if(ids.length){try{thumbs=(await api('thumbs',{universeIds:ids})).data||[]}catch{}}
      const tm={};
      thumbs.forEach(x=>{const z=x?.thumbnails?.find(v=>v?.imageUrl);if(z)tm[x.universeId]=z.imageUrl});
      window.__games=list;
      const out=document.getElementById('gamesResults');
      out.innerHTML=list.map(g=>'<button class="game" data-id="'+esc(g.universeId)+'"><div class="thumb">'+(tm[g.universeId]?'<img src="'+esc(tm[g.universeId])+'" alt="" style="width:100%;height:100%;object-fit:cover">':'')+'</div><div class="gamebody"><h3>'+esc(g.name)+'</h3><p>👥 '+fmt(g.playing)+' đang chơi</p></div></button>').join('') || '<div class="empty">Không tìm thấy game.</div>';
      out.querySelectorAll('.game').forEach(b=>b.onclick=()=>openRealGame(list.find(g=>String(g.universeId)===b.dataset.id)));
      if(!list.length) toast('Không tìm thấy game.');
    } catch { toast('API Roblox đang lỗi hoặc tạm thời không phản hồi.'); }
  }

  async function openRealGame(g) {
    if(!g) return;
    window.__selectedGame=g;
    go('servers');
    try {
      toast('Đang tải server…');
      const [det,priv,srv]=await Promise.all([
        api('details',{universeId:g.universeId}),
        api('private',{universeId:g.universeId}),
        api('servers',{placeId:g.rootPlaceId})
      ]);
      renderServers(g,det?.data?.[0]||g,priv?.data===true||priv?.data?.enabled===true,Array.isArray(srv?.data)?srv.data:[]);
    } catch { toast('Không thể tải server của game này.'); }
  }

  function renderServers(g,d,enabled,servers) {
    const root=document.getElementById('root');
    const rows=servers.map((s,i)=>'<article class="panel server"><div class="rank">'+(i+1)+'</div><div class="serverinfo"><b>Server #'+String(s.id).slice(0,8)+'</b><small>'+fmt(s.playing)+' / '+fmt(s.maxPlayers)+' người</small><div class="bar"><i style="width:'+Math.min(100,(s.playing/Math.max(1,s.maxPlayers))*100)+'%"></i></div></div><div class="count"><strong>'+fmt(s.playing)+'</strong><small>/ '+fmt(s.maxPlayers)+'</small></div><button class="btn primary joinBtn" data-sid="'+esc(s.id)+'">Vào</button></article>').join('');
    root.innerHTML='<button class="btn ghost" id="backGames">← Tìm game</button><section class="pagehead"><span class="eyebrow">SERVER BROWSER</span><h2>'+esc(d.name||g.name)+'</h2><p>👥 '+fmt(d.playing)+' đang chơi · Creator: '+esc(d.creator?.name||'Roblox')+'</p></section><div class="panel" style="padding:20px;margin-bottom:13px"><strong>Private Server:</strong> <span style="font-weight:900;color:'+(enabled?'#16a34a':'#dc2626')+'">'+(enabled?'✓ Có thể tạo':'✕ Game không cho tạo')+'</span><button class="btn '+(enabled?'primary':'ghost')+'" id="svvBtn" '+(enabled?'':'disabled')+'>Tạo SVV</button></div><div class="panel toolbar"><button class="btn ghost" id="refresh">↻ Làm mới</button></div><div style="margin-top:13px" id="serverList">'+(rows||'<div class="empty">Không có server công khai.</div>')+'</div>';
    document.getElementById('backGames').onclick=()=>go('games');
    document.getElementById('refresh').onclick=()=>openRealGame(g);
    document.getElementById('svvBtn')?.addEventListener('click',()=>location.href=location.origin+'/servers?create='+encodeURIComponent(g.rootPlaceId));
    root.querySelectorAll('.joinBtn').forEach(b=>b.onclick=()=>{const s=servers.find(x=>x.id===b.dataset.sid);if(s){window.__targetServer=s;openM('apps')}});
  }

  window.launchReal = kind => {
    const g=window.__selectedGame,s=window.__targetServer;
    if(!g||!s)return toast('Không tìm thấy server.');
    const pkg=kind==='vng'?'com.roblox.client.vnggames':'com.roblox.client';
    closeM('apps');
    location.href='intent://placeId='+encodeURIComponent(g.rootPlaceId)+'&gameInstanceId='+encodeURIComponent(s.id)+'#Intent;scheme=roblox;package='+pkg+';end';
    setTimeout(()=>location.href='https://www.roblox.com/games/start?placeId='+g.rootPlaceId+'&gameInstanceId='+encodeURIComponent(s.id),1200);
  };

  // Browser back/forward and direct /games, /about, /donate URLs.
  window.addEventListener('popstate',()=>{
    const p=location.pathname.replace(/^\//,'')||'home';
    go(p,true);
  });
  function initialRoute(){
    const p=location.pathname.replace(/^\//,'')||'home';
    go(ROUTES[p]?p:'home',true);
    applySavedUser();
  }

  const style=document.createElement('style');
  style.textContent='.links,.links button{pointer-events:auto!important}.links button{position:relative;z-index:50}.btn,.chip,.game,.brand{cursor:pointer}.empty{padding:30px;text-align:center;color:#777b8d}.rblxSavedUser{display:inline-flex;align-items:center;gap:7px;font-weight:900;color:#6252d8}';
  document.head.appendChild(style);

  bindNavigation();
  setTimeout(initialRoute,0);
})();
</script>`;

  html = html.replace('</body>', enhancement + '\n</body>');
  return <iframe title="RBLXFinder" srcDoc={html} style={{display:'block',width:'100%',height:'100vh',border:0}} />;
}
