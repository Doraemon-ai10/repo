'use client';

import { useEffect, useState } from 'react';

type Lang = 'vi' | 'en';
type Theme = 'light' | 'dark' | 'blue' | 'purple';
type Font = 'system' | 'inter' | 'roboto' | 'poppins' | 'mono';
type Size = 'small' | 'normal' | 'large';

const pairs: [string,string][] = [
 ['Home','Trang chủ'],['Roblox','Roblox'],['⭐ Plus','⭐ Plus'],['👑 Creator','👑 Creator'],['Free Fire','Free Fire'],['Community','Cộng đồng'],['Daily','Hằng ngày'],['Compare','So sánh'],['About','Giới thiệu'],
 ['Username','Tên người dùng'],['Find games','Tìm game'],['Servers','Máy chủ'],['Support Creator','Ủng hộ Creator'],['Top up / Support','Nạp / Ủng hộ'],['Sensitivity','Độ nhạy'],['Feedback','Góp ý'],['Choose game','Chọn game'],['Search','Tìm'],['Find username','Tìm username'],['Find servers','Tìm server'],['Find Roblox games','Tìm game Roblox'],['Send','Gửi'],['Clear filter','Xóa lọc'],['Post','Đăng bài'],['Create post','Tạo bài đăng'],['Display name','Tên hiển thị'],['Description / content','Mô tả / nội dung'],['Post title','Tên bài đăng'],['Device','Thiết bị'],['Fire button %','Nút bắn %'],['Server ID copied','Đã copy Server ID'],
 ['Roblox Power Tools','Công cụ Roblox nâng cao'],['Profile Scanner','Quét hồ sơ'],['Game Intelligence','Thông tin game'],['Low-Pop Server Finder','Tìm máy chủ ít người'],['Game Compare','So sánh game'],['Saved Games','Game đã lưu'],['Level & XP','Cấp độ & XP'],['Roblox Plus','Roblox Plus'],['Plus Center','Trung tâm Plus'],['Free Fire','Free Fire'],['Aim Challenge','Thử thách ngắm'],['Sensitivity Lab','Phòng chỉnh độ nhạy'],['HUD Builder','Tạo HUD'],['Daily Challenges','Thử thách hằng ngày'],['AI Assistant','Trợ lý AI'],['Open game','Mở game'],['Copy','Sao chép'],['Save','Lưu'],['Loading','Đang tải'],['Error','Lỗi'],['Success','Thành công'],['Settings','Cài đặt'],['Language','Ngôn ngữ'],['Theme','Nền giao diện'],['Font','Phông chữ'],['Font size','Cỡ chữ'],['Light','Sáng'],['Dark','Tối'],['Blue','Xanh'],['Purple','Tím'],['System','Theo máy'],['Default','Mặc định'],['Small','Nhỏ'],['Normal','Bình thường'],['Large','Lớn'],['Applies to both the Web and Android app.','Áp dụng cho cả Web và ứng dụng Android.'],['Settings are saved on this device and persist after reopening.','Cài đặt được lưu trên thiết bị và giữ nguyên sau khi mở lại.'],
 ['Roblox ID','Roblox ID'],['Robux','Robux'],['Donate','Donate'],['Creator','Creator'],['Free Fire ID','Free Fire ID'],['Creator ID','ID Creator'],['Top up diamonds','Nạp kim cương'],['Noobie Gaming Hub','Noobie Gaming Hub']
];
const enToVi = Object.fromEntries(pairs);
const viToEn = Object.fromEntries(pairs.map(([en,vi])=>[vi,en]));

function translateNode(root: Node, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const n of nodes) {
    const raw = n.nodeValue || '';
    if (!raw.trim() || n.parentElement?.closest('script,style,option')) continue;
    const key = raw.trim();
    const translated = lang === 'en' ? enToVi[key] : viToEn[key];
    if (translated && translated !== key) n.nodeValue = raw.replace(key, translated);
  }
}

