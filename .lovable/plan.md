

## Sistema de Desbloqueio Progressivo por Nível

### Situacao Atual

O app ja possui uma base solida:
- 20 niveis com thresholds de XP
- `LockedMetrics` desbloqueia analytics nos niveis 3, 5, 8, 12
- Loja tem `levelRequired` em alguns itens
- `JornadaPage` mostra timeline mas sem recompensas concretas
- Missoes diarias escalam com nivel (2 missoes ate nv5, 3 depois)

O que falta: um sistema unificado que define **o que desbloqueia em cada nivel** e comunica isso ao usuario de forma clara.

---

### Plano

#### 1. Criar definicao centralizada de desbloqueios (`src/lib/levelUnlocks.ts`)

Um arquivo que mapeia cada nivel a suas recompensas:

```text
Nivel 1:  Acesso basico (Ciclo, Batalha)
Nivel 2:  Missao diaria bonus (+1 slot)
Nivel 3:  Metrica "Progresso por Materia" + Avatar Guerreiro disponivel na loja
Nivel 4:  Modo de batalha "Cronometrado"
Nivel 5:  3 missoes diarias + Metrica "Analise de Desempenho" + Tema Oceano
Nivel 7:  Modo "Operacao Resgate" (questoes erradas)
Nivel 8:  Metrica "Metas Inteligentes" + Avatar Rei disponivel
Nivel 10: Tema Midas + Trofeu Elite
Nivel 12: Metrica "Insights Avancados" + Titulo "Lenda Viva"
Nivel 15: Missao diaria especial (bonus XP)
Nivel 20: Recompensa final exclusiva
```

Cada entrada tera: `level`, `category` (feature/cosmetic/mission), `name`, `description`, `icon`.

#### 2. Dialog de Level Up com recompensas (`src/components/LevelUpDialog.tsx`)

Quando o usuario sobe de nivel:
- Dialog animado com confetti (ja existe `fireMilestoneConfetti`)
- Mostra o novo titulo
- Lista as recompensas desbloqueadas naquele nivel
- Botao "Continuar" fecha o dialog

Modificar `useUserProgress` para detectar mudanca de nivel e emitir um callback `onLevelUp`.

#### 3. Atualizar JornadaPage com recompensas visiveis

Cada milestone na timeline mostrara as recompensas especificas daquele nivel com icones e badges indicando se ja foi desbloqueado. Os itens bloqueados ficam com visual "locked" e mostram o que o usuario ganhara ao chegar la.

#### 4. Integrar verificacao de nivel nos componentes existentes

- **Loja**: ja tem `levelRequired` - sem mudanca necessaria
- **LockedMetrics**: ja tem niveis - sem mudanca necessaria  
- **DailyMissions**: usar `levelUnlocks` para determinar quantidade de missoes
- **Modos de batalha**: verificar nivel minimo antes de permitir acesso

#### 5. Secao "Proxima Recompensa" no Dashboard

Adicionar um card compacto no dashboard mostrando a proxima recompensa a ser desbloqueada e o progresso ate la, incentivando o usuario a continuar.

---

### Arquivos a criar/modificar

| Acao | Arquivo |
|------|---------|
| Criar | `src/lib/levelUnlocks.ts` - definicoes centralizadas |
| Criar | `src/components/LevelUpDialog.tsx` - celebracao de nivel |
| Modificar | `src/hooks/useUserProgress.ts` - detectar level up |
| Modificar | `src/pages/JornadaPage.tsx` - mostrar recompensas por nivel |
| Criar | `src/components/dashboard/NextRewardCard.tsx` - card de proxima recompensa |
| Modificar | `src/pages/Index.tsx` - incluir NextRewardCard e LevelUpDialog |

