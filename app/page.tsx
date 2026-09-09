import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export default function Home() {
  const file = path.join(process.cwd(), 'rblxfinder-ui-preview.html');
  let html = fs.readFileSync(file, 'utf8');
  const enhancement = `
<script>
(() => {
  const icon = (name) => {
    const paths = {
      home:'<path d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
      game:'<rect x="3" y="6" width="18" height="13" rx="4"/><path d="M8 11v5M5.5 13.5h5M16 11h.01M19 14h.01"/>',
      server:'<rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/><path d="M8 7h.01M8 17h.01"/>',
      info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>',
      heart:'<path d="M20.8 8.6c0 5.1-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.6A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5Z"/>',
      mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      play:'<path d="m8 5 11 7-11 7z"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      shield:'<path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      refresh:'<path d="M20 11a8 8 0 0 0-14.8-4L3 10M3 5v5h5M4 13a8 8 0 0 0 14.8 4L21 14M21 19v-5h-5"/>',
      rocket:'<path d="M14 5c3-3 6-2 6-2s1 3-2 6l-5 5-4-4z"/><path d="M9 10 5 11l-2 4 5-1M14 15l-1 5 4-2 1-4"/><circle cx="16" cy="7" r="1.5"/><path d="m8 16-3 3"/>',
      user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
    };
    return '<svg class="uiIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.info)+'</svg>';
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function addSupport(){
    const donate=document.querySelector('.donates');
    if(!donate || donate.querySelector('.supportCard')) return;
    const card=document.createElement('article');
    card.className='card donate supportCard';
    card.innerHTML='<div class="donateicon">'+icon('mail')+'</div><span class="eyebrow">SUPPORT WEBSITE</span><h2>Hỗ trợ website</h2><p>Nếu gặp lỗi, có góp ý hoặc muốn đề xuất tính năng mới cho RBLXFinder, hãy gửi email trực tiếp cho đội ngũ hỗ trợ.</p><button class="btn primary supportBtn">'+icon('mail')+' Gửi email hỗ trợ</button>';
    card.querySelector('button').onclick=()=>location.href='mailto:supportrobloxfinder@gmail.com?subject=H%E1%BB%97%20tr%E1%BB%A3%20RBLXFinder';
    donate.appendChild(card);
  }
  function replaceButtonEmojis(){
    const map=[[/^🎮\s*/,'game'],[/^🚀\s*/,'rocket'],[/^✨\s*/,'info'],[/^💜\s*/,'heart'],[/^👤\s*/,'user'],[/^✉\s*/,'mail'],[/^🛡️\s*/,'shield'],[/^🎟️\s*/,'plus'],[/^↻\s*/,'refresh']];
    document.querySelectorAll('button').forEach(b=>{
      if(b.dataset.iconDone) return;
      const text=(b.textContent||'').trim();
      for(const [re,n] of map){ if(re.test(text)){ b.innerHTML=icon(n)+'<span>'+esc(text.replace(re,'').trim())+'</span>'; b.dataset.iconDone='1'; break; } }
    });
  }
  function polish(){
    addSupport(); replaceButtonEmojis();
    const style=document.createElement('style');
    style.textContent='.uiIcon{width:18px;height:18px;display:inline-block;vertical-align:-4px;flex:0 0 auto}.btn,.links button,.chip,.apps button{display:inline-flex;align-items:center;justify-content:center;gap:8px}.donates{grid-template-columns:repeat(3,1fr)!important}.supportCard{min-height:100%}@media(max-width:850px){.donates{grid-template-columns:1fr!important}}';
    document.head.appendChild(style);
  }
  const oldPage=window.page;
  window.page=function(p){ oldPage(p); setTimeout(polish,20); };
  setTimeout(polish,0);
})();
</script>`;
  html = html.replace('</body>', enhancement + '\n</body>');
  return <iframe title="RBLXFinder" srcDoc={html} style={{display:'block',width:'100%',height:'100vh',border:0}} />;
}
