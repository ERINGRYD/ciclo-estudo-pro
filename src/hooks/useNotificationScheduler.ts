import { useEffect, useCallback, useState } from 'react';

const NOTIFICATION_PERMISSION_KEY = 'notification-permission';
const LAST_NOTIFICATION_KEY = 'last-mission-notification';
const NOTIFICATION_SETTINGS_KEY = 'notification-settings';

interface NotificationSettings {
  enabled: boolean;
  morningReminder: boolean; // 9:00
  afternoonReminder: boolean; // 14:00
  eveningReminder: boolean; // 20:00
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  morningReminder: true,
  afternoonReminder: true,
  eveningReminder: true,
};

export const useNotificationScheduler = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  // Load settings and permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    const savedSettings = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch {}
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, result);
      return result === 'granted';
    }

    return false;
  }, []);

  // Send a notification
  const sendNotification = useCallback((title: string, options?: { body?: string; icon?: string; tag?: string }) => {
    if (permission !== 'granted' || !settings.enabled) return;

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        tag: 'mission-reminder',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [permission, settings.enabled]);

  // Check if we should send a reminder
  const checkAndSendReminder = useCallback((
    unclaimedMissions: number,
    expiresIn: string
  ) => {
    if (permission !== 'granted' || !settings.enabled) return;
    if (unclaimedMissions === 0) return;

    const now = new Date();
    const hour = now.getHours();
    const lastNotification = localStorage.getItem(LAST_NOTIFICATION_KEY);
    const today = now.toDateString();

    // Check if already notified today for this time slot
    const lastNotificationData = lastNotification ? JSON.parse(lastNotification) : {};
    const todaySlots = lastNotificationData[today] || [];

    // Determine current time slot
    let currentSlot = '';
    if (hour >= 8 && hour < 10 && settings.morningReminder) {
      currentSlot = 'morning';
    } else if (hour >= 13 && hour < 15 && settings.afternoonReminder) {
      currentSlot = 'afternoon';
    } else if (hour >= 19 && hour < 21 && settings.eveningReminder) {
      currentSlot = 'evening';
    }

    // Send notification if not already sent for this slot
    if (currentSlot && !todaySlots.includes(currentSlot)) {
      const messages = [
        `⚔️ Você tem ${unclaimedMissions} missão(ões) pendente(s)!`,
        `🎯 Complete suas missões antes de expirar em ${expiresIn}!`,
        `💪 Não perca XP! ${unclaimedMissions} missão(ões) aguardando você.`,
        `🔥 Mantenha sua sequência! Termine suas missões diárias.`,
      ];

      sendNotification(
        'Missões Diárias Aguardando!',
        {
          body: messages[Math.floor(Math.random() * messages.length)],
        }
      );

      // Save that we notified for this slot
      todaySlots.push(currentSlot);
      lastNotificationData[today] = todaySlots;
      localStorage.setItem(LAST_NOTIFICATION_KEY, JSON.stringify(lastNotificationData));
    }
  }, [permission, settings, sendNotification]);

  // Schedule periodic checks
  useEffect(() => {
    if (permission !== 'granted' || !settings.enabled) return;

    // Check every 30 minutes
    const interval = setInterval(() => {
      const missionsData = localStorage.getItem('daily-missions');
      if (missionsData) {
        try {
          const parsed = JSON.parse(missionsData);
          const unclaimed = parsed.missions.filter(
            (m: any) => m.completed && !m.claimed
          ).length;
          const pending = parsed.missions.filter(
            (m: any) => !m.completed
          ).length;

          if (unclaimed > 0 || pending > 0) {
            // Calculate expires in
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - Date.now();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const expiresIn = `${hours}h`;

            checkAndSendReminder(unclaimed + pending, expiresIn);
          }
        } catch {}
      }
    }, 30 * 60 * 1000); // Every 30 minutes

    return () => clearInterval(interval);
  }, [permission, settings.enabled, checkAndSendReminder]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
  }, [settings]);

  // Send immediate test notification
  const sendTestNotification = useCallback(() => {
    sendNotification('Teste de Notificação', {
      body: '✅ As notificações estão funcionando corretamente!',
    });
  }, [sendNotification]);

  return {
    permission,
    settings,
    requestPermission,
    sendNotification,
    checkAndSendReminder,
    updateSettings,
    sendTestNotification,
    isSupported: 'Notification' in window,
  };
};
