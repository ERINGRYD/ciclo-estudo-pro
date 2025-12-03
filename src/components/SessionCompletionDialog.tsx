import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, FileText, Save } from "lucide-react";

interface SessionCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  subjectName: string;
  subjectColor: string;
  focusMinutes: number;
  breakMinutes: number;
  onSave: (studyType: string, stoppingPoint: string) => void;
}

const STUDY_TYPES = [
  "Leitura",
  "Exercícios",
  "Revisão",
  "Videoaula",
  "Resumo",
  "Prática",
  "Simulado",
  "Outro",
];

const SessionCompletionDialog = ({
  open,
  onClose,
  subjectName,
  subjectColor,
  focusMinutes,
  breakMinutes,
  onSave,
}: SessionCompletionDialogProps) => {
  const [studyType, setStudyType] = useState("");
  const [stoppingPoint, setStoppingPoint] = useState("");

  const netMinutes = focusMinutes - breakMinutes;

  const handleSave = () => {
    onSave(studyType || "Não especificado", stoppingPoint || "Não especificado");
    setStudyType("");
    setStoppingPoint("");
  };

  const handleSkip = () => {
    onSave("Não especificado", "Não especificado");
    setStudyType("");
    setStoppingPoint("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: subjectColor }}
            />
            <DialogTitle>Sessão Concluída - {subjectName}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted p-3 rounded-lg text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Foco</p>
              <p className="font-semibold text-foreground">{focusMinutes}min</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-warning" />
              <p className="text-xs text-muted-foreground">Pausas</p>
              <p className="font-semibold text-foreground">{breakMinutes}min</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-success" />
              <p className="text-xs text-muted-foreground">Líquido</p>
              <p className="font-semibold text-foreground">{netMinutes}min</p>
            </div>
          </div>

          {/* Study Type */}
          <div className="space-y-2">
            <Label>Tipo de Estudo</Label>
            <Select value={studyType} onValueChange={setStudyType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de estudo" />
              </SelectTrigger>
              <SelectContent>
                {STUDY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stopping Point */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Ponto de Parada
            </Label>
            <Textarea
              value={stoppingPoint}
              onChange={(e) => setStoppingPoint(e.target.value)}
              placeholder="Ex: Capítulo 5, página 42 / Exercício 15 da lista 3..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Pular
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionCompletionDialog;