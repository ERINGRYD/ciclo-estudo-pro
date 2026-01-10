import { useState } from 'react';
import BottomNav from "@/components/BottomNav";
import { Swords, Zap, Timer, Layers, Flame, History, Star, Clock, Repeat, Eye, Settings2, LayoutGrid } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const ColiseuPage = () => {
  const [questions, setQuestions] = useState(20);
  const [selectedSubject, setSelectedSubject] = useState('Todas');

  const battleModes = [
    {
      title: 'Escaramuça',
      description: 'Combate rápido para aquecimento mental.',
      icon: Timer,
      bgGradient: 'from-emerald-500 to-teal-700',
      shadowColor: 'shadow-emerald-500/20',
      iconBg: Timer,
      time: '5m',
      xp: '50 XP',
      border: false
    },
    {
      title: 'Combate Rápido',
      description: 'Enfrente questões variadas sem perder tempo.',
      icon: Swords,
      bgGradient: 'from-blue-500 to-indigo-700',
      shadowColor: 'shadow-blue-500/20',
      iconBg: Zap,
      time: '15m',
      xp: '150 XP',
      border: true
    },
    {
      title: 'Revisão Flashcards',
      description: 'Treine a memória com repetição espaçada.',
      icon: Layers,
      bgGradient: 'from-cyan-500 to-sky-600',
      shadowColor: 'shadow-cyan-500/20',
      iconBg: Layers,
      time: 'Variável',
      xp: '+XP',
      border: false
    },
    {
      title: 'Guerra Total',
      description: 'Simulado completo. Sobreviva se puder.',
      icon: Flame,
      bgGradient: 'from-slate-700 to-slate-900',
      shadowColor: 'shadow-slate-900/20',
      iconBg: Flame,
      time: '60m',
      xp: '500 XP',
      border: false
    },
    {
      title: 'Operação Resgate',
      description: 'Revisite seus erros e conquiste o aprendizado.',
      icon: History,
      bgGradient: 'from-violet-600 to-purple-700',
      shadowColor: 'shadow-violet-500/20',
      iconBg: Repeat,
      time: 'Erros',
      xp: '2x XP',
      border: false
    }
  ];

  const subjects = ['Todas', 'Matemática', 'História', 'Português'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
      <div className="max-w-md mx-auto min-h-screen pb-24">

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-4 pt-12 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-amber-900/80 text-sm font-semibold mb-1">
                <Swords className="h-4 w-4" />
                Arena de Combate
              </div>
              <h1 className="text-2xl font-black text-white drop-shadow">Coliseu</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-amber-900/80">Nível 12</div>
                <div className="flex items-center gap-1 text-white font-black text-sm">
                  1.250 XP
                  <Zap className="h-4 w-4 fill-current" />
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                JS
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Battle Modes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
                Modos de Batalha
              </h2>
              <span className="text-xs text-muted-foreground">Deslize →</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {battleModes.map((mode, index) => {
                const IconComponent = mode.icon;
                const IconBgComponent = mode.iconBg;
                return (
                  <div
                    key={index}
                    className={`shrink-0 w-40 rounded-2xl bg-gradient-to-br ${mode.bgGradient} p-4 ${mode.shadowColor} shadow-lg cursor-pointer hover:scale-105 transition-transform relative overflow-hidden ${mode.border ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconBgComponent className="h-4 w-4 text-white/80" />
                    </div>
                    <div className="mt-8">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-sm">{mode.title}</h3>
                      <p className="text-white/70 text-xs mt-1 line-clamp-2">{mode.description}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs">
                        <span className="flex items-center gap-1 text-white/80">
                          {mode.time === 'Erros' ? <Repeat className="h-3 w-3" /> : <Clock className="h-3 w-3" />} {mode.time}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-300 font-semibold">
                          <Star className="h-3 w-3" /> {mode.xp}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combat Settings */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Configurações de Combate</h2>
            </div>

            {/* Subject Selection */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Selecione o Inimigo (Matéria)
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                      selectedSubject === subject
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-accent'
                    }`}
                  >
                    {subject === 'Todas' && <LayoutGrid className="h-4 w-4" />}
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-muted-foreground">Intensidade</span>
                <span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {questions} Questões
                </span>
              </div>
              <div className="relative h-2 bg-gradient-to-r from-emerald-200 via-amber-200 to-red-200 dark:from-emerald-900 dark:via-amber-900 dark:to-red-900 rounded-full">
                <Slider
                  value={[questions]}
                  onValueChange={(value) => setQuestions(value[0])}
                  min={5}
                  max={50}
                  step={1}
                  className="absolute inset-0"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>5</span>
                <span>50</span>
              </div>
            </div>

            {/* Mission Estimate */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Estimativa de Missão</h4>
                <p className="text-xs text-muted-foreground">
                  ~{questions} min • Dificuldade Média
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Battle Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 z-10">
          <button className="w-full max-w-md mx-auto block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            <Swords className="h-6 w-6" />
            INICIAR COMBATE ÉPICO!
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ColiseuPage;