export default function SettingsCenter() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('vi');
  const [theme, setTheme] = useState<Theme>('light');
  const [font, setFont] = useState<Font>('system');
  const [size, setSize] = useState<Size>('normal');

  useEffect(() => {
    const l = localStorage.getItem('rblxfinder_lang') as Lang; const t = localStorage.getItem('rblxfinder_theme') as Theme; const f = localStorage.getItem('rblxfinder_font') as Font; const s = localStorage.getItem('rblxfinder_font_size') as Size;
    if(l==='vi'||l==='en') setLang(l); if(['light','dark','blue','purple'].includes(t)) setTheme(t); if(['system','inter','roboto','poppins','mono'].includes(f)) setFont(f); if(['small','normal','large'].includes(s)) setSize(s);
  }, []);

  useEffect(() => { localStorage.setItem('rblxfinder_lang',lang); document.documentElement.lang=lang; document.documentElement.dataset.rblxLang=lang; translateNode(document.body,lang); }, [lang]);
  useEffect(() => { localStorage.setItem('rblxfinder_theme',theme); document.documentElement.dataset.rblxTheme=theme; document.documentElement.style.colorScheme=theme==='dark'?'dark':'light'; }, [theme]);
  useEffect(() => { localStorage.setItem('rblxfinder_font',font); const map:Record<Font,string>={system:'system-ui,-apple-system,sans-serif',inter:'Inter,system-ui,sans-serif',roboto:'Roboto,Arial,sans-serif',poppins:'Poppins,Inter,sans-serif',mono:'ui-monospace,SFMono-Regular,monospace'}; document.documentElement.style.setProperty('--rblx-font',map[font]); }, [font]);
  useEffect(() => { localStorage.setItem('rblxfinder_font_size',size); document.documentElement.style.setProperty('--rblx-font-size',size==='small'?'14px':size==='large'?'18px':'16px'); }, [size]);
  useEffect(() => { const observer=new MutationObserver(()=>translateNode(document.body,lang)); observer.observe(document.body,{subtree:true,childList:true,characterData:true}); return()=>observer.disconnect(); },[lang]);

  const tx=(vi:string,en:string)=>lang==='vi'?vi:en;
  return <>
    <button aria-label={tx('Cài đặt','Settings')} onClick={()=>setOpen(true)} style={{position:'fixed',right:18,bottom:18,zIndex:9999,width:52,height:52,border:0,borderRadius:16,background:'linear-gradient(135deg,#6353db,#986eff)',color:'#fff',fontSize:23,boxShadow:'0 12px 35px #0003',cursor:'pointer'}}>⚙</button>
    {open&&<div style={{position:'fixed',inset:0,zIndex:10000,background:'#0007',display:'grid',placeItems:'center',padding:18}} onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><section style={{width:'min(560px,100%)',maxHeight:'90vh',overflow:'auto',background:'var(--rblx-settings-bg,#fff)',color:'var(--rblx-settings-fg,#111827)',borderRadius:24,padding:24,boxShadow:'0 30px 80px #0005',fontFamily:'var(--rblx-font,system-ui)',fontSize:'var(--rblx-font-size,16px)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><div><h2 style={{margin:'0 0 5px'}}>{tx('Cài đặt','Settings')}</h2><p style={{margin:0,opacity:.65,fontSize:13}}>{tx('Áp dụng cho cả Web và ứng dụng Android.','Applies to both the Web and Android app.')}</p></div><button onClick={()=>setOpen(false)} style={{border:0,background:'#eef2f7',borderRadius:12,padding:'8px 12px',cursor:'pointer'}}>✕</button></div>
      <div style={{marginTop:22}}><b>{tx('Ngôn ngữ','Language')}</b><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginTop:9}}>{([['vi','🇻🇳 Tiếng Việt'],['en','🇺🇸 English']] as [Lang,string][]).map(([v,l])=><button key={v} onClick={()=>setLang(v)} style={{padding:13,borderRadius:14,border:lang===v?'2px solid #6353db':'1px solid #ddd',background:lang===v?'#f1efff':'transparent',cursor:'pointer',fontWeight:800}}>{l}</button>)}</div></div>
      <div style={{marginTop:20}}><b>{tx('Nền giao diện','Interface background')}</b><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9,marginTop:9}}>{([['light','Sáng','Light'],['dark','Tối','Dark'],['blue','Xanh','Blue'],['purple','Tím','Purple']] as [Theme,string,string][]).map(([v,vi,en])=><button key={v} onClick={()=>setTheme(v)} style={{padding:12,borderRadius:14,border:theme===v?'2px solid #6353db':'1px solid #ddd',background:theme===v?'#f1efff':'transparent',cursor:'pointer',fontWeight:800}}>{tx(vi,en)}</button>)}</div></div>
      <div style={{marginTop:20}}><b>{tx('Phông chữ','Font')}</b><select value={font} onChange={e=>setFont(e.target.value as Font)} style={{width:'100%',marginTop:9,padding:12,borderRadius:14,border:'1px solid #ddd',fontFamily:'var(--rblx-font)'}}>{([['system','Mặc định','Default'],['inter','Inter','Inter'],['roboto','Roboto','Roboto'],['poppins','Poppins','Poppins'],['mono','Mono','Mono']] as [Font,string,string][]).map(([v,vi,en])=><option key={v} value={v}>{tx(vi,en)}</option>)}</select></div>
      <div style={{marginTop:20}}><b>{tx('Cỡ chữ','Font size')}</b><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,marginTop:9}}>{([['small','Nhỏ','Small'],['normal','Bình thường','Normal'],['large','Lớn','Large']] as [Size,string,string][]).map(([v,vi,en])=><button key={v} onClick={()=>setSize(v)} style={{padding:12,borderRadius:14,border:size===v?'2px solid #6353db':'1px solid #ddd',background:size===v?'#f1efff':'transparent',cursor:'pointer',fontWeight:800}}>{tx(vi,en)}</button>)}</div></div>
      <p style={{margin:'20px 0 0',fontSize:12,opacity:.6}}>{tx('Cài đặt được lưu trên thiết bị và giữ nguyên sau khi mở lại.','Settings are saved on this device and persist after reopening.')}</p>
    </section></div>}
    <style jsx global>{`html{font-family:var(--rblx-font,system-ui);font-size:var(--rblx-font-size,16px)}html[data-rblx-theme='dark'] body{background:#0b1020!important;color:#f8fafc!important}html[data-rblx-theme='dark'] .card,html[data-rblx-theme='dark'] section.card{background:#121a2c!important;color:#f8fafc!important;border-color:#26324a!important}html[data-rblx-theme='dark'] input,html[data-rblx-theme='dark'] textarea,html[data-rblx-theme='dark'] select{background:#0f172a!important;color:#f8fafc!important;border-color:#334155!important}html[data-rblx-theme='dark'] .btn{background:#172033!important;color:#f8fafc!important;border-color:#334155!important}html[data-rblx-theme='dark'] .sub,html[data-rblx-theme='dark'] .note,html[data-rblx-theme='dark'] .meta{color:#aab6ca!important}html[data-rblx-theme='dark'] .picker{background:#0b1020!important;color:#f8fafc!important}html[data-rblx-theme='dark'] .pickgrid button{background:#121a2c!important;color:#f8fafc!important;border-color:#26324a!important}html[data-rblx-theme='blue'] body{background:linear-gradient(180deg,#eff6ff,#dbeafe)!important}html[data-rblx-theme='purple'] body{background:linear-gradient(180deg,#faf5ff,#ede9fe)!important}html{--rblx-settings-bg:#fff;--rblx-settings-fg:#111827}html[data-rblx-theme='dark']{--rblx-settings-bg:#121a2c;--rblx-settings-fg:#f8fafc}`}</style>
  </>;
}
