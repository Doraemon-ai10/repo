package com.noobie.rblxfinder

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.Window
import android.webkit.WebChromeClient
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
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.databaseEnabled = true
        web.settings.mediaPlaybackRequiresUserGesture = false
        web.settings.allowFileAccess = false
        web.settings.allowContentAccess = true
        web.settings.setSupportZoom(false)
        web.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                view.evaluateJavascript(nativeSettingsScript(), null)
            }
        }
        web.webChromeClient = WebChromeClient()
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")
    }

    private fun nativeSettingsScript(): String = """
      (function(){
        if(window.__rblxSettingsInstalled)return; window.__rblxSettingsInstalled=true;
        const P={
          'Home':'Trang chủ','Daily':'Hằng ngày','Compare':'So sánh','About':'Giới thiệu','Community':'Cộng đồng',
          'Find games':'Tìm game','Servers':'Máy chủ','Search':'Tìm','Find username':'Tìm username','Find servers':'Tìm server',
          'Profile Scanner':'Quét hồ sơ','Game Intelligence':'Thông tin game','Low-Pop Server Finder':'Tìm máy chủ ít người',
          'Game Compare':'So sánh game','Saved Games':'Game đã lưu','Level & XP':'Cấp độ & XP','Aim Challenge':'Thử thách ngắm',
          'Sensitivity Lab':'Phòng chỉnh độ nhạy','HUD Builder':'Tạo HUD','Daily Challenges':'Thử thách hằng ngày',
          'AI Assistant':'Trợ lý AI','Open game':'Mở game','Copy':'Sao chép','Save':'Lưu','Loading':'Đang tải',
          'Roblox Tools':'Công cụ Roblox','Free Fire Tools':'Công cụ Free Fire','Roblox Power Tools':'Công cụ Roblox nâng cao',
          'Username Roblox':'Tên người dùng Roblox','Game name':'Tên game','Universe ID':'Universe ID','Post':'Đăng bài',
          'Create post':'Tạo bài đăng','Display name':'Tên hiển thị','Post title':'Tên bài đăng','Device':'Thiết bị',
          'Fire button %':'Nút bắn %','Support Creator':'Ủng hộ Creator','Top up diamonds':'Nạp kim cương',
          'Roblox Plus':'Roblox Plus','Plus Center':'Trung tâm Plus','Creator':'Creator','Free Fire':'Free Fire'
        };
        const R=Object.fromEntries(Object.entries(P).map(([a,b])=>[b,a]));
        function tr(){const lang=localStorage.getItem('rblxfinder_lang')||'vi'; document.documentElement.lang=lang;
          document.querySelectorAll('body *').forEach(el=>{if(el.children.length) return; if(el.tagName==='SCRIPT'||el.tagName==='STYLE')return;
            const raw=(el.textContent||'').trim(); if(!raw)return; const v=lang==='en'?P[raw]:R[raw]; if(v)el.textContent=v;
          });
          document.querySelectorAll('input,textarea').forEach(el=>{const raw=el.placeholder||'';const v=lang==='en'?P[raw]:R[raw];if(v)el.placeholder=v;});
        }
        function css(){const t=localStorage.getItem('rblxfinder_theme')||'light',f=localStorage.getItem('rblxfinder_font')||'system',s=localStorage.getItem('rblxfinder_font_size')||'normal';
          const fonts={system:'system-ui,-apple-system,sans-serif',inter:'Inter,system-ui,sans-serif',roboto:'Roboto,Arial,sans-serif',poppins:'Poppins,Inter,sans-serif',mono:'ui-monospace,SFMono-Regular,monospace'};
          const sizes={small:'14px',normal:'16px',large:'18px'}; document.documentElement.style.setProperty('--rblx-font',fonts[f]||fonts.system); document.documentElement.style.setProperty('--rblx-font-size',sizes[s]||sizes.normal);
          document.body.style.fontFamily='var(--rblx-font)'; document.body.style.fontSize='var(--rblx-font-size)';
          document.body.style.background=t==='dark'?'#0b1020':t==='blue'?'linear-gradient(180deg,#eff6ff,#dbeafe)':t==='purple'?'linear-gradient(180deg,#faf5ff,#ede9fe)':'linear-gradient(180deg,#f8fbff,#fff)';
          document.body.style.color=t==='dark'?'#f8fafc':'#111827';
          document.querySelectorAll('.card,.top').forEach(e=>{if(t==='dark'){e.style.background='#121a2c';e.style.color='#f8fafc';e.style.borderColor='#26324a'}else{e.style.color='#111827'}});
        }
        window.__rblxOpenSettings=function(){
          let old=document.getElementById('rblx-native-settings'); if(old){old.remove();return}
          const lang=localStorage.getItem('rblxfinder_lang')||'vi',tx=(v,e)=>lang==='vi'?v:e;
          const box=document.createElement('div');box.id='rblx-native-settings';box.style.cssText='position:fixed;inset:0;z-index:99999;background:#0008;display:flex;align-items:center;justify-content:center;padding:16px';
          box.innerHTML='<section style="width:min(560px,100%);max-height:90vh;overflow:auto;background:#fff;color:#111827;border-radius:24px;padding:22px;font-family:var(--rblx-font);font-size:var(--rblx-font-size)"><div style="display:flex;justify-content:space-between;align-items:center"><div><h2 style="margin:0 0 6px">'+tx('Cài đặt','Settings')+'</h2><p style="margin:0;opacity:.65">'+tx('Ngôn ngữ, nền và phông chữ','Language, background and font')+'</p></div><button id="rsClose">✕</button></div><h3>'+tx('Ngôn ngữ','Language')+'</h3><div style="display:flex;gap:8px"><button id="rsVi">🇻🇳 Tiếng Việt</button><button id="rsEn">🇺🇸 English</button></div><h3>'+tx('Nền giao diện','Interface background')+'</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button data-theme="light">'+tx('Sáng','Light')+'</button><button data-theme="dark">'+tx('Tối','Dark')+'</button><button data-theme="blue">'+tx('Xanh','Blue')+'</button><button data-theme="purple">'+tx('Tím','Purple')+'</button></div><h3>'+tx('Phông chữ','Font')+'</h3><select id="rsFont" style="width:100%;padding:10px"><option value="system">'+tx('Mặc định','Default')+'</option><option value="inter">Inter</option><option value="roboto">Roboto</option><option value="poppins">Poppins</option><option value="mono">Mono</option></select><h3>'+tx('Cỡ chữ','Font size')+'</h3><div style="display:flex;gap:8px"><button data-size="small">'+tx('Nhỏ','Small')+'</button><button data-size="normal">'+tx('Bình thường','Normal')+'</button><button data-size="large">'+tx('Lớn','Large')+'</button></div><p style="opacity:.6;font-size:12px">'+tx('Cài đặt được lưu trên thiết bị.','Settings are saved on this device.')+'</p></section>';
          document.body.appendChild(box);
          box.querySelector('#rsClose').onclick=()=>box.remove(); box.querySelector('#rsVi').onclick=()=>{localStorage.rblxfinder_lang='vi';location.reload()}; box.querySelector('#rsEn').onclick=()=>{localStorage.rblxfinder_lang='en';location.reload()};
          box.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{localStorage.rblxfinder_theme=b.dataset.theme;css()}); box.querySelector('#rsFont').value=localStorage.rblxfinder_font||'system'; box.querySelector('#rsFont').onchange=e=>{localStorage.rblxfinder_font=e.target.value;css()}; box.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{localStorage.rblxfinder_font_size=b.dataset.size;css()});
        };
        const b=document.createElement('button');b.textContent='⚙';b.title='Settings';b.onclick=window.__rblxOpenSettings;b.style.cssText='position:fixed;right:16px;bottom:16px;z-index:99998;width:52px;height:52px;border:0;border-radius:16px;background:linear-gradient(135deg,#6353db,#986eff);color:#fff;font-size:22px;box-shadow:0 12px 35px #0005';document.body.appendChild(b);
        css();tr();new MutationObserver(()=>tr()).observe(document.body,{subtree:true,childList:true,characterData:true});
      })();
    """.trimIndent()

    @Suppress("DEPRECATION")
    override fun onBackPressed() { if (web.canGoBack()) web.goBack() else super.onBackPressed() }
}
