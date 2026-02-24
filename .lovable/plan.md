

# Melhorias do Dashboard - Fase 2

## Analise da Tela Atual

Apos as melhorias anteriores, o dashboard possui boa estrutura mas ainda apresenta oportunidades significativas:

### Problemas Identificados

1. **Falta de "Greeting" contextual** - O header mostra "Ola, Campeao" sempre igual, sem considerar horario do dia ou estado do usuario (ex: "Bom dia", "Boa noite", "Voce voltou!")

2. **Sem indicador de "ultima sessao"** - O usuario nao sabe ha quanto tempo estudou pela ultima vez. Isso e critico para criar urgencia e manter consistencia

3. **TodaySummary sem meta diaria** - Mostra minutos e questoes do dia mas nao compara com uma meta (ex: "45/60 min hoje")

4. **CurrentPlan sem detalhamento por materia** - Mostra aderencia geral mas nao indica quais materias estao atrasadas vs adiantadas

5. **WeakPointsCard desaparece sem dados** - Quando nao ha batalhas suficientes, a secao some completamente. Deveria mostrar uma mensagem incentivando o usuario

6. **LockedMetrics duplica informacao** - SubjectProgressMetric (nivel 3) mostra progresso por materia, mas poderia ser mais util mostrando distribuicao de tempo semanal

7. **Sem "Quick Actions"** - Nao ha atalhos rapidos para as acoes mais comuns (iniciar sessao, resolver questoes, ver historico)

8. **Sem motivacao/frase do dia** - Falta um elemento motivacional que mude diariamente

9. **CurrentPlan botao "Detalhes" nao funciona** - O botao nao leva a lugar nenhum

10. **ActivityHeatmap sem interacao** - O heatmap mostra dados visuais mas o usuario nao consegue tocar num dia para ver detalhes

---

## Melhorias Planejadas

### 1. UserHeader contextual com saudacao dinamica
- Saudacao baseada no horario: "Bom dia", "Boa tarde", "Boa noite"
- Mostrar ha quanto tempo foi a ultima sessao: "Ultima sessao: hoje" ou "Ultima sessao: ha 3 dias"
- Se o usuario estiver sem estudar ha mais de 2 dias, mostrar alerta sutil

### 2. Quick Actions (Acoes Rapidas)
Novo componente com 3 botoes horizontais logo apos o UserHeader:
- "Estudar" (link para /ciclo)
- "Questoes" (link para /coliseu)
- "Batalha" (link para /batalha)
Cards compactos com icone, visualmente distintos

### 3. TodaySummary com meta diaria e barra de progresso circular
- Adicionar meta diaria configuravel (padrao: 60 min de estudo, 20 questoes)
- Mostrar progresso como barra circular/ring ao inves de so numero
- Adicionar indicador visual quando a meta e atingida

### 4. CurrentPlan com distribuicao por materia
- Expandir o card para mostrar top 3 materias com mais/menos aderencia
- Mudar botao "Detalhes" para linkar a `/ciclo`
- Mostrar dias restantes na semana para atingir metas

### 5. WeakPointsCard com estado vazio
- Quando nao ha pontos fracos, mostrar mensagem: "Resolva questoes no Coliseu para descobrir seus pontos fracos"
- Adicionar icone de tendencia (melhorando/piorando) por materia

### 6. Frase motivacional do dia
- Novo componente pequeno com frase motivacional rotativa
- Array de frases relacionadas a estudo/aprovacao
- Muda com base no dia do ano

### 7. Resumo semanal compacto
- Novo componente mostrando resumo da semana em formato de mini-grafico
- Barras verticais para cada dia da semana (seg-dom) mostrando minutos estudados
- Destaque visual para o dia atual

---

## Detalhes Tecnicos

### Arquivos a criar:
- `src/components/dashboard/QuickActions.tsx` - 3 botoes de acao rapida horizontais
- `src/components/dashboard/MotivationalQuote.tsx` - Frase motivacional do dia
- `src/components/dashboard/WeeklyBarChart.tsx` - Mini grafico de barras da semana

### Arquivos a modificar:

**src/components/dashboard/UserHeader.tsx**
- Adicionar logica de saudacao por horario (getGreeting)
- Calcular e exibir "ultima sessao" a partir das sessions via nova prop `lastSessionDate`
- Alerta visual se sem sessao ha 3+ dias

**src/components/dashboard/TodaySummary.tsx**
- Adicionar props `dailyMinuteGoal` e `dailyQuestionGoal` (com defaults 60/20)
- Exibir barra de progresso em cada stat mostrando % da meta
- Efeito visual quando meta atingida (cor verde, icone de check)

**src/components/dashboard/WeakPointsCard.tsx**
- Mostrar estado vazio com CTA quando `weakPoints` esta vazio (em vez de `return null`)
- Adicionar prop `trends` para indicar se a materia esta melhorando ou piorando

**src/components/dashboard/CurrentPlan.tsx**
- Adicionar prop `subjectAdherence` (array de materias com % aderencia individual)
- Mostrar top 3 materias dentro do card
- Botao "Detalhes" linka para `/ciclo`

**src/pages/Index.tsx**
- Calcular `lastSessionDate` a partir de sessions
- Calcular `subjectAdherence` para CurrentPlan
- Calcular tendencias de pontos fracos (semana atual vs anterior)
- Inserir QuickActions, MotivationalQuote e WeeklyBarChart no layout
- Passar novas props para componentes modificados

### Nova ordem de renderizacao:
```text
1. NotificationPermissionBanner
2. UserHeader (contextual + ultima sessao)
3. MotivationalQuote (frase do dia)
4. QuickActions (3 botoes)
5. TodaySummary (com metas)
6. NextActionCard (inteligente)
7. WeeklyBarChart (grafico semanal)
8. StatsGrid (com tendencias)
9. WeakPointsCard (com estado vazio e tendencias)
10. DailyMissions
11. CurrentPlan (com materias)
12. ActivityHeatmap
13. LockedMetrics
```

### Calculo de ultima sessao (Index.tsx):
```text
lastSessionDate = sessions.length > 0
  ? new Date(Math.max(...sessions.map(s => new Date(s.date).getTime())))
  : null
```

### Calculo de aderencia por materia:
```text
Para cada subject:
  sessoesDaMateria = sessions.filter(s => s.subjectName === subject.name)
  diasComSessao = Set(sessoesDaMateria.map(date)).size
  diasTotais = ceil((hoje - primeiraSessao) / 86400000)
  aderencia = (diasComSessao / diasTotais) * 100
```

### Frases motivacionais:
Array de ~30 frases. Selecao baseada em `dayOfYear % frases.length` para consistencia diaria.

### WeeklyBarChart:
- 7 barras (Seg-Dom)
- Altura proporcional aos minutos do dia
- Dia atual destacado com cor primaria
- Dias futuros em cinza claro
- Tooltip com minutos exatos

