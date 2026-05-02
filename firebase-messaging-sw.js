// ════════════════════════════════════════════════════════════════
// DEEPWORK — Firebase Cloud Messaging Service Worker (E9)
// ════════════════════════════════════════════════════════════════
//
// Questo service worker gestisce le push notifications quando l'app
// è in background o chiusa. Va deployato nella ROOT del sito (stessa
// posizione di deepwork-v3.4.html), come 'firebase-messaging-sw.js'.
//
// Il service worker si registra automaticamente quando l'utente
// concede il permesso notifiche (vedi richiediPermessoPush nell'app).
//
// IMPORTANTE: Aggiorna firebaseConfig sotto con le tue credenziali
// (le stesse del deepwork-v3.4.html, sezione firebaseConfig).
//
// ════════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// IMPORTANTE: deve corrispondere al firebaseConfig dell'app
firebase.initializeApp({
  apiKey: "INCOLLA_QUI_LA_API_KEY_DAL_DEEPWORK_HTML",
  authDomain: "deepwork-app-6c56f.firebaseapp.com",
  projectId: "deepwork-app-6c56f",
  storageBucket: "deepwork-app-6c56f.appspot.com",
  messagingSenderId: "INCOLLA_QUI_IL_SENDER_ID",
  appId: "INCOLLA_QUI_L_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('[FCM SW] Notifica background:', payload);
  const title = payload.notification?.title || payload.data?.title || 'Deepwork';
  const body = payload.notification?.body || payload.data?.body || '';
  const tipo = payload.data?.tipo || 'info';
  const link = payload.data?.link || '/';
  const iconMap = {
    rapportino: '📋',
    messaggio: '💬',
    scadenza: '⏰',
    promemoria: '🔔',
    info: 'ℹ️'
  };
  self.registration.showNotification(`${iconMap[tipo] || '🔔'} ${title}`, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: payload.data?.tag || 'deepwork',
    requireInteraction: tipo === 'scadenza' || tipo === 'rapportino',
    data: { link, tipo, ...payload.data }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const link = event.notification.data?.link || '/';
  event.waitUntil(
    clients.matchAll({type:'window'}).then(clientList => {
      // Se l'app è già aperta in un tab, focus lì
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          client.postMessage({type:'NOTIFICATION_CLICK', link, data: event.notification.data});
          return client.focus();
        }
      }
      // Altrimenti apri nuovo tab
      if (clients.openWindow) {
        return clients.openWindow(link);
      }
    })
  );
});
