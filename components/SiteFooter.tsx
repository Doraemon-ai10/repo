'use client';

export default function SiteFooter() {
  return (
    <footer aria-label="Noobie copyright" style={{width:'100%',marginTop:48,padding:'28px 20px 34px',borderTop:'1px solid #e5e7eb',background:'linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)',textAlign:'center'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <div style={{fontSize:18,fontWeight:900,color:'#111827'}}>Noobie</div>
        <a href="/tools/" style={{display:'inline-block',marginTop:10,padding:'9px 13px',borderRadius:11,background:'#eff6ff',color:'#2563eb',fontSize:13,fontWeight:900,textDecoration:'none'}}>⚡ Mở Noobie Game Hub</a>
        <div style={{marginTop:9,fontSize:13,color:'#64748b'}}>© 2026 Noobie. All rights reserved.</div>
        <div style={{marginTop:4,fontSize:12,color:'#94a3b8'}}>RBLXFinder — A Noobie Project</div>
      </div>
    </footer>
  );
}
