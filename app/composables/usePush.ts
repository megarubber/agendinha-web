import urlBase64ToUint8Array from "~/utils/urlBase64ToUint8Array";
import arrayBufferToBase64Legacy from "~/server/utils/arrayBufferToBase64";

export const usePush = async (id_usuario: number) => {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.register("/sw.js");
  const config = useRuntimeConfig();

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 
      urlBase64ToUint8Array(config.public.vapidPublicKey)
  });

  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const subscriptionObject: any = {
    id_usuario,
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64Legacy(subscription.getKey("p256dh")!),
      auth: arrayBufferToBase64Legacy(subscription.getKey("auth")!),
    },
    encoding: PushManager.supportedContentEncodings,
  }
  
  const response = await $api("/salvar-inscricao", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(subscriptionObject),
  });

  return response;
}