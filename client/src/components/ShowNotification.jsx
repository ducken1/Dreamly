// src/components/ShowNotification.js

export function ShowNotification(title, body) {
  if (!('Notification' in window)) {
    console.warn('Brskalnik ne podpira sistemskih obvestil.');
    return;
  }

  // Zahtevaj dovoljenje, če ga še ni
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Če je dovoljeno, prikaži obvestilo
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png', // Po potrebi zamenjaj pot do ikone
    });
  }
}
