import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Subject, Theme } from "@/types/study";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddTimeDialogProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddTime: (subjectName: string, minutes: number, themeName?: string) => void;
}

const AddTimeDialog = ({ open, onClose, subjects, onAddTime }: AddTimeDialogProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const currentSubject = subjects.find(s => s.name === selectedSubject);
  const themes = currentSubject?.themes || [];

  const handleSubmit = () => {
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    if (selectedSubject && totalMinutes > 0) {
      onAddTime(selectedSubject, totalMinutes, selectedTheme || undefined);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedSubject("");
    setSelectedTheme("");
    setHours("");
    setMinutes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Tempo Manualmente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Matéria</Label>
            <Select value={selectedSubject} onValueChange={(value) => {
              setSelectedSubject(value);
              setSelectedTheme("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma matéria" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.name} value={subject.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {themes.length > 0 && (
            <div className="space-y-2">
              <Label>Tema (opcional)</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum tema específico</SelectItem>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.name}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tempo de Estudo</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Horas"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0"
                  max="24"
                />
                <span className="text-xs text-muted-foreground">Horas</span>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Minutos"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="0"
                  max="59"
                />
                <span className="text-xs text-muted-foreground">Minutos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedSubject || ((parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0)) <= 0}
          >
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimeDialog;
