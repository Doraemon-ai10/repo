'use client';

import { useEffect, useState } from 'react';
import AIAssistant from './AIAssistant';

export default function AIAssistantMount() {
  const [game,setGame]=useState<'roblox'|'freefire'|null>(null);
  useEffect(()=>{
    const update=()=>{const p=location.pathname.split('/').filter(Boolean); setGame(p[0]==='freefire'?'freefire':p[0]==='roblox'||p[0]==='roblox-plus'?'roblox':null)};
    update(); addEventListener('popstate',update); return()=>removeEventListener('popstate',update);
  },[]);
  return game ? <AIAssistant game={game}/> : null;
}
