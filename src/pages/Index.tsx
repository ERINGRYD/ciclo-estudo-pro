import { useState } from "react";
import { BookOpen } from "lucide-react";
import StudyCycleChart from "@/components/StudyCycleChart";
import SubjectCard from "@/components/SubjectCard";
import PomodoroTimer from "@/components/PomodoroTimer";

interface Subject {
  name: string;
  abbreviation: string;
  studiedMinutes: number;
  breakMinutes: number;
  totalMinutes: number;
  color: string;
}

const Index = () => {
  const [pomodoroSubject, setPomodoroSubject] = useState<Subject | null>(null);

  const subjects: Subject[] = [
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ciclo de Estudos</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso</p>
          </div>
        </div>

        {/* Chart Section */}
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
      </div>

      <PomodoroTimer 
        subject={pomodoroSubject}
        onClose={() => setPomodoroSubject(null)}
      />
    </div>
  );
};

export default Index;
