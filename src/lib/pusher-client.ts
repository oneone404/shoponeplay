// Cách import an toàn nhất cho Next.js 16 / Turbopack
const Pusher = require("pusher-js");

// Đảm bảo lấy đúng constructor dù bundler có bọc hay không
const PusherConstructor = Pusher.default || Pusher;

export const pusherClient = new PusherConstructor(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    enabledTransports: ['ws', 'wss'],
  }
);
