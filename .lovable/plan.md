

# Temas organizados por assertividade no Campo de Batalha

## Problema atual
O Campo de Batalha mostra estatísticas apenas por **matéria** (Português, Física, etc.), mas não detalha os **temas/tópicos** dentro de cada matéria (ex: Cinemática, Gramática, Genética). Além disso, o histórico de batalha atual só armazena `wrongQuestionIds`, não todas as questões respondidas -- impossibilitando calcular assertividade por tópico.

## Plano

### 1. Expandir o modelo de dados de batalha
Adicionar um campo `answeredQuestionIds: number[]` ao tipo `BattleHistory` (em `src/types/question.ts` e `src/hooks/useUserProgress.ts`) para armazenar **todas** as questões respondidas, não apenas as erradas. Isso permite calcular acertos por tópico.

### 2. Gravar todas as questões respondidas no `recordBattle`
No `QuestionBattleDialog.tsx`, passar os IDs de todas as questões respondidas ao chamar `recordBattle()`. No hook `useUserProgress`, salvar esse novo campo no localStorage.

### 3. Calcular estatísticas por tópico
No `BatalhaPage.tsx`, criar um `useMemo` que cruza `answeredQuestionIds` e `wrongQuestionIds` com o banco de questões (`sampleQuestions`) para gerar stats por tópico:

```text
TopicStats {
  subject, topic,
  totalAnswered, correctAnswers,
  accuracy (%)
}
```

Ordenar por accuracy (menor primeiro = mais fraco).

### 4. Adicionar seção de tópicos nos cards de matéria
Dentro de cada `EnemyCard`, adicionar uma lista colapsável (usando Collapsible) mostrando os tópicos daquela matéria ordenados por assertividade:
- Barra de progresso colorida (vermelho < 50%, amarelo 50-79%, verde >= 80%)
- Porcentagem de acerto e contagem (ex: "3/5 - 60%")
- Tópicos com pior desempenho aparecem primeiro

### 5. Seção global "Tópicos Fracos"
Adicionar uma seção no topo da aba "Linha de Frente" mostrando os 5 tópicos com menor assertividade geral, com botão para iniciar batalha filtrada por aquele tópico.

### Arquivos modificados
- `src/types/question.ts` -- adicionar `answeredQuestionIds` ao `BattleHistory`
- `src/hooks/useUserProgress.ts` -- salvar novo campo
- `src/components/QuestionBattleDialog.tsx` -- passar IDs respondidos
- `src/pages/BatalhaPage.tsx` -- calcular e exibir stats por tópico

