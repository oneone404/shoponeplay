import Pusher from "pusher-js";

// Fix for "default is not a constructor" error in Next.js/Turbopack
const PusherClass = (Pusher as any).default || Pusher;

export const pusherClient = new PusherClass(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    enabledTransports: ['ws', 'wss'], // Tối ưu cho môi trường web
  }
);
