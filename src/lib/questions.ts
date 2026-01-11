import { Question } from "@/types/question";

export const sampleQuestions: Question[] = [
  {
    id: 1,
    subject: "História",
    topic: "Brasil Império",
    difficulty: "easy",
    banca: "FGV",
    year: 2023,
    cargo: "Analista",
    instituicao: "IBGE",
    title: "Independência do Brasil",
    text: "Em que ano ocorreu a Independência do Brasil?",
    options: [
      { letter: "A", text: "1889" },
      { letter: "B", text: "1822" },
      { letter: "C", text: "1500" },
      { letter: "D", text: "1789" },
    ],
    correctAnswer: "B",
  },
  {
    id: 2,
    subject: "Português",
    topic: "Gramática",
    difficulty: "medium",
    banca: "CESPE",
    year: 2022,
    cargo: "Técnico",
    instituicao: "TCU",
    title: "Concordância Verbal",
    text: "Qual das alternativas apresenta concordância verbal correta?",
    options: [
      { letter: "A", text: "Fazem dois anos que não o vejo." },
      { letter: "B", text: "Houveram muitos acidentes na estrada." },
      { letter: "C", text: "Existem várias possibilidades de solução." },
      { letter: "D", text: "Haviam pessoas esperando na fila." },
    ],
    correctAnswer: "C",
  },
  {
    id: 3,
    subject: "Matemática",
    topic: "Porcentagem",
    difficulty: "easy",
    banca: "FCC",
    year: 2023,
    cargo: "Auditor",
    instituicao: "TRT",
    title: "Cálculo de Porcentagem",
    text: "Um produto que custava R$ 200,00 teve um aumento de 15%. Qual o novo preço?",
    options: [
      { letter: "A", text: "R$ 215,00" },
      { letter: "B", text: "R$ 230,00" },
      { letter: "C", text: "R$ 225,00" },
      { letter: "D", text: "R$ 220,00" },
    ],
    correctAnswer: "B",
  },
  {
    id: 4,
    subject: "Direito Constitucional",
    topic: "Direitos Fundamentais",
    difficulty: "medium",
    banca: "VUNESP",
    year: 2022,
    cargo: "Procurador",
    instituicao: "PGE",
    title: "Direitos e Garantias",
    text: "De acordo com a Constituição Federal, o habeas corpus será concedido:",
    options: [
      { letter: "A", text: "Sempre que alguém sofrer violação de direito líquido e certo." },
      { letter: "B", text: "Sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção." },
      { letter: "C", text: "Para proteger direito líquido e certo não amparado por habeas data." },
      { letter: "D", text: "Para anular ato lesivo ao patrimônio público." },
    ],
    correctAnswer: "B",
  },
  {
    id: 5,
    subject: "Raciocínio Lógico",
    topic: "Proposições",
    difficulty: "hard",
    banca: "CEBRASPE",
    year: 2023,
    cargo: "Analista",
    instituicao: "MPU",
    title: "Lógica Proposicional",
    text: "Se a proposição 'Se chove, então a rua fica molhada' é verdadeira e 'A rua não está molhada' é verdadeira, então:",
    options: [
      { letter: "A", text: "Está chovendo." },
      { letter: "B", text: "Não está chovendo." },
      { letter: "C", text: "A rua está molhada." },
      { letter: "D", text: "Não é possível determinar." },
    ],
    correctAnswer: "B",
  },
];

export const getQuestionsBySubject = (subject: string, count: number): Question[] => {
  let filtered = subject === "Todas" 
    ? [...sampleQuestions] 
    : sampleQuestions.filter(q => q.subject === subject);
  
  // Shuffle and return requested count
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const calculateXP = (isCorrect: boolean, confidence: "certeza" | "duvida" | "chute"): number => {
  if (!isCorrect) return 0;
  
  switch (confidence) {
    case "certeza": return 5;
    case "duvida": return 3;
    case "chute": return 1;
    default: return 0;
  }
};
