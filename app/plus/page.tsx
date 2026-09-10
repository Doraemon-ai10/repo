'use client';

import { useEffect } from 'react';

export default function PlusEntry() {
  useEffect(() => { window.location.replace('/creator'); }, []);
  return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',fontFamily:'system-ui'}}>Đang mở RBLXFinder Plus…</main>;
}
