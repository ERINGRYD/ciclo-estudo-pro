import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { Subject, Theme, Topic } from "@/types/study";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface ManageTopicsDialogProps {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
  onUpdateSubject: (subject: Subject) => void;
}

const ManageTopicsDialog = ({ open, onClose, subject, onUpdateSubject }: ManageTopicsDialogProps) => {
  const { toast } = useToast();
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeHours, setNewThemeHours] = useState(1);
  const [newThemeMinutes, setNewThemeMinutes] = useState(0);
  const [newTopicName, setNewTopicName] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [openThemes, setOpenThemes] = useState<Set<string>>(new Set());
  const [editingThemeTime, setEditingThemeTime] = useState<string | null>(null);
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(0);

  if (!subject) return null;

  // Ensure themes array exists for legacy data
  const themes = subject.themes || [];

  const handleAddTheme = () => {
    if (!newThemeName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o tema",
        variant: "destructive",
      });
      return;
    }

    const newTheme: Theme = {
      id: crypto.randomUUID(),
      name: newThemeName.trim(),
      topics: [],
      studiedMinutes: 0,
      totalMinutes: newThemeHours * 60 + newThemeMinutes,
    };

    onUpdateSubject({
      ...subject,
      themes: [...themes, newTheme],
    });

    setNewThemeName("");
    setNewThemeHours(1);
    setNewThemeMinutes(0);
    toast({
      title: "Tema adicionado",
      description: `${newThemeName} foi adicionado com sucesso`,
    });
  };

  const handleAddTopic = (themeId: string) => {
    if (!newTopicName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o tópico",
        variant: "destructive",
      });
      return;
    }

    const newTopic: Topic = {
      id: crypto.randomUUID(),
      name: newTopicName.trim(),
      completed: false,
    };

    const updatedThemes = themes.map(theme => {
      if (theme.id === themeId) {
        return {
          ...theme,
          topics: [...(theme.topics || []), newTopic],
        };
      }
      return theme;
    });

    onUpdateSubject({
      ...subject,
      themes: updatedThemes,
    });

    setNewTopicName("");
    setSelectedThemeId(null);
    toast({
      title: "Tópico adicionado",
      description: `${newTopicName} foi adicionado com sucesso`,
    });
  };

  const handleDeleteTheme = (themeId: string) => {
    onUpdateSubject({
      ...subject,
      themes: themes.filter(t => t.id !== themeId),
    });
    toast({
      title: "Tema removido",
      description: "O tema foi removido com sucesso",
    });
  };

  const handleDeleteTopic = (themeId: string, topicId: string) => {
    const updatedThemes = themes.map(theme => {
      if (theme.id === themeId) {
        return {
          ...theme,
          topics: (theme.topics || []).filter(t => t.id !== topicId),
        };
      }
      return theme;
    });

    onUpdateSubject({
      ...subject,
      themes: updatedThemes,
    });
  };

  const handleToggleTopic = (themeId: string, topicId: string) => {
    const updatedThemes = themes.map(theme => {
      if (theme.id === themeId) {
        return {
          ...theme,
          topics: (theme.topics || []).map(topic => {
            if (topic.id === topicId) {
              return { ...topic, completed: !topic.completed };
            }
            return topic;
          }),
        };
      }
      return theme;
    });

    onUpdateSubject({
      ...subject,
      themes: updatedThemes,
    });
  };

  const toggleTheme = (themeId: string) => {
    setOpenThemes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(themeId)) {
        newSet.delete(themeId);
      } else {
        newSet.add(themeId);
      }
      return newSet;
    });
  };

  const handleUpdateThemeTime = (themeId: string) => {
    const updatedThemes = themes.map(theme => {
      if (theme.id === themeId) {
        return { ...theme, totalMinutes: editHours * 60 + editMinutes };
      }
      return theme;
    });

    onUpdateSubject({
      ...subject,
      themes: updatedThemes,
    });

    setEditingThemeTime(null);
    toast({
      title: "Meta atualizada",
      description: "A meta de tempo do tema foi atualizada",
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
            <DialogTitle>Temas e Tópicos - {subject.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add Theme */}
          <div className="space-y-2">
            <Label>Adicionar Tema</Label>
            <div className="flex gap-2">
              <Input
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="Ex: Álgebra, Geometria..."
                maxLength={100}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={newThemeHours}
                  onChange={(e) => setNewThemeHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16"
                  min={0}
                />
                <span className="text-sm text-muted-foreground">h</span>
                <Input
                  type="number"
                  value={newThemeMinutes}
                  onChange={(e) => setNewThemeMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-16"
                  min={0}
                  max={59}
                />
                <span className="text-sm text-muted-foreground">m</span>
              </div>
              <Button onClick={handleAddTheme}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Themes List */}
          <div className="space-y-3">
            {themes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum tema cadastrado. Adicione o primeiro tema!
              </p>
            ) : (
              themes.map((theme) => {
                const topicsList = theme.topics || [];
                const completedTopics = topicsList.filter(t => t.completed).length;
                const totalTopics = topicsList.length;
                const isOpen = openThemes.has(theme.id);
                const themeStudied = theme.studiedMinutes || 0;
                const themeTotal = theme.totalMinutes || 0;
                const themeProgress = themeTotal > 0 ? Math.min(100, (themeStudied / themeTotal) * 100) : 0;

                return (
                  <Collapsible
                    key={theme.id}
                    open={isOpen}
                    onOpenChange={() => toggleTheme(theme.id)}
                  >
                    <div className="border border-border rounded-lg overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3 flex-1">
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{theme.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {completedTopics}/{totalTopics} tópicos concluídos
                              </p>
                              {themeTotal > 0 && (
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTime(themeStudied)} / {formatTime(themeTotal)}</span>
                                    <span className="font-medium">({Math.round(themeProgress)}%)</span>
                                  </div>
                                  <Progress value={themeProgress} className="h-1.5" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingThemeTime(theme.id);
                                setEditHours(Math.floor((theme.totalMinutes || 0) / 60));
                                setEditMinutes((theme.totalMinutes || 0) % 60);
                              }}
                              title="Editar meta de tempo"
                            >
                              <Clock className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTheme(theme.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="p-4 space-y-3">
                          {/* Edit Theme Time */}
                          {editingThemeTime === theme.id && (
                            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                              <Label className="text-sm">Meta de tempo para este tema</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={editHours}
                                  onChange={(e) => setEditHours(Math.max(0, parseInt(e.target.value) || 0))}
                                  className="w-20"
                                  min={0}
                                />
                                <span className="text-sm text-muted-foreground">h</span>
                                <Input
                                  type="number"
                                  value={editMinutes}
                                  onChange={(e) => setEditMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                  className="w-20"
                                  min={0}
                                  max={59}
                                />
                                <span className="text-sm text-muted-foreground">m</span>
                                <Button size="sm" onClick={() => handleUpdateThemeTime(theme.id)}>
                                  Salvar
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingThemeTime(null)}>
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Add Topic */}
                          {selectedThemeId === theme.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={newTopicName}
                                onChange={(e) => setNewTopicName(e.target.value)}
                                placeholder="Nome do tópico..."
                                maxLength={100}
                                onKeyPress={(e) => e.key === "Enter" && handleAddTopic(theme.id)}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddTopic(theme.id)}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedThemeId(null);
                                  setNewTopicName("");
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedThemeId(theme.id)}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar Tópico
                            </Button>
                          )}

                          {/* Topics List */}
                          <div className="space-y-2">
                            {topicsList.map((topic) => (
                              <div
                                key={topic.id}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <Checkbox
                                    checked={topic.completed}
                                    onCheckedChange={() => handleToggleTopic(theme.id, topic.id)}
                                  />
                                  <span
                                    className={`text-sm ${
                                      topic.completed
                                        ? "line-through text-muted-foreground"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {topic.name}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTopic(theme.id, topic.id)}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTopicsDialog;
