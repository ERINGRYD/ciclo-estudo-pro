import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";

const NotificationPermissionBanner = () => {
  const { permission, requestPermission, isSupported } = useNotificationScheduler();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner if permission not granted and not dismissed
    const wasDismissed = localStorage.getItem('notification-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    } else if (isSupported && permission === 'default') {
      // Show after a delay
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [permission, isSupported]);

  const handleAllow = async () => {
    const granted = await requestPermission();
    if (granted) {
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  if (!visible || dismissed || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-lg max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Ativar Lembretes?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Receba lembretes para completar suas missões diárias e nunca perder XP!
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAllow}>
                Ativar
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                Agora não
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;
