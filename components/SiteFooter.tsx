'use client';

export default function SiteFooter() {
  return (
    <footer
      aria-label="Noobie copyright"
      style={{
        width: '100%',
        marginTop: 48,
        padding: '28px 20px 34px',
        borderTop: '1px solid #e5e7eb',
        background: 'linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.02em', color: '#111827' }}>
          Noobie
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
          © 2026 Noobie. All rights reserved.
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#94a3b8' }}>
          RBLXFinder — A Noobie Project
        </div>
      </div>
    </footer>
  );
}
