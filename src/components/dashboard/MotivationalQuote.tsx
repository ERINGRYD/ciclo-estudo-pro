import { Sparkles } from "lucide-react";

const quotes = [
  "A disciplina é a ponte entre metas e conquistas.",
  "Cada minuto de estudo te aproxima da aprovação.",
  "Consistência supera intensidade.",
  "O segredo do sucesso é a constância do propósito.",
  "Quem estuda com foco, colhe com alegria.",
  "A aprovação é construída um dia de cada vez.",
  "Não espere por motivação, crie disciplina.",
  "Hoje é o dia que seu futuro eu vai agradecer.",
  "Pequenos progressos diários geram grandes resultados.",
  "A diferença entre sonho e realidade é a ação.",
  "Estude como se fosse impossível falhar.",
  "O esforço de hoje é o resultado de amanhã.",
  "Transforme a pressão em combustível.",
  "A excelência não é um ato, é um hábito.",
  "Sua aprovação começa na próxima sessão de estudo.",
  "Foco no processo, o resultado é consequência.",
  "Cada questão errada é uma lição aprendida.",
  "A persistência é o caminho mais curto para o sucesso.",
  "Não conte os dias, faça os dias contarem.",
  "O conhecimento é a única riqueza que ninguém tira de você.",
  "Estudar cansa, mas a aprovação compensa.",
  "Seja mais forte que suas desculpas.",
  "A vitória pertence aos mais perseverantes.",
  "Hoje difícil, amanhã aprovado.",
  "O melhor momento para estudar é agora.",
  "Quem planta estudo, colhe aprovação.",
  "Acredite no seu potencial e continue.",
  "Cada página lida é um passo à frente.",
  "A jornada é longa, mas a recompensa é certa.",
  "Sua dedicação vai valer a pena.",
];

const MotivationalQuote = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const quote = quotes[dayOfYear % quotes.length];

  return (
    <div className="flex items-start gap-3 mb-6 p-3 bg-gradient-to-r from-primary/5 to-info/5 rounded-xl border border-primary/10">
      <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <p className="text-xs text-muted-foreground italic leading-relaxed">"{quote}"</p>
    </div>
  );
};

export default MotivationalQuote;
