export interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Theme {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  name: string;
  abbreviation: string;
  studiedMinutes: number;
  breakMinutes: number;
  totalMinutes: number;
  color: string;
  themes: Theme[];
}

export interface WeeklyGoal {
  id: string;
  description: string;
  targetMinutes: number;
  currentMinutes: number;
  completed: boolean;
  weekStart: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  condition: (subjects: Subject[], goals: WeeklyGoal[]) => boolean;
}

export interface StudySession {
  id: string;
  subjectName: string;
  subjectColor: string;
  themeName?: string;
  date: string;
  focusMinutes: number;
  breakMinutes: number;
  studyType: string;
  stoppingPoint: string;
  createdAt: string;
}
