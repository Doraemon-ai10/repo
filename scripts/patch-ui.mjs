import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const pagePath = 'app/page.tsx';
const cssPath = 'app/globals.css';

if (existsSync(pagePath)) {
  let s = readFileSync(pagePath, 'utf8');
  s = s.replace(
    "onClick={()=>window.open(`${ROBLOX}/games/`,'_blank')}",
    "onClick={()=>window.open('https://www.roblox.com/vi/game-pass/1969017688/7-robux','_blank')}"
  );
  s = s.replace(
    "onClick={()=>window.open(ROBLOX,'_blank')}",
    "onClick={()=>{api('username',{username:'khoungbell7777'}).then(d=>{const id=d?.data?.[0]?.id;if(id){location.href=`roblox://navigation/profile_card?userId=${id}`;setTimeout(()=>location.href=`${ROBLOX}/users/${id}/profile`,1200)}})}}"
  );
  writeFileSync(pagePath, s);
}

if (existsSync(cssPath)) {
  let css = readFileSync(cssPath, 'utf8');
  css = css.replace(
    '.ghost{background:rgba(255,255,255,.86);border-color:var(--line);color:#4e5261;box-shadow:0 8px 22px rgba(32,32,64,.06)}',
    '.ghost{background:linear-gradient(135deg,#f7f4ff,#eefaff);border-color:#d9d3ff;color:#5d50cf;box-shadow:0 10px 26px rgba(88,73,190,.11)}.ghost:hover{background:linear-gradient(135deg,#eeeaff,#e5f9ff);border-color:#c9c0ff;color:#4d40bd;box-shadow:0 15px 32px rgba(88,73,190,.16)}'
  );
  if (!css.includes('.site:after{')) {
    css += '.site:after{content:"© 2026 Noobie. All rights reserved.";display:block;text-align:center;padding:30px 22px 36px;color:#85899a;font-size:12px;font-weight:850;letter-spacing:.35px;border-top:1px solid rgba(224,223,236,.85);background:linear-gradient(180deg,rgba(255,255,255,.2),rgba(241,240,250,.72))}.donate .btn{min-width:170px}.donate .primary{background:linear-gradient(135deg,#6552e8,#a16aff 58%,#45cbe7)}';
  }
  writeFileSync(cssPath, css);
}
