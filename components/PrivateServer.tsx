'use client';

type PrivateServerProps = {
  gameName: string;
  rootPlaceId: number;
  enabled: boolean | null;
};

const ROBLOX = 'https://www.roblox.com';

export default function PrivateServer({ gameName, rootPlaceId, enabled }: PrivateServerProps) {
  const openGame = () => {
    window.open(`${ROBLOX}/games/${rootPlaceId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      className="panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: 22,
        margin: '20px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg,#6756df,#47c7e3)',
          color: '#fff',
          fontSize: 28,
          flex: '0 0 auto',
          boxShadow: '0 12px 30px rgba(103,86,223,.22)',
        }}
      >
        🛡️
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="eyebrow">PRIVATE SERVER</span>
        <h3 style={{ margin: '5px 0 6px', fontSize: 22 }}>Private Server</h3>
        <p style={{ margin: '0 0 10px', color: '#73778a', lineHeight: 1.6 }}>
          {enabled === true
            ? `Game này đang bật Private Server. Bạn có thể tạo server riêng cho ${gameName} trên Roblox.`
            : enabled === false
              ? 'Game này hiện không bật Private Server. Roblox không cho phép tạo server riêng cho game này.'
              : 'Đang kiểm tra trạng thái Private Server…'}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', fontSize: 12 }}>
          <strong style={{ color: enabled === true ? '#16a34a' : enabled === false ? '#dc2626' : '#777b8a' }}>
            {enabled === true ? '✓ Được hỗ trợ' : enabled === false ? '✕ Không khả dụng' : '⏳ Đang kiểm tra'}
          </strong>
          <span style={{ color: '#9296a4' }}>Giá server do creator game đặt</span>
        </div>
      </div>
      <button
        className="btn primary"
        disabled={enabled !== true}
        onClick={openGame}
        style={{ flex: '0 0 auto' }}
      >
        {enabled === true ? '🛡️ Tạo Private Server →' : enabled === false ? 'Không khả dụng' : 'Đang kiểm tra…'}
      </button>
    </section>
  );
}
