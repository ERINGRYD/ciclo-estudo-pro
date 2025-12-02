import { useState, useEffect } from "react";
import { BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudyCycleChart from "@/components/StudyCycleChart";
import SubjectCard from "@/components/SubjectCard";
import PomodoroTimer from "@/components/PomodoroTimer";
import ManageSubjectsDialog from "@/components/ManageSubjectsDialog";

interface Subject {
  name: string;
  abbreviation: string;
  studiedMinutes: number;
  breakMinutes: number;
  totalMinutes: number;
  color: string;
}

const DEFAULT_SUBJECTS: Subject[] = [
  {
    name: "Matemática",
    abbreviation: "MAT",
    studiedMinutes: 120,
    breakMinutes: 15,
    totalMinutes: 180,
    color: "hsl(217, 91%, 60%)",
  },
  {
    name: "Português",
    abbreviation: "POR",
    studiedMinutes: 90,
    breakMinutes: 10,
    totalMinutes: 150,
    color: "hsl(142, 76%, 36%)",
  },
  {
    name: "História",
    abbreviation: "HIS",
    studiedMinutes: 60,
    breakMinutes: 8,
    totalMinutes: 120,
    color: "hsl(38, 92%, 50%)",
  },
  {
    name: "Geografia",
    abbreviation: "GEO",
    studiedMinutes: 45,
    breakMinutes: 5,
    totalMinutes: 90,
    color: "hsl(271, 81%, 56%)",
  },
  {
    name: "Física",
    abbreviation: "FIS",
    studiedMinutes: 75,
    breakMinutes: 12,
    totalMinutes: 150,
    color: "hsl(339, 82%, 56%)",
  },
];

const STORAGE_KEY = "study-cycle-subjects";

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SUBJECTS;
      }
    }
    return DEFAULT_SUBJECTS;
  });
  const [pomodoroSubject, setPomodoroSubject] = useState<Subject | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ciclo de Estudos</h1>
              <p className="text-muted-foreground">Acompanhe seu progresso</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setManageDialogOpen(true)}
            title="Gerenciar Matérias"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Chart Section */}
        {subjects.length > 0 ? (
          <>
            <div className="bg-card rounded-2xl p-6 mb-8 border border-border shadow-[var(--shadow-medium)]">
              <StudyCycleChart 
                subjects={subjects} 
                onOpenPomodoro={(subject) => setPomodoroSubject(subject)}
              />
            </div>

            {/* Subjects List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Matérias</h2>
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.name}
                  name={subject.name}
                  studiedMinutes={subject.studiedMinutes}
                  totalMinutes={subject.totalMinutes}
                  color={subject.color}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma matéria cadastrada
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando suas matérias de estudo
            </p>
            <Button onClick={() => setManageDialogOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Gerenciar Matérias
            </Button>
          </div>
        )}
      </div>

      <PomodoroTimer 
        subject={pomodoroSubject}
        onClose={() => setPomodoroSubject(null)}
      />

      <ManageSubjectsDialog
        open={manageDialogOpen}
        onClose={() => setManageDialogOpen(false)}
        subjects={subjects}
        onUpdateSubjects={setSubjects}
      />
    </div>
  );
};

export default Index;
