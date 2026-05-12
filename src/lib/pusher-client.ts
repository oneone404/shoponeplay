// Dùng require để đảm bảo tương thích hoàn toàn với Next.js/Turbopack
const Pusher = require("pusher-js");

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    enabledTransports: ['ws', 'wss'],
  }
);
