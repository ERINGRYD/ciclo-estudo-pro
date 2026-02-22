
# Substituir Dados Hardcoded por Calculos Reais no Dashboard

## Problema Atual
O dashboard exibe valores fictcios em tres componentes principais:
- **StatsGrid**: usa fallbacks como `streak || 5`, `recordStreak={12}`, `questionsAnswered || 124`
- **CurrentPlan**: totalmente hardcoded (`"ESA 2024 - Elite"`, `currentWeek={14}`, `adherencePercentage={92}`)
- **LockedMetrics**: 4 sub-componentes com dados estaticos (materias, taxas de acerto, metas, insights)

## Fontes de Dados Reais Disponiveis
- `localStorage["study-cycle-subjects"]` - materias com `studiedMinutes`, `totalMinutes`, `themes`
- `localStorage["study-cycle-sessions"]` - historico de sessoes com `focusMinutes`, `date`, `subjectName`
- `localStorage["user-progress"]` - XP, questoes respondidas/corretas, batalhas
- `localStorage["battle-history"]` - historico detalhado de batalhas com `correctAnswers`, `totalQuestions`, `date`, `subject`

## Alteracoes Planejadas

### 1. Index.tsx - Remover fallbacks do StatsGrid
- Remover todos os operadores `||` com valores fake
- Calcular `recordStreak` real a partir do historico de sessoes (maior sequencia consecutiva)
- Calcular `questionsToday` a partir do battle-history de hoje (nao de minutos/5)
- Passar valores reais (exibindo 0 quando nao ha dados)

### 2. Index.tsx - CurrentPlan com dados reais
- Calcular `currentWeek` como numero de semanas desde a primeira sessao
- Calcular `adherencePercentage` como (dias com sessao / dias totais desde inicio) * 100
- Mostrar nome baseado no numero de materias cadastradas
- Se nao houver sessoes, esconder o componente

### 3. LockedMetrics.tsx - Receber dados reais via props
Adicionar props `subjects`, `sessions`, `battleHistory` ao componente e repassar para os sub-componentes:

**SubjectProgressMetric** (Nivel 3):
- Listar materias reais do usuario com progresso `studiedMinutes / totalMinutes`
- Usar as cores reais de cada materia
- Exibir "Nenhuma materia cadastrada" se vazio

**PerformanceAnalysisMetric** (Nivel 5):
- Taxa de acerto real: `totalCorrectAnswers / totalQuestionsAnswered * 100`
- Melhora semanal: comparar taxa de acerto da semana atual vs semana anterior no battle-history

**SmartGoalsMetric** (Nivel 8):
- Meta semanal baseada em media de questoes por semana
- Progresso = questoes respondidas esta semana vs meta

**AdvancedInsightsMetric** (Nivel 12):
- Melhor horario: agrupar sessoes por hora do dia e encontrar o pico
- Materia mais forte: materia com maior taxa de acerto nas batalhas

## Detalhes Tecnicos

### Calculos no Index.tsx
```text
recordStreak = maior sequencia consecutiva de dias com sessao no historico
questionsToday = soma de totalQuestions das batalhas de hoje
currentWeek = Math.ceil((hoje - dataPrimeiraSessao) / 7)
adherence = (diasComSessao / diasDesdeInicio) * 100
```

### Nova interface do LockedMetrics
```text
LockedMetricsProps {
  userLevel: number
  subjects: Subject[]
  sessions: StudySession[]
  battleHistory: BattleHistory[]
  progress: UserProgress
}
```

### Arquivos modificados
1. **src/pages/Index.tsx** - Remover fallbacks, calcular recordStreak, passar dados reais para CurrentPlan e LockedMetrics
2. **src/components/dashboard/LockedMetrics.tsx** - Aceitar props de dados reais, calcular metricas nos sub-componentes
3. **src/components/dashboard/CurrentPlan.tsx** - Nenhuma mudanca na interface (so recebera valores reais)
4. **src/components/dashboard/StatsGrid.tsx** - Nenhuma mudanca (so recebera valores reais)
