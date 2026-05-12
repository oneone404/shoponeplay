import Pusher from "pusher";
import { getSiteConfig } from "./configUtils";

let pusherInstance: Pusher | null = null;

export async function getPusherServer() {
  if (pusherInstance) return pusherInstance;

  const config = await getSiteConfig();
  
  pusherInstance = new Pusher({
    appId: config.PUSHER_APP_ID || process.env.PUSHER_APP_ID!,
    key: config.PUSHER_KEY || process.env.PUSHER_KEY!,
    secret: config.PUSHER_SECRET || process.env.PUSHER_SECRET!,
    cluster: config.PUSHER_CLUSTER || process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });

  return pusherInstance;
}

// For legacy compatibility, we can't export a constant that needs await.
// We'll update the callers to use getPusherServer().
