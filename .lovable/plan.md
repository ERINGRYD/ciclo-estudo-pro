
## Análise Completa do App

### Visão Geral
Este é um app de estudos gamificado com 9 páginas e uma arquitetura bem estruturada. Todo o estado é persistido em `localStorage` (sem backend). Os dados ficam apenas no dispositivo do usuário.

---

### Estrutura de Páginas

| Página | Rota | Propósito |
|--------|------|-----------|
| Index | `/` | Dashboard principal com estatísticas, missões, progresso |
| CicloPage | `/ciclo` | Gestão de matérias, timer Pomodoro, histórico de estudo |
| BatalhaPage | `/batalha` | Inimigos (matérias) com visual RPG — dados mockados |
| ColiseuPage | `/coliseu` | Arena de batalha real com questões, modos e histórico |
| LojaPage | `/loja` | Loja de temas, avatares, títulos e troféus via XP |
| PerfilPage | `/perfil` | Estatísticas pessoais, conquistas e itens equipados |
| JornadaPage | `/jornada` | Timeline de milestones com confetti e sons |
| ConfiguracoesPage | `/configuracoes` | Configurações do app |
| MaisPage | `/mais` | Menu secundário (acesso a Perfil, Jornada, Configurações) |

---

### Arquitetura de Estado (100% localStorage)

```text
user-progress         ← XP, nível, título, batalhas totais
battle-history        ← Histórico completo de batalhas (até 100)
study-cycle-subjects  ← Matérias e progresso de estudo
study-cycle-sessions  ← Sessões de estudo com data/duração
study-cycle-goals     ← Metas semanais
study-cycle-achievements ← Conquistas desbloqueadas
daily-missions        ← Missões diárias (reset à meia-noite)
inventory             ← Itens comprados e equipados
mission-streak        ← Sequência de missões completadas
```

---

### Sistema de Progressão (20 Níveis)

**XP Thresholds**: 0 → 100 → 250 → 450 → ... → 10.450 XP

**Desbloqueios definidos em `src/lib/levelUnlocks.ts`:**
- Nv.1: Ciclo + Batalha básicos
- Nv.2: Missão bônus
- Nv.3: Métrica "Progresso por Matéria" + Avatar Guerreiro
- Nv.4: Modo Cronometrado
- Nv.5: 3 missões diárias + Análise de Desempenho + Tema Oceano
- Nv.7: Operação Resgate (revisão de erros)
- Nv.8: Metas Inteligentes + Avatar Rei
- Nv.10: Tema Midas + Troféu Elite
- Nv.12: Insights Avançados + Título "Lenda Viva"
- Nv.15: Missão Especial (XP dobrado)
- Nv.20: Coroa Suprema + Modo Lendário

---

### Sistemas Funcionais ✅

1. **Sistema de XP/Nível** — Completo, com `LevelUpDialog` animado ao subir de nível
2. **Missões Diárias** — 2-3 missões/dia baseadas no nível, reset automático à meia-noite
3. **Sistema de Batalha** — Questões reais em `src/lib/questions.ts`, histórico persistido
4. **Loja** — Compra/equipe de temas, avatares, títulos e troféus com XP
5. **Jornada** — Timeline visual com confetti + som em milestones importantes
6. **Dashboard** — Stats em tempo real: streak, horas, questões, taxa de acerto, pontos fracos
7. **Pomodoro** — Timer configurável com sons de notificação
8. **Ciclo de Estudos** — Gestão de matérias com progresso e sessões
9. **Activity Heatmap** — Visualização de consistência de estudos
10. **Achievements** — Sistema de conquistas com verificação automática

---

### Pontos de Atenção / Oportunidades de Melhoria

**BatalhaPage (dados mockados):**
- Os cards de inimigos (Logaritmos, Termodinâmica) são hardcoded — não refletem as matérias reais do usuário
- As stats "3 Inimigos", "2 Críticos", "15 Dominados" são estáticas
- A barra de HP (85%) e energia (40%) são decorativas

**Desconexão entre ColiseuPage e BatalhaPage:**
- O usuário pode iniciar batalhas reais no Coliseu, mas a BatalhaPage é temática e desconectada do histórico real

**Verificação de nível nos modos de batalha:**
- O plano define que "Modo Cronometrado" (nv.4) e "Operação Resgate" (nv.7) deveriam ser bloqueados por nível — a Operação Resgate verifica se há erros, mas não verifica o nível mínimo. O Cronometrado não existe como modo separado ainda.

**Escalabilidade do banco de questões:**
- `src/lib/questions.ts` contém as questões hardcoded — limitado em quantidade e matérias

**Sem sincronização entre dispositivos:**
- Todo dado é local. Usuário perde progresso ao trocar de dispositivo/navegador

---

### Fluxo de XP
```text
Batalha no Coliseu → recordBattle() → XP adicionado → nível recalculado
                                                        ↓
                                               LevelUpDialog aparece
                                               + fireMilestoneConfetti()
                                               + recompensas listadas

Missão diária concluída → claimMissionReward() → addXP() → mesmo fluxo
```

---

### Dependências Principais
- **framer-motion** — Animações na Jornada e dashboard
- **canvas-confetti** — Efeitos de confetti
- **recharts** — Gráfico semanal e ciclo de estudos
- **radix-ui** — Todos os componentes de UI (dialogs, tooltips, etc.)
- **react-router-dom** — Navegação entre páginas
- **sonner** — Notificações toast
- **vite-plugin-pwa** — App instalável como PWA

---

### Resumo
O app tem uma base sólida com 9 páginas funcionais, sistema de progressão bem definido com 20 níveis, loja, batalhas, missões diárias e animações celebratórias. As principais oportunidades de melhoria são: conectar a BatalhaPage com dados reais do usuário, implementar o bloqueio por nível nos modos de batalha no Coliseu, e expandir o banco de questões.
