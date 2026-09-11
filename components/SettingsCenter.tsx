'use client';

import { useEffect, useState } from 'react';

type Lang = 'vi' | 'en';
type Theme = 'light' | 'dark' | 'system';
type Font = 'system' | 'inter' | 'roboto' | 'poppins' | 'mono';

const dict: Record<string,string> = {
  Home:'Trang chủ', Roblox:'Roblox', '⭐ Plus':'⭐ Plus', '👑 Creator':'👑 Creator', 'Free Fire':'Free Fire', Community:'Cộng đồng', Daily:'Hằng ngày', Compare:'So sánh', About:'Giới thiệu',
  'Trang chủ':'Home', Username:'Username', 'Tìm game':'Find games', Server:'Servers', 'Cộng đồng':'Community', 'Ủng hộ Creator':'Support Creator', 'Nạp / Ủng hộ':'Top up / Support', 'Độ nhạy':'Sensitivity', 'Góp ý':'Feedback', 'Chọn game':'Choose game',
  'Tìm':'Search', 'Tìm username':'Find username', 'Tìm server':'Find servers', 'Tìm game Roblox':'Find Roblox games', 'Cộng đồng':'Community', 'Gửi':'Send', 'Xóa lọc':'Clear filter', 'Đăng bài':'Post', 'Tạo bài đăng':'Create post', 'Tên hiển thị':'Display name', 'Mô tả / nội dung':'Description / content', 'Tên bài đăng':'Post title', 'Thiết bị':'Device', 'Nút bắn %':'Fire button %', 'Đã copy Server ID':'Server ID copied',
};

function translateNode(root: Node, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const n of nodes) {
    const raw = n.nodeValue || '';
    if (!raw.trim() || n.parentElement?.closest('script,style')) continue;
    const key = raw.trim();
    const translated = lang === 'en' ? dict[key] : Object.entries(dict).find(([en,vi]) => vi === key)?.[0];
    if (translated && translated !== key) n.nodeValue = raw.replace(key, translated);
  }
}

