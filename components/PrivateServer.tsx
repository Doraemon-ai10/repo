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
    <section className="panel private-server">
      <div className="private-server-icon">🛡️</div>
      <div className="private-server-copy">
        <span className="eyebrow">PRIVATE SERVER</span>
        <h3>Tạo server riêng</h3>
        <p>
          {enabled === true
            ? `Private Server đang được bật cho ${gameName}. Mở trang game Roblox để tạo server riêng.`
            : enabled === false
              ? 'Game này hiện không bật Private Server.'
              : 'Đang kiểm tra trạng thái Private Server…'}
        </p>
      </div>
      <button
        className="btn primary"
        disabled={enabled !== true}
        onClick={openGame}
      >
        {enabled === true ? 'Tạo Private Server →' : enabled === false ? 'Không khả dụng' : 'Đang kiểm tra…'}
      </button>
    </section>
  );
}
