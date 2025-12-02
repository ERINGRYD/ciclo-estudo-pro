import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Check, X } from "lucide-react";
import { WeeklyGoal } from "@/types/study";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WeeklyGoalsWidgetProps {
  goals: WeeklyGoal[];
  onUpdateGoals: (goals: WeeklyGoal[]) => void;
  currentMinutes: number;
}

const WeeklyGoalsWidget = ({ goals, onUpdateGoals, currentMinutes }: WeeklyGoalsWidgetProps) => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalHours, setNewGoalHours] = useState("5");

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  };

  const currentWeekGoals = goals.filter(g => g.weekStart === getWeekStart());

  const handleAddGoal = () => {
    if (!newGoalDescription.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Digite uma descrição para a meta",
        variant: "destructive",
      });
      return;
    }

    const targetMinutes = parseInt(newGoalHours) * 60;
    if (targetMinutes < 30) {
      toast({
        title: "Meta muito baixa",
        description: "A meta deve ser de pelo menos 30 minutos",
        variant: "destructive",
      });
      return;
    }

    const newGoal: WeeklyGoal = {
      id: crypto.randomUUID(),
      description: newGoalDescription.trim(),
      targetMinutes,
      currentMinutes: 0,
      completed: false,
      weekStart: getWeekStart(),
    };

    onUpdateGoals([...goals, newGoal]);
    setNewGoalDescription("");
    setNewGoalHours("5");
    setShowAddDialog(false);

    toast({
      title: "Meta adicionada",
      description: "Sua meta semanal foi criada com sucesso",
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    onUpdateGoals(goals.filter(g => g.id !== goalId));
    toast({
      title: "Meta removida",
      description: "A meta foi removida com sucesso",
    });
  };

  // Update goals progress
  const updatedGoals = currentWeekGoals.map(goal => ({
    ...goal,
    currentMinutes: currentMinutes,
    completed: currentMinutes >= goal.targetMinutes,
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Metas da Semana</h3>
              <p className="text-sm text-muted-foreground">
                {updatedGoals.filter(g => g.completed).length} de {updatedGoals.length} completadas
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        <div className="space-y-3">
          {updatedGoals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">
                Nenhuma meta definida para esta semana
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Meta
              </Button>
            </div>
          ) : (
            updatedGoals.map((goal) => {
              const progress = (goal.currentMinutes / goal.targetMinutes) * 100;
              return (
                <div
                  key={goal.id}
                  className="p-4 bg-muted/30 rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {goal.completed && (
                          <Check className="w-4 h-4 text-success" />
                        )}
                        <p className="font-medium text-foreground">{goal.description}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatTime(goal.currentMinutes)} / {formatTime(goal.targetMinutes)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className="h-2"
                  />
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Meta Semanal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder="Ex: Estudar todas as matérias"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Meta de Horas</Label>
              <Input
                id="hours"
                type="number"
                value={newGoalHours}
                onChange={(e) => setNewGoalHours(e.target.value)}
                min="0.5"
                max="50"
                step="0.5"
              />
              <p className="text-sm text-muted-foreground">
                Meta: {parseInt(newGoalHours)} horas esta semana
              </p>
            </div>

            <Button onClick={handleAddGoal} className="w-full">
              <Target className="w-4 h-4 mr-2" />
              Criar Meta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeeklyGoalsWidget;
