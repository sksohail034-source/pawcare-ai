import { api } from '../api';

const VAPID_PUBLIC_KEY = 'BNnynhB1r6Wfn8WSBy1z8CFIxPRJanICT4AEVmKsXxNBpeO3tsaw1ILjjoChaVbGyUWgeXz_cO5NeXX2k52hzT8';

// Track if we've already refreshed subscription in this session
const PUSH_REFRESH_KEY = 'pawcare_push_refreshed_v2';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('[Push] Not supported in this browser.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('[Push] Service Worker ready. Scope:', registration.scope);
    
    // Check if permission is granted
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[Push] Permission denied.');
        return;
      }
    } else if (Notification.permission === 'denied') {
      console.warn('[Push] Notifications blocked by user.');
      return;
    }
    
    let subscription = await registration.pushManager.getSubscription();
    
    // Force refresh subscription once after SW update (to fix stale subscriptions)
    const needsRefresh = !sessionStorage.getItem(PUSH_REFRESH_KEY);
    
    if (subscription && needsRefresh) {
      console.log('[Push] Refreshing stale subscription for new Service Worker...');
      try {
        await subscription.unsubscribe();
        subscription = null;
      } catch (e) {
        console.error('[Push] Unsubscribe failed:', e);
      }
    }
    
    if (!subscription) {
      console.log('[Push] Creating new push subscription...');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      console.log('[Push] New subscription created.');
    }

    // Always send subscription to backend (ensures it's saved after DB resets)
    await api.subscribePush(subscription);
    sessionStorage.setItem(PUSH_REFRESH_KEY, 'true');
    console.log('[Push] ✅ Subscription synced to server successfully.');
    
  } catch (err) {
    console.error('[Push] Subscription failed:', err);
  }
}
