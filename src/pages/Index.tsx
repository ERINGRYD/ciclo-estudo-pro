import { BookOpen } from "lucide-react";
import StudyCycleChart from "@/components/StudyCycleChart";
import SubjectCard from "@/components/SubjectCard";

const Index = () => {
  const subjects = [
    {
      name: "Matemática",
      studiedMinutes: 120,
      totalMinutes: 180,
      color: "hsl(217, 91%, 60%)", // chart-1
    },
    {
      name: "Português",
      studiedMinutes: 90,
      totalMinutes: 150,
      color: "hsl(142, 76%, 36%)", // chart-2
    },
    {
      name: "História",
      studiedMinutes: 60,
      totalMinutes: 120,
      color: "hsl(38, 92%, 50%)", // chart-3
    },
    {
      name: "Geografia",
      studiedMinutes: 45,
      totalMinutes: 90,
      color: "hsl(271, 81%, 56%)", // chart-4
    },
    {
      name: "Física",
      studiedMinutes: 75,
      totalMinutes: 150,
      color: "hsl(339, 82%, 56%)", // chart-5
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
          <StudyCycleChart subjects={subjects} />
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
    </div>
  );
};

export default Index;