export default function SettingsCenter() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('vi');
  const [theme, setTheme] = useState<Theme>('light');
  const [font, setFont] = useState<Font>('system');

  useEffect(() => {
    const savedLang = (localStorage.getItem('rblxfinder_lang') as Lang) || 'vi';
    const savedTheme = (localStorage.getItem('rblxfinder_theme') as Theme) || 'light';
    const savedFont = (localStorage.getItem('rblxfinder_font') as Font) || 'system';
    setLang(savedLang); setTheme(savedTheme); setFont(savedFont);
  }, []);

  useEffect(() => {
    localStorage.setItem('rblxfinder_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dataset.rblxLang = lang;
    translateNode(document.body, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rblxfinder_theme', theme);
    document.documentElement.dataset.rblxTheme = theme;
    document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rblxfinder_font', font);
    const map: Record<Font,string> = { system:'system-ui,-apple-system,sans-serif', inter:'Inter,system-ui,sans-serif', roboto:'Roboto,Arial,sans-serif', poppins:'Poppins,Inter,sans-serif', mono:'ui-monospace,SFMono-Regular,monospace' };
    document.documentElement.style.setProperty('--rblx-font', map[font]);
  }, [font]);

  useEffect(() => {
    const observer = new MutationObserver(() => translateNode(document.body, lang));
    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
    return () => observer.disconnect();
  }, [lang]);

  return <>
    <button aria-label="Settings" onClick={() => setOpen(true)} style={{position:'fixed',right:18,bottom:18,zIndex:9999,width:52,height:52,border:0,borderRadius:16,background:'linear-gradient(135deg,#6353db,#986eff)',color:'#fff',fontSize:23,boxShadow:'0 12px 35px #0003',cursor:'pointer'}}>⚙</button>
    {open && <div style={{position:'fixed',inset:0,zIndex:10000,background:'#0007',display:'grid',placeItems:'center',padding:18}} onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section style={{width:'min(520px,100%)',maxHeight:'90vh',overflow:'auto',background:'var(--rblx-settings-bg,#fff)',color:'var(--rblx-settings-fg,#111827)',borderRadius:24,padding:24,boxShadow:'0 30px 80px #0005',fontFamily:'var(--rblx-font,system-ui)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><div><h2 style={{margin:'0 0 5px'}}>{lang==='vi'?'Cài đặt':'Settings'}</h2><p style={{margin:0,opacity:.65,fontSize:13}}>{lang==='vi'?'Áp dụng cho cả Web và ứng dụng Android.':'Applies to both the Web and Android app.'}</p></div><button onClick={()=>setOpen(false)} style={{border:0,background:'#eef2f7',borderRadius:12,padding:'8px 12px',cursor:'pointer'}}>✕</button></div>
        <div style={{marginTop:22}}><b>{lang==='vi'?'Ngôn ngữ':'Language'}</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginTop:9}}>{([['vi','🇻🇳 Tiếng Việt'],['en','🇺🇸 English']] as [Lang,string][]).map(([v,l])=><button key={v} onClick={()=>setLang(v)} style={{padding:13,borderRadius:14,border:lang===v?'2px solid #6353db':'1px solid #ddd',background:lang===v?'#f1efff':'transparent',cursor:'pointer',fontWeight:800}}>{l}</button>)}</div></div>
        <div style={{marginTop:20}}><b>{lang==='vi'?'Nền':'Theme'}</b><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,marginTop:9}}>{([['light',lang==='vi'?'Sáng':'Light'],['dark',lang==='vi'?'Tối':'Dark'],['system',lang==='vi'?'Theo máy':'System']] as [Theme,string][]).map(([v,l])=><button key={v} onClick={()=>setTheme(v)} style={{padding:12,borderRadius:14,border:theme===v?'2px solid #6353db':'1px solid #ddd',background:theme===v?'#f1efff':'transparent',cursor:'pointer',fontWeight:800}}>{l}</button>)}</div></div>
        <div style={{marginTop:20}}><b>{lang==='vi'?'Phông chữ':'Font'}</b><select value={font} onChange={e=>setFont(e.target.value as Font)} style={{width:'100%',marginTop:9,padding:12,borderRadius:14,border:'1px solid #ddd',fontFamily:'var(--rblx-font)'}}>{([['system','Mặc định / System'],['inter','Inter'],['roboto','Roboto'],['poppins','Poppins'],['mono','Mono']] as [Font,string][]).map(([v,l])=><option key={v} value={v}>{lang==='vi'?l:l.replace('Mặc định / ','Default / ')}</option>)}</select></div>
        <p style={{margin:'20px 0 0',fontSize:12,opacity:.6}}>{lang==='vi'?'Cài đặt được lưu trên thiết bị và giữ nguyên sau khi mở lại.':'Settings are saved on this device and persist after reopening.'}</p>
      </section>
    </div>}
    <style jsx global>{`html{font-family:var(--rblx-font,system-ui)}html[data-rblx-theme='dark'] body{background:#0b1020!important;color:#f8fafc!important}html[data-rblx-theme='dark'] .card,html[data-rblx-theme='dark'] section.card{background:#121a2c!important;color:#f8fafc!important;border-color:#26324a!important}html[data-rblx-theme='dark'] input,html[data-rblx-theme='dark'] textarea,html[data-rblx-theme='dark'] select{background:#0f172a!important;color:#f8fafc!important;border-color:#334155!important}html[data-rblx-theme='dark'] .btn{background:#172033!important;color:#f8fafc!important;border-color:#334155!important}html[data-rblx-theme='dark'] .sub,html[data-rblx-theme='dark'] .note,html[data-rblx-theme='dark'] .meta{color:#aab6ca!important}html[data-rblx-theme='dark'] .picker{background:#0b1020!important;color:#f8fafc!important}html[data-rblx-theme='dark'] .pickgrid button{background:#121a2c!important;color:#f8fafc!important;border-color:#26324a!important}html{--rblx-settings-bg:#fff;--rblx-settings-fg:#111827}html[data-rblx-theme='dark']{--rblx-settings-bg:#121a2c;--rblx-settings-fg:#f8fafc}`}</style>
  </>;
}
