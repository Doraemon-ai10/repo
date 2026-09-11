package com.noobie.rblxfinder

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.Window
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        web = WebView(this)
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            setSupportZoom(false)
            cacheMode = WebSettings.LOAD_DEFAULT
        }
        web.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                view.evaluateJavascript(nativeEnhancementScript(), null)
            }
        }
        web.webChromeClient = WebChromeClient()
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")
    }

    private fun nativeEnhancementScript(): String = """
      (function(){
        if(window.__rblxNativeReady)return; window.__rblxNativeReady=true;
        const SB='https://mbsnpcdmenfufhbctoek.supabase.co';
        const KEY='sb_publishable_rwwoH9hpk6cg3woGveNObw_C00pNZsx';
        const DATA=SB+'/rest/v1/rblxfinder_user_data';
        const AUTH=SB+'/auth/v1/';
        const h=(token)=>({apikey:KEY,Authorization:'Bearer '+(token||KEY),'Content-Type':'application/json'});
        const visitor=()=>{let x=localStorage.getItem('rblx_visitor_id');if(!x){x=(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random());localStorage.setItem('rblx_visitor_id',x)}return x};
        const collect=()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k==='rblxfinder_auth_session'||k.startsWith('rblxfinder_auth_'))continue;try{o[k]=JSON.parse(localStorage.getItem(k)||'null')}catch{o[k]=localStorage.getItem(k)}}return o};
        const restore=(o)=>{if(!o)return;Object.entries(o).forEach(([k,v])=>{try{localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v))}catch{}})};
        const getSession=()=>{try{return JSON.parse(localStorage.getItem('rblxfinder_auth_session')||'null')}catch{return null}};
        async function pull(s){if(!s?.access_token||!s?.user?.id)return false;try{const r=await fetch(DATA+'?select=data&user_id=eq.'+encodeURIComponent(s.user.id),{headers:h(s.access_token)});if(!r.ok)return false;const a=await r.json();if(a[0]?.data)restore(a[0].data);return true}catch{return false}}
        async function push(s){if(!s?.access_token||!s?.user?.id)return false;try{const r=await fetch(DATA,{method:'POST',headers:{...h(s.access_token),Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:s.user.id,data:collect(),updated_at:new Date().toISOString()})});return r.ok}catch{return false}}
        window.__rblxCloudSync=()=>{const s=getSession();return s?push(s):Promise.resolve(false)};

        // IMPORTANT: no permanent MutationObserver. The old observer repeatedly rewrote DOM text
        // and could lock the WebView after a button click. Translation now runs once per load.
        const P={'Home':'Trang chủ','Daily':'Hằng ngày','Compare':'So sánh','About':'Giới thiệu','Community':'Cộng đồng','Find games':'Tìm game','Servers':'Máy chủ','Search':'Tìm','Find username':'Tìm username','Find servers':'Tìm server','Profile Scanner':'Quét hồ sơ','Game Intelligence':'Thông tin game','Low-Pop Server Finder':'Tìm máy chủ ít người','Game Compare':'So sánh game','Saved Games':'Game đã lưu','Level & XP':'Cấp độ & XP','Aim Challenge':'Thử thách ngắm','Sensitivity Lab':'Phòng chỉnh độ nhạy','HUD Builder':'Tạo HUD','Daily Challenges':'Thử thách hằng ngày','AI Assistant':'Trợ lý AI','Open game':'Mở game','Copy':'Sao chép','Save':'Lưu','Loading':'Đang tải','Roblox Tools':'Công cụ Roblox','Free Fire Tools':'Công cụ Free Fire','Roblox Power Tools':'Công cụ Roblox nâng cao','Username Roblox':'Tên người dùng Roblox','Game name':'Tên game','Universe ID':'Universe ID','Post':'Đăng bài','Create post':'Tạo bài đăng','Display name':'Tên hiển thị','Post title':'Tên bài đăng','Device':'Thiết bị','Fire button %':'Nút bắn %','Support Creator':'Ủng hộ Creator','Top up diamonds':'Nạp kim cương','Roblox Plus':'Roblox Plus','Plus Center':'Trung tâm Plus','Creator':'Creator','Free Fire':'Free Fire'};
        const R=Object.fromEntries(Object.entries(P).map(([a,b])=>[b,a]));
        function translate(){const lang=localStorage.getItem('rblxfinder_lang')||'vi';document.documentElement.lang=lang;document.querySelectorAll('body *').forEach(el=>{if(el.children.length||el.tagName==='SCRIPT'||el.tagName==='STYLE')return;const raw=(el.textContent||'').trim();const v=lang==='en'?P[raw]:R[raw];if(v&&v!==raw)el.textContent=v});document.querySelectorAll('input,textarea').forEach(el=>{const raw=el.placeholder||'';const v=lang==='en'?P[raw]:R[raw];if(v)el.placeholder=v})}
        function css(){const t=localStorage.getItem('rblxfinder_theme')||'light',f=localStorage.getItem('rblxfinder_font')||'system',s=localStorage.getItem('rblxfinder_font_size')||'normal';const fonts={system:'system-ui,-apple-system,sans-serif',inter:'Inter,system-ui,sans-serif',roboto:'Roboto,Arial,sans-serif',poppins:'Poppins,Inter,sans-serif',mono:'ui-monospace,SFMono-Regular,monospace'};const sizes={small:'14px',normal:'16px',large:'18px'};document.documentElement.style.setProperty('--rblx-font',fonts[f]||fonts.system);document.documentElement.style.setProperty('--rblx-font-size',sizes[s]||sizes.normal);document.body.style.fontFamily='var(--rblx-font)';document.body.style.fontSize='var(--rblx-font-size)';document.body.style.background=t==='dark'?'#0b1020':t==='blue'?'linear-gradient(180deg,#eff6ff,#dbeafe)':t==='purple'?'linear-gradient(180deg,#faf5ff,#ede9fe)':'linear-gradient(180deg,#f8fbff,#fff)';document.body.style.color=t==='dark'?'#f8fafc':'#111827'}
        function close(id){const e=document.getElementById(id);if(e)e.remove()}
        window.__rblxOpenSettings=function(){let old=document.getElementById('rblx-native-settings');if(old){old.remove();return}const lang=localStorage.getItem('rblxfinder_lang')||'vi',tx=(v,e)=>lang==='vi'?v:e;const box=document.createElement('div');box.id='rblx-native-settings';box.style.cssText='position:fixed;inset:0;z-index:99999;background:#0008;display:flex;align-items:center;justify-content:center;padding:16px';box.innerHTML='<section style="width:min(560px,100%);max-height:90vh;overflow:auto;background:#fff;color:#111827;border-radius:24px;padding:22px;font-family:var(--rblx-font);font-size:var(--rblx-font-size)"><div style="display:flex;justify-content:space-between;align-items:center"><div><h2 style="margin:0 0 6px">'+tx('Cài đặt','Settings')+'</h2><p style="margin:0;opacity:.65">'+tx('Ngôn ngữ, nền và phông chữ','Language, background and font')+'</p></div><button id="rsClose">✕</button></div><h3>'+tx('Ngôn ngữ','Language')+'</h3><div style="display:flex;gap:8px"><button id="rsVi">Tiếng Việt</button><button id="rsEn">English</button></div><h3>'+tx('Nền giao diện','Interface background')+'</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button data-theme="light">'+tx('Sáng','Light')+'</button><button data-theme="dark">'+tx('Tối','Dark')+'</button><button data-theme="blue">'+tx('Xanh','Blue')+'</button><button data-theme="purple">'+tx('Tím','Purple')+'</button></div><h3>'+tx('Phông chữ','Font')+'</h3><select id="rsFont" style="width:100%;padding:10px"><option value="system">Mặc định</option><option value="inter">Inter</option><option value="roboto">Roboto</option><option value="poppins">Poppins</option><option value="mono">Mono</option></select><h3>'+tx('Cỡ chữ','Font size')+'</h3><div style="display:flex;gap:8px"><button data-size="small">Nhỏ</button><button data-size="normal">Bình thường</button><button data-size="large">Lớn</button></div></section>';document.body.appendChild(box);box.querySelector('#rsClose').onclick=()=>box.remove();box.querySelector('#rsVi').onclick=()=>{localStorage.rblxfinder_lang='vi';location.reload()};box.querySelector('#rsEn').onclick=()=>{localStorage.rblxfinder_lang='en';location.reload()};box.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{localStorage.rblxfinder_theme=b.dataset.theme;css()});box.querySelector('#rsFont').value=localStorage.rblxfinder_font||'system';box.querySelector('#rsFont').onchange=e=>{localStorage.rblxfinder_font=e.target.value;css()};box.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{localStorage.rblxfinder_font_size=b.dataset.size;css()})};
        window.__rblxOpenAccount=async function(){let old=document.getElementById('rblx-native-account');if(old){old.remove();return}const box=document.createElement('div');box.id='rblx-native-account';box.style.cssText='position:fixed;inset:0;z-index:99998;background:#0008;display:flex;align-items:center;justify-content:center;padding:16px';box.innerHTML='<section style="width:min(520px,100%);max-height:90vh;overflow:auto;background:#fff;color:#111827;border-radius:24px;padding:22px;font-family:var(--rblx-font);font-size:var(--rblx-font-size)"><div style="display:flex;justify-content:space-between"><div><h2 style="margin:0">Tài khoản RBLXFinder</h2><p style="opacity:.65">Web + APK dùng chung dữ liệu Supabase.</p></div><button id="raClose">✕</button></div><div id="raBody"></div></section>';document.body.appendChild(box);box.querySelector('#raClose').onclick=()=>box.remove();const body=box.querySelector('#raBody');const s=getSession();if(s?.user){body.innerHTML='<div style="padding:14px;background:#eef6ff;border-radius:14px"><b>'+((s.user.email)||'Tài khoản')+'</b><div id="raSync" style="font-size:13px;margin-top:5px">☁️ Đang đồng bộ...</div></div><button id="raSyncBtn" style="margin-top:12px;padding:12px;border:0;border-radius:12px;background:#0b63f6;color:white;font-weight:800">Đồng bộ ngay</button><button id="raOut" style="margin:12px 0 0 8px;padding:12px;border:1px solid #ccd5e1;border-radius:12px;background:white">Đăng xuất</button>';const ok=await pull(s);body.querySelector('#raSync').textContent=ok?'☁️ Đã tải dữ liệu cloud':'☁️ Chưa có dữ liệu cloud';body.querySelector('#raSyncBtn').onclick=async()=>{body.querySelector('#raSync').textContent=await push(s)?'☁️ Đã đồng bộ':'⚠️ Đồng bộ thất bại'};body.querySelector('#raOut').onclick=()=>{localStorage.removeItem('rblxfinder_auth_session');location.reload()};return}body.innerHTML='<input id="raEmail" type="email" placeholder="Email" style="width:100%;box-sizing:border-box;padding:13px;margin-top:12px;border-radius:12px;border:1px solid #ccd5e1"><input id="raPass" type="password" placeholder="Mật khẩu" style="width:100%;box-sizing:border-box;padding:13px;margin-top:10px;border-radius:12px;border:1px solid #ccd5e1"><div style="display:flex;gap:10px;margin-top:12px"><button id="raLogin" style="padding:12px 16px;border:0;border-radius:12px;background:#0b63f6;color:#fff;font-weight:800">Đăng nhập</button><button id="raSignup" style="padding:12px 16px;border:1px solid #ccd5e1;border-radius:12px;background:#fff;font-weight:800">Đăng ký</button></div><p id="raMsg" style="font-weight:700"></p>';const act=async(type)=>{const email=body.querySelector('#raEmail').value.trim(),password=body.querySelector('#raPass').value;if(!email||!password){body.querySelector('#raMsg').textContent='Nhập email và mật khẩu';return}body.querySelector('#raMsg').textContent='Đang xử lý...';try{const r=await fetch(AUTH+(type==='login'?'token?grant_type=password':'signup'),{method:'POST',headers:h(),body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw Error(d.error_description||d.msg||'Không thành công');if(!d.access_token){body.querySelector('#raMsg').textContent='Đã tạo tài khoản. Hãy xác nhận email nếu được yêu cầu rồi đăng nhập.';return}localStorage.setItem('rblxfinder_auth_session',JSON.stringify(d));await pull(d);await push(d);location.reload()}catch(e){body.querySelector('#raMsg').textContent=e.message||'Không thành công'}};body.querySelector('#raLogin').onclick=()=>act('login');body.querySelector('#raSignup').onclick=()=>act('signup')};
        translate();css();
        const settings=document.createElement('button');settings.textContent='⚙';settings.title='Settings';settings.onclick=window.__rblxOpenSettings;settings.style.cssText='position:fixed;right:16px;bottom:16px;z-index:99990;width:52px;height:52px;border:0;border-radius:16px;background:linear-gradient(135deg,#6353db,#986eff);color:#fff;font-size:22px;box-shadow:0 12px 35px #0005';document.body.appendChild(settings);
        const account=document.createElement('button');account.textContent=getSession()?'☁️':'👤';account.title='Account / Cloud Sync';account.onclick=window.__rblxOpenAccount;account.style.cssText='position:fixed;right:16px;bottom:78px;z-index:99990;width:52px;height:52px;border:0;border-radius:16px;background:#0b63f6;color:#fff;font-size:21px;box-shadow:0 12px 35px #0005';document.body.appendChild(account);
        setTimeout(()=>{const s=getSession();if(s)push(s)},2500);setInterval(()=>{const s=getSession();if(s)push(s)},15000);
      })();
    """.trimIndent()

    @Suppress("DEPRECATION")
    override fun onBackPressed() { if (web.canGoBack()) web.goBack() else super.onBackPressed() }
}
