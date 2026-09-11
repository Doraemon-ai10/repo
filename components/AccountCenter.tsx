'use client';

import { useEffect, useMemo, useState } from 'react';

const SB='https://mbsnpcdmenfufhbctoek.supabase.co';
const KEY='sb_publishable_rwwoH9hpk6cg3woGveNObw_C00pNZsx';
const authHeaders=(token?:string)=>({apikey:KEY,Authorization:'Bearer '+(token||KEY),'Content-Type':'application/json'});
const AUTH=SB+'/auth/v1/';
const DATA=SB+'/rest/v1/rblxfinder_user_data';

function collectLocal(){
  const out:any={};
  if(typeof window==='undefined')return out;
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k.startsWith('rblxfinder_auth_'))continue;try{out[k]=JSON.parse(localStorage.getItem(k)||'null')}catch{out[k]=localStorage.getItem(k)}}
  return out;
}
function restoreLocal(data:any){if(typeof window==='undefined'||!data)return;Object.entries(data).forEach(([k,v])=>{try{localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v))}catch{}})}

export default function AccountCenter(){
 const [open,setOpen]=useState(false),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
 const [session,setSession]=useState<any>(null),[cloud,setCloud]=useState(false);
 const user=useMemo(()=>session?.user||null,[session]);
 useEffect(()=>{try{const s=JSON.parse(localStorage.getItem('rblxfinder_auth_session')||'null');if(s?.access_token)setSession(s)}catch{}},[]);
 const sync=async(s:any,upload=false)=>{if(!s?.access_token||!s?.user?.id)return;try{if(!upload){const r=await fetch(DATA+'?select=data&user_id=eq.'+encodeURIComponent(s.user.id),{headers:authHeaders(s.access_token)});if(r.ok){const rows=await r.json();if(rows[0]?.data){restoreLocal(rows[0].data);setCloud(true)}}}else{const body={user_id:s.user.id,data:collectLocal(),updated_at:new Date().toISOString()};const r=await fetch(DATA,{method:'POST',headers:{...authHeaders(s.access_token),Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});setCloud(r.ok)}}catch{setCloud(false)}};
 useEffect(()=>{if(!session)return;sync(session,false);const t=setInterval(()=>sync(session,true),15000);const save=()=>sync(session,true);window.addEventListener('beforeunload',save);return()=>{clearInterval(t);window.removeEventListener('beforeunload',save)}},[session]);
 const signIn=async()=>{setBusy(true);setMsg('');try{const r=await fetch(AUTH+'token?grant_type=password',{method:'POST',headers:authHeaders(),body:JSON.stringify({email:email.trim(),password})});const d=await r.json();if(!r.ok)throw Error(d.error_description||d.msg||'Đăng nhập thất bại');localStorage.setItem('rblxfinder_auth_session',JSON.stringify(d));setSession(d);setMsg('Đăng nhập thành công');}catch(e:any){setMsg(e.message||'Đăng nhập thất bại')}finally{setBusy(false)}};
 const signUp=async()=>{setBusy(true);setMsg('');try{const r=await fetch(AUTH+'signup',{method:'POST',headers:authHeaders(),body:JSON.stringify({email:email.trim(),password})});const d=await r.json();if(!r.ok)throw Error(d.msg||d.error_description||'Đăng ký thất bại');if(d.access_token){localStorage.setItem('rblxfinder_auth_session',JSON.stringify(d));setSession(d);setMsg('Tạo tài khoản thành công')}else setMsg('Tài khoản đã tạo. Nếu hệ thống yêu cầu, hãy xác nhận email rồi đăng nhập.')}catch(e:any){setMsg(e.message||'Đăng ký thất bại')}finally{setBusy(false)}};
 const logout=()=>{localStorage.removeItem('rblxfinder_auth_session');setSession(null);setCloud(false);setMsg('Đã đăng xuất')};
 return <>
   <button aria-label="Tài khoản" onClick={()=>setOpen(true)} style={{position:'fixed',right:18,bottom:88,zIndex:9997,border:0,borderRadius:16,padding:'11px 14px',background:'#0b63f6',color:'#fff',fontWeight:800,boxShadow:'0 10px 28px #0b63f633'}}>{user?'☁️ '+(user.email||'Tài khoản').split('@')[0]:'👤 Tài khoản'}</button>
   {open&&<div style={{position:'fixed',inset:0,zIndex:100000,background:'#0008',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
    <div style={{width:'min(520px,100%)',background:'var(--card,#fff)',color:'var(--text,#111827)',borderRadius:24,padding:24,boxShadow:'0 25px 80px #0005'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><h2 style={{margin:0}}>Tài khoản RBLXFinder</h2><p style={{margin:'6px 0',opacity:.65}}>Web và APK dùng chung dữ liệu Supabase.</p></div><button onClick={()=>setOpen(false)}>✕</button></div>
      {user?<><div style={{padding:14,borderRadius:14,background:'#eef6ff',marginTop:14}}><b>{user.email}</b><div style={{fontSize:13,marginTop:4}}>☁️ Cloud Sync: {cloud?'Đang hoạt động':'Đang kết nối...'}</div></div><button className="btn" style={{marginTop:14}} onClick={()=>sync(session,true)}>Đồng bộ ngay</button><button className="btn ghost" style={{marginTop:8}} onClick={logout}>Đăng xuất</button></>:<>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:'100%',boxSizing:'border-box',marginTop:16,padding:13,borderRadius:12,border:'1px solid #ccd5e1'}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu" type="password" style={{width:'100%',boxSizing:'border-box',marginTop:10,padding:13,borderRadius:12,border:'1px solid #ccd5e1'}}/>
        <div style={{display:'flex',gap:10,marginTop:12}}><button className="btn" disabled={busy} onClick={signIn}>Đăng nhập</button><button className="btn ghost" disabled={busy} onClick={signUp}>Đăng ký</button></div>
      </>}
      {msg&&<p style={{marginBottom:0,fontWeight:700}}>{msg}</p>}
      <p style={{fontSize:12,opacity:.6,marginBottom:0}}>Chỉ dữ liệu ứng dụng trong bộ nhớ cục bộ được đồng bộ; token đăng nhập không được tải lên bảng dữ liệu.</p>
    </div>
   </div>}
 </>;
}
