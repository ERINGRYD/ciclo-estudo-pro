import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Bell, 
  Volume2, 
  Clock, 
  Download, 
  Upload, 
  Trash2,
  ChevronRight,
  Settings,
  BellRing,
  TestTube2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotificationScheduler } from "@/hooks/useNotificationScheduler";

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  pomodoroMinutes: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  notifications: true,
  soundEnabled: true,
  pomodoroMinutes: 25,
};

const SETTINGS_KEY = "app-settings";

const ConfiguracoesPage = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const { toast } = useToast();
  const { 
    permission, 
    settings: notificationSettings, 
    requestPermission, 
    updateSettings: updateNotificationSettings,
    sendTestNotification,
    isSupported 
  } = useNotificationScheduler();

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    
    // Aplicar dark mode
    if (key === "darkMode") {
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    toast({
      title: "Configuração salva",
      description: "Suas preferências foram atualizadas.",
    });
  };

  const handleRequestNotificationPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Notificações ativadas!",
        description: "Você receberá lembretes sobre suas missões diárias.",
      });
    } else {
      toast({
        title: "Permissão negada",
        description: "Você pode ativar nas configurações do navegador.",
        variant: "destructive",
      });
    }
  };

  const handleTestNotification = () => {
    if (permission === 'granted') {
      sendTestNotification();
      toast({
        title: "Notificação enviada!",
        description: "Verifique a notificação do sistema.",
      });
    } else {
      toast({
        title: "Permissão necessária",
        description: "Ative as notificações primeiro.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    const data = {
      settings: localStorage.getItem(SETTINGS_KEY),
      progress: localStorage.getItem("user-progress"),
      battleHistory: localStorage.getItem("battle-history"),
      dailyMissions: localStorage.getItem("daily-missions"),
      notificationSettings: localStorage.getItem("notification-settings"),
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-app-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dados exportados",
      description: "Seu backup foi baixado com sucesso.",
    });
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.settings) localStorage.setItem(SETTINGS_KEY, data.settings);
            if (data.progress) localStorage.setItem("user-progress", data.progress);
            if (data.battleHistory) localStorage.setItem("battle-history", data.battleHistory);
            if (data.dailyMissions) localStorage.setItem("daily-missions", data.dailyMissions);
            if (data.notificationSettings) localStorage.setItem("notification-settings", data.notificationSettings);
            
            toast({
              title: "Dados importados",
              description: "Seus dados foram restaurados. Recarregue a página para ver as alterações.",
            });
          } catch {
            toast({
              title: "Erro ao importar",
              description: "O arquivo selecionado não é válido.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm("Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem("user-progress");
      localStorage.removeItem("battle-history");
      localStorage.removeItem("daily-missions");
      localStorage.removeItem("notification-settings");
      setSettings(DEFAULT_SETTINGS);
      
      toast({
        title: "Dados apagados",
        description: "Todos os seus dados foram removidos.",
        variant: "destructive",
      });
    }
  };

  const pomodoroOptions = [15, 20, 25, 30, 45, 50, 60];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div 
        className="relative px-6 pt-12 pb-8"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--muted) / 0.5) 100%)"
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Personalize sua experiência</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Aparência */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Aparência
          </h2>
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">Tema escuro para o app</p>
                </div>
              </div>
              <Switch 
                checked={settings.darkMode} 
                onCheckedChange={(checked) => updateSetting("darkMode", checked)}
              />
            </div>
          </Card>
        </div>

        {/* Notificações Push */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Lembretes de Missões
          </h2>
          <Card className="divide-y divide-border">
            {/* Permission Status */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  permission === 'granted' ? 'bg-success/10' : 'bg-warning/10'
                }`}>
                  <BellRing className={`w-5 h-5 ${
                    permission === 'granted' ? 'text-success' : 'text-warning'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Notificações Push</p>
                  <p className="text-sm text-muted-foreground">
                    {!isSupported && "Não suportado neste navegador"}
                    {isSupported && permission === 'granted' && "Ativado ✓"}
                    {isSupported && permission === 'denied' && "Bloqueado pelo navegador"}
                    {isSupported && permission === 'default' && "Não configurado"}
                  </p>
                </div>
              </div>
              {isSupported && permission !== 'granted' && permission !== 'denied' && (
                <Button size="sm" onClick={handleRequestNotificationPermission}>
                  Ativar
                </Button>
              )}
              {permission === 'granted' && (
                <Switch 
                  checked={notificationSettings.enabled} 
                  onCheckedChange={(checked) => updateNotificationSettings({ enabled: checked })}
                />
              )}
            </div>

            {/* Reminder Times */}
            {permission === 'granted' && (
              <>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                      <span className="text-sm">🌅</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Lembrete Manhã</p>
                      <p className="text-sm text-muted-foreground">Entre 8h e 10h</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.morningReminder} 
                    onCheckedChange={(checked) => updateNotificationSettings({ morningReminder: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                      <span className="text-sm">☀️</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Lembrete Tarde</p>
                      <p className="text-sm text-muted-foreground">Entre 13h e 15h</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.afternoonReminder} 
                    onCheckedChange={(checked) => updateNotificationSettings({ afternoonReminder: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                      <span className="text-sm">🌙</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Lembrete Noite</p>
                      <p className="text-sm text-muted-foreground">Entre 19h e 21h</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notificationSettings.eveningReminder} 
                    onCheckedChange={(checked) => updateNotificationSettings({ eveningReminder: checked })}
                  />
                </div>
                <button 
                  onClick={handleTestNotification}
                  className="flex items-center justify-between p-4 w-full hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TestTube2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Testar Notificação</p>
                      <p className="text-sm text-muted-foreground">Enviar uma notificação de teste</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </>
            )}
          </Card>
        </div>

        {/* Sons */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Sons
          </h2>
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Sons do App</p>
                  <p className="text-sm text-muted-foreground">Feedback sonoro nas batalhas</p>
                </div>
              </div>
              <Switch 
                checked={settings.soundEnabled} 
                onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
              />
            </div>
          </Card>
        </div>

        {/* Pomodoro */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Pomodoro
          </h2>
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground">Tempo de Foco</p>
                <p className="text-sm text-muted-foreground">Duração padrão do Pomodoro</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {pomodoroOptions.map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => updateSetting("pomodoroMinutes", minutes)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    settings.pomodoroMinutes === minutes
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Dados */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Dados
          </h2>
          <Card className="divide-y divide-border">
            <button 
              onClick={handleExportData}
              className="flex items-center justify-between p-4 w-full hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Exportar Dados</p>
                  <p className="text-sm text-muted-foreground">Baixar backup completo</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={handleImportData}
              className="flex items-center justify-between p-4 w-full hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-info" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Importar Dados</p>
                  <p className="text-sm text-muted-foreground">Restaurar de um backup</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={handleClearData}
              className="flex items-center justify-between p-4 w-full hover:bg-destructive/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-destructive">Apagar Dados</p>
                  <p className="text-sm text-muted-foreground">Remover todo o progresso</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        {/* Install PWA */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Instalação
          </h2>
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <span className="text-lg">📱</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Instalar App</p>
                <p className="text-sm text-muted-foreground">Adicione à tela inicial do seu dispositivo</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              No iPhone: Compartilhar → Adicionar à Tela de Início<br />
              No Android: Menu do navegador → Instalar app
            </p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ConfiguracoesPage;
