import { NextRequest, NextResponse } from 'next/server';

function answer(game: 'roblox' | 'freefire', q: string) {
  const x = q.toLowerCase().trim();
  if (!x) return 'Hãy hỏi mình một câu nhé.';

  if (game === 'roblox') {
    if (/server|sv|ít người|low.?pop|low population/.test(x)) return 'Muốn tìm server ít người: vào Roblox → Server Finder, nhập Universe ID rồi sắp xếp theo số người. Bản Free vẫn dùng được tìm server công khai và lọc cơ bản; Plus thêm theo dõi server, tự làm mới và bộ lọc nâng cao.';
    if (/username|user.?id|profile|tài khoản|avatar/.test(x)) return 'Bạn có thể nhập username Roblox để lấy User ID, hồ sơ cơ bản và avatar công khai. Không cần mật khẩu hay cookie Roblox.';
    if (/game|trò chơi|game nào|tìm game/.test(x)) return 'Hãy nhập tên hoặc từ khóa game. Mình có thể giúp bạn chọn game theo thể loại, lượng người chơi và thông tin game.';
    if (/plus|free|miễn phí/.test(x)) return 'RBLXFinder Free vẫn giữ các tính năng cốt lõi: username lookup, avatar, tìm game + thumbnail, tìm public server, lọc server ít người cơ bản, cộng đồng, yêu thích và AI Assistant. Plus tập trung vào công cụ nâng cao, không khóa chức năng cơ bản.';
    if (/robux|kiếm robux/.test(x)) return 'Không có cách hợp pháp nào để tạo Robux miễn phí vô hạn. Tránh website yêu cầu mật khẩu, cookie hoặc tải phần mềm lạ.';
    return 'Mình là Roblox Assistant của RBLXFinder. Bạn có thể hỏi về username, avatar, game, server, server ít người, Robux hoặc cách dùng RBLXFinder.';
  }

  if (/sensitivity|độ nhạy|sens|kéo tâm/.test(x)) return 'Vào Sensitivity Lab, chọn đúng thiết bị rồi test trong Training. Preset là điểm bắt đầu; nếu tâm vượt đầu hãy giảm General/Red Dot một chút, nếu kéo không tới đầu hãy tăng từng bước nhỏ.';
  if (/dpi/.test(x)) return 'DPI chỉ là một phần của cảm giác chuột/cảm ứng. Hãy giữ DPI ổn định rồi chỉnh sensitivity từng bước để tránh thay đổi quá nhiều thứ cùng lúc.';
  if (/hud|nút|fire button|nút bắn/.test(x)) return 'Ưu tiên đặt nút bắn ở vị trí ngón tay chạm tự nhiên, đủ lớn để không hụt nhưng không che mục tiêu. Test vài trận rồi mới tinh chỉnh.';
  if (/headshot|one.?tap|hs|bắn đầu/.test(x)) return 'Muốn kéo tâm ổn định: kéo ngắn và đều, không đổi sens liên tục, giữ FPS ổn định và luyện trong Training. Không có một bộ sens phù hợp tuyệt đối cho mọi máy.';
  return 'Mình là Free Fire Assistant của RBLXFinder. Bạn có thể hỏi về sensitivity, DPI, nút bắn, HUD, kéo tâm/headshot hoặc cách dùng Sensitivity Lab. Free Fire không có Plus.';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const game = body?.game === 'freefire' ? 'freefire' : 'roblox';
    const question = String(body?.message || '').slice(0, 1000);
    return NextResponse.json({ game, answer: answer(game, question), mode: 'free' });
  } catch {
    return NextResponse.json({ error: 'Assistant request failed' }, { status: 400 });
  }
}
