

# Melhorias do Dashboard - Analise e Plano de Implementacao

## Diagnostico do Dashboard Atual

O dashboard atual tem uma boa estrutura gamificada, mas apresenta problemas importantes para a tomada de decisao do usuario:

### Problemas Identificados

1. **NextActionCard e statico** - Quando nao ha materias, mostra "Geometria Espacial" hardcoded (linha 196-200 do Index.tsx). Nao considera pontos fracos nem tempo sem estudar.

2. **StatsGrid sem contexto temporal** - Mostra numeros absolutos sem tendencia (ex: "42 questoes" mas nao diz se esta melhor ou pior que antes). O "Foco %" nao comunica claramente o que significa.

3. **CurrentPlan limitado** - Mostra apenas semana e aderencia, sem detalhes de quais materias estao atrasadas ou adiantadas. O botao "Detalhes" nao leva a nada.

4. **ActivityHeatmap sem resumo** - O heatmap mostra atividade visual mas nao tem um resumo textual (ex: "Voce estudou 5 dos ultimos 7 dias").

5. **UserHeader estatico** - O nome "Campeao" e hardcoded. Nao mostra progresso do nivel atual (barra de XP ate o proximo nivel).

6. **Sem secao de "Pontos Fracos"** - O dado existe (wrongQuestionIds no battle-history) mas nao e mostrado no dashboard. O usuario nao sabe quais materias precisa revisar.

7. **Sem resumo do dia** - Nao mostra um resumo rapido do que o usuario ja fez hoje (minutos estudados, questoes respondidas).

8. **Estado vazio pobre** - Quando o usuario nao tem dados, o dashboard mostra tudo zerado sem orientacao de como comecar.

---

## Melhorias Planejadas

### 1. Novo componente: TodaySummary (Resumo do Dia)
Card compacto logo apos o UserHeader mostrando:
- Minutos estudados hoje
- Questoes respondidas hoje
- Taxa de acerto hoje
- Comparacao com a media diaria ("acima/abaixo da sua media")

### 2. NextActionCard inteligente
- Quando nao ha materias: mostrar CTA para cadastrar materias (link para /ciclo)
- Quando ha materias: priorizar pela materia com menor taxa de acerto nas batalhas OU menor progresso
- Mostrar motivo: "Menor progresso" ou "Precisa de revisao"

### 3. StatsGrid com tendencias
- Adicionar setas de tendencia (para cima/para baixo) comparando semana atual com anterior
- Streak: mostrar emoji de fogo escalando (1-3, 4-6, 7+)
- Questoes: mostrar tendencia semanal

### 4. Novo componente: WeakPointsCard (Pontos Fracos)
- Exibir as 3 materias com menor taxa de acerto
- Mostrar taxa de acerto por materia
- Botao direto para praticar questoes da materia fraca
- Visivel para todos os niveis (informacao critica nao deve ser bloqueada por nivel)

### 5. UserHeader com barra de progresso do nivel
- Adicionar barra de XP mostrando progresso ate o proximo nivel
- Mostrar "450/700 XP para nivel 5"

### 6. ActivityHeatmap com resumo textual
- Adicionar linha de texto: "Voce estudou X dos ultimos 7 dias"
- Destacar o dia atual no heatmap

### 7. Estado vazio orientado
- Quando nao ha sessoes nem batalhas, mostrar um card de onboarding com 3 passos:
  1. Cadastre suas materias
  2. Faca sua primeira sessao de estudo
  3. Resolva suas primeiras questoes

---

## Detalhes Tecnicos

### Arquivos a criar:
- `src/components/dashboard/TodaySummary.tsx` - Resumo do dia com minutos, questoes e taxa de acerto
- `src/components/dashboard/WeakPointsCard.tsx` - Card de pontos fracos com materias de menor acerto
- `src/components/dashboard/EmptyStateCard.tsx` - Card de onboarding para usuarios novos

### Arquivos a modificar:

**src/pages/Index.tsx**
- Calcular dados para TodaySummary (todayMinutes, questionsToday, todayHitRate, dailyAverage)
- Calcular pontos fracos a partir do battleHistory (agrupar por subject, calcular taxa de acerto)
- Melhorar logica do NextActionCard para considerar pontos fracos
- Adicionar TodaySummary entre UserHeader e NextActionCard
- Adicionar WeakPointsCard apos StatsGrid
- Renderizar EmptyStateCard quando nao ha dados
- Passar levelProgress e xpForNextLevel para UserHeader

**src/components/dashboard/UserHeader.tsx**
- Adicionar props opcionais: levelProgress, xpForNextLevel
- Renderizar barra de progresso de XP abaixo do nivel

**src/components/dashboard/StatsGrid.tsx**
- Adicionar props de tendencia: streakTrend, questionsTrend, focusTrend, hoursTrend
- Renderizar seta verde (para cima) ou vermelha (para baixo) ao lado dos valores
- Calcular tendencias no Index.tsx comparando semana atual vs anterior

**src/components/dashboard/NextActionCard.tsx**
- Adicionar prop opcional `reason` (ex: "Menor progresso", "Precisa revisar", "Maior prioridade")
- Adicionar prop `isEmpty` para mostrar CTA de cadastrar materias
- Mostrar o motivo da sugestao abaixo do nome da materia

**src/components/dashboard/ActivityHeatmap.tsx**
- Adicionar resumo textual no header: "X de 7 dias esta semana"
- Destacar visualmente o dia atual

### Ordem de renderizacao no dashboard (nova):
```text
1. NotificationPermissionBanner
2. UserHeader (com barra de XP)
3. TodaySummary (resumo do dia) -- NOVO
4. NextActionCard (inteligente) -- MELHORADO
5. StatsGrid (com tendencias) -- MELHORADO
6. WeakPointsCard (pontos fracos) -- NOVO
7. DailyMissions
8. CurrentPlan
9. ActivityHeatmap (com resumo) -- MELHORADO
10. LockedMetrics
```

Ou se o usuario for novo (sem dados):
```text
1. NotificationPermissionBanner
2. UserHeader
3. EmptyStateCard (onboarding) -- NOVO
4. DailyMissions
```

### Calculo de pontos fracos (Index.tsx)
```text
weakPoints = agrupar battleHistory por subject
  -> calcular correctAnswers / totalQuestions para cada
  -> ordenar por menor taxa de acerto
  -> retornar top 3
```

### Calculo de tendencias (Index.tsx)
```text
Para cada metrica, comparar soma da semana atual vs semana anterior:
- streakTrend: streak atual vs streak de 7 dias atras
- questionsTrend: questoes esta semana vs semana passada
- focusTrend: focusPercentage vs semana passada
- hoursTrend: horas esta semana vs semana passada
Resultado: "up" | "down" | "stable"
```

