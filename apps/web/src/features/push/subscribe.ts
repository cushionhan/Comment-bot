const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

function base64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padded = base64String.padEnd(base64String.length + ((4 - (base64String.length % 4)) % 4), '=');
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const bytes = Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

export async function subscribePush(userId: string): Promise<void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push is not supported in this browser.');
  }

  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToArrayBuffer(VAPID_PUBLIC_KEY),
  });

  await fetch(`/api/push/${userId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription }),
  });
}
