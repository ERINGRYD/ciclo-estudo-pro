import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface Subject {
  name: string;
  abbreviation: string;
  studiedMinutes: number;
  breakMinutes: number;
  totalMinutes: number;
  color: string;
}

interface ManageSubjectsDialogProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  onUpdateSubjects: (subjects: Subject[]) => void;
}

const subjectSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  abbreviation: z.string()
    .trim()
    .min(2, "Abreviação deve ter no mínimo 2 caracteres")
    .max(4, "Abreviação deve ter no máximo 4 caracteres")
    .toUpperCase(),
  totalMinutes: z.number()
    .min(15, "Meta mínima é 15 minutos")
    .max(600, "Meta máxima é 600 minutos (10 horas)"),
  color: z.string().regex(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/, "Cor inválida"),
});

const PRESET_COLORS = [
  { name: "Azul", value: "hsl(217, 91%, 60%)" },
  { name: "Verde", value: "hsl(142, 76%, 36%)" },
  { name: "Laranja", value: "hsl(38, 92%, 50%)" },
  { name: "Roxo", value: "hsl(271, 81%, 56%)" },
  { name: "Rosa", value: "hsl(339, 82%, 56%)" },
  { name: "Ciano", value: "hsl(199, 89%, 48%)" },
  { name: "Vermelho", value: "hsl(0, 84%, 60%)" },
  { name: "Amarelo", value: "hsl(48, 96%, 53%)" },
];

const ManageSubjectsDialog = ({ open, onClose, subjects, onUpdateSubjects }: ManageSubjectsDialogProps) => {
  const { toast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    totalHours: "1",
    totalMinutes: "0",
    color: PRESET_COLORS[0].value,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: "",
      abbreviation: "",
      totalHours: "1",
      totalMinutes: "0",
      color: PRESET_COLORS[0].value,
    });
    setErrors({});
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleEdit = (index: number) => {
    const subject = subjects[index];
    const hours = Math.floor(subject.totalMinutes / 60);
    const minutes = subject.totalMinutes % 60;
    
    setFormData({
      name: subject.name,
      abbreviation: subject.abbreviation,
      totalHours: String(hours),
      totalMinutes: String(minutes),
      color: subject.color,
    });
    setEditingIndex(index);
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (index: number) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    onUpdateSubjects(newSubjects);
    toast({
      title: "Matéria removida",
      description: "A matéria foi removida com sucesso.",
    });
  };

  const handleSave = () => {
    try {
      const totalMinutes = parseInt(formData.totalHours) * 60 + parseInt(formData.totalMinutes);
      
      const validatedData = subjectSchema.parse({
        name: formData.name,
        abbreviation: formData.abbreviation,
        totalMinutes,
        color: formData.color,
      });

      const newSubject: Subject = {
        name: validatedData.name,
        abbreviation: validatedData.abbreviation,
        studiedMinutes: 0,
        breakMinutes: 0,
        totalMinutes: validatedData.totalMinutes,
        color: validatedData.color,
      };

      if (editingIndex !== null) {
        // Keep studied and break minutes when editing
        const oldSubject = subjects[editingIndex];
        newSubject.studiedMinutes = oldSubject.studiedMinutes;
        newSubject.breakMinutes = oldSubject.breakMinutes;
        
        const newSubjects = [...subjects];
        newSubjects[editingIndex] = newSubject;
        onUpdateSubjects(newSubjects);
        toast({
          title: "Matéria atualizada",
          description: "A matéria foi atualizada com sucesso.",
        });
      } else {
        onUpdateSubjects([...subjects, newSubject]);
        toast({
          title: "Matéria adicionada",
          description: "A nova matéria foi adicionada com sucesso.",
        });
      }

      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Matérias</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add/Edit Form */}
          {(isAdding || editingIndex !== null) && (
            <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">
                  {editingIndex !== null ? "Editar Matéria" : "Nova Matéria"}
                </h3>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Matéria</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Matemática"
                    maxLength={50}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abbreviation">Abreviação (2-4 letras)</Label>
                  <Input
                    id="abbreviation"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      abbreviation: e.target.value.toUpperCase() 
                    })}
                    placeholder="Ex: MAT"
                    maxLength={4}
                  />
                  {errors.abbreviation && (
                    <p className="text-sm text-destructive">{errors.abbreviation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Meta de Tempo</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={formData.totalHours}
                        onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
                        min="0"
                        max="10"
                        placeholder="Horas"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={formData.totalMinutes}
                        onChange={(e) => setFormData({ ...formData, totalMinutes: e.target.value })}
                        min="0"
                        max="59"
                        placeholder="Minutos"
                      />
                    </div>
                  </div>
                  {errors.totalMinutes && (
                    <p className="text-sm text-destructive">{errors.totalMinutes}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cor</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: preset.value })}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          formData.color === preset.value
                            ? "border-foreground scale-105"
                            : "border-transparent hover:border-border"
                        }`}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {editingIndex !== null ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </div>
          )}

          {/* Add New Button */}
          {!isAdding && editingIndex === null && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Matéria
            </Button>
          )}

          {/* Subjects List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground mb-3">Matérias Atuais</h3>
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma matéria cadastrada. Adicione sua primeira matéria!
              </p>
            ) : (
              subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.abbreviation} • Meta: {Math.floor(subject.totalMinutes / 60)}h{" "}
                        {subject.totalMinutes % 60}m
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(index)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSubjectsDialog;
