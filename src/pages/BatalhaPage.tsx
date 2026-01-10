import BottomNav from "@/components/BottomNav";
import QuestionBattleDialog from "@/components/QuestionBattleDialog";
import { Search, Flame, Users, AlertTriangle, CheckCircle, Heart, Zap, Clock, Calendar, History, Shield, Lock, Trophy, Crown } from "lucide-react";
import { useState } from "react";

type TabType = "linha-de-frente" | "triagem" | "vencidos";

const BatalhaPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("linha-de-frente");
  const [searchQuery, setSearchQuery] = useState("");
  const [battleDialogOpen, setBattleDialogOpen] = useState(false);
  const [currentBattle, setCurrentBattle] = useState<{ name: string; subject: string }>({ name: "", subject: "" });

  const handleStartBattle = (enemyName: string, subject: string) => {
    setCurrentBattle({ name: enemyName, subject });
    setBattleDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B1120] text-foreground pb-24">
      {/* Header */}
      <header className="bg-white/80 dark:bg-[#0B1120]/80 border-b border-gray-100 dark:border-gray-800 pt-6 pb-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="px-4 max-w-md mx-auto">
          {/* Title Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-red-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none text-gray-900 dark:text-white mb-1">Campo de Batalha</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enfrente seus inimigos e conquiste</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                <Flame className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">5 dias</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="mb-1 text-blue-500 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">3</span>
              <span className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wide">Inimigos</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 m-2 animate-pulse"></div>
              <div className="mb-1 text-red-500 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">2</span>
              <span className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wide">Críticos</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="mb-1 text-green-500 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">15</span>
              <span className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wide">Dominados</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <span className="text-xs font-bold text-red-500 w-8 text-right">85%</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-500 fill-blue-500" />
              <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
              </div>
              <span className="text-xs font-bold text-blue-500 w-8 text-right">40%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" 
              placeholder="Buscar inimigos..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-primary hover:border-primary dark:hover:text-primary dark:hover:border-primary transition-all shadow-sm flex items-center justify-center shrink-0 w-[46px]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 dark:bg-gray-800/60 p-1 rounded-2xl grid grid-cols-3 gap-1">
          <button 
            onClick={() => setActiveTab("linha-de-frente")}
            className={`relative py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "linha-de-frente" 
                ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Linha de Frente
          </button>
          <button 
            onClick={() => setActiveTab("triagem")}
            className={`relative py-2 px-1 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "triagem" 
                ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-bold" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Triagem
          </button>
          <button 
            onClick={() => setActiveTab("vencidos")}
            className={`relative py-2 px-1 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "vencidos" 
                ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-bold" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Vencidos
          </button>
        </div>

        {/* Enemy Cards Section - Linha de Frente */}
        {activeTab === "linha-de-frente" && (
          <section className="space-y-4">
            {/* Critical Enemy Card - Logaritmos */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-red-200 dark:border-red-900/50 shadow-lg shadow-red-500/5 p-5 flex flex-col overflow-hidden">
              <div className="absolute top-5 right-5 z-10">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 mb-3 ring-4 ring-red-50/50 dark:ring-red-900/10">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Matemática</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white text-center leading-tight">Logaritmos</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Nível 5</p>
              </div>
              <div className="w-full h-1 bg-red-100 dark:bg-red-900/20 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-2/3"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-5 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-base font-bold text-gray-700 dark:text-gray-200">5</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-base font-bold text-gray-700 dark:text-gray-200">0/5</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-base font-bold text-gray-700 dark:text-gray-200">0</span>
                </div>
              </div>
              <div className="w-full space-y-2 mb-6 px-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">Próxima revisão:</span>
                  </div>
                  <div className="font-bold text-gray-700 dark:text-gray-300">15/12</div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <History className="w-3.5 h-3.5" />
                    <span className="font-medium">Última batalha:</span>
                  </div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">12/12/25</div>
                </div>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white text-base font-bold py-3.5 rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <Shield className="w-5 h-5" />
                Defender
              </button>
            </div>

            {/* Enemy Card - Termodinâmica */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md p-5 flex flex-col">
              <div className="absolute top-5 right-5 z-10">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 mb-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-1">Física</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Termodinâmica</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Nível 3</p>
              </div>
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-3/5"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-4 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">5</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">3/5</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">55</span>
                </div>
              </div>
              <div className="w-full space-y-2 mb-5 px-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-medium">Próxima revisão:</span>
                  </div>
                  <div className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">16/12</div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <History className="w-3.5 h-3.5" />
                    <span className="font-medium">Última batalha:</span>
                  </div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Ontem</div>
                </div>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-3 rounded-2xl shadow-sm shadow-red-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <Shield className="w-4 h-4" />
                Defender
              </button>
            </div>
          </section>
        )}

        {/* Enemy Cards Section - Triagem */}
        {activeTab === "triagem" && (
          <section className="space-y-4">
            {/* Locked Card - Sintaxe */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border-2 border-yellow-400 shadow-md p-5 flex flex-col overflow-hidden">
              <div className="absolute inset-0 z-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                <div className="bg-red-500 text-white p-4 py-3.5 rounded-2xl shadow-xl shadow-red-500/30 flex flex-col items-center justify-center min-w-[200px] hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Lock className="w-5 h-5" />
                    <span className="font-black text-sm tracking-wide">BLOQUEADO</span>
                  </div>
                  <p className="text-[11px] font-bold opacity-90">Até 15/12 • Revisão 2/5</p>
                </div>
              </div>
              <div className="absolute top-5 right-5 z-10 text-yellow-500 opacity-30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2 opacity-40 grayscale-[0.5]">
                <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Português</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Sintaxe</h3>
              </div>
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden opacity-40">
                <div className="h-full bg-yellow-500 rounded-full w-1/4"></div>
              </div>
              <button className="w-full bg-yellow-500 text-white text-sm font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 opacity-30 cursor-not-allowed">
                <Zap className="w-4 h-4" />
                Finalizar
              </button>
            </div>

            {/* Pending Card - Funções */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-orange-200 dark:border-orange-900/50 shadow-md p-5 flex flex-col">
              <div className="absolute top-5 right-5 z-10">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400 mb-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Matemática</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Funções</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Nível 2</p>
              </div>
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full w-1/2"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-4 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">10</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">5/10</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">120</span>
                </div>
              </div>
              <div className="w-full space-y-2 mb-5 px-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-medium">Próxima revisão:</span>
                  </div>
                  <div className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">20/12</div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <History className="w-3.5 h-3.5" />
                    <span className="font-medium">Última batalha:</span>
                  </div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">10/12/25</div>
                </div>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-3 rounded-2xl shadow-sm shadow-orange-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <Zap className="w-4 h-4" />
                Revisar
              </button>
            </div>

            {/* Pending Card - Gramática */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md p-5 flex flex-col">
              <div className="absolute top-5 right-5 z-10">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400 mb-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Português</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Gramática</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Nível 1</p>
              </div>
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-gray-300 rounded-full w-0"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-4 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">0</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">-</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">0</span>
                </div>
              </div>
              <button 
                onClick={() => handleStartBattle("Gramática", "Português")}
                className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <Shield className="w-4 h-4" />
                Iniciar Batalha
              </button>
            </div>
          </section>
        )}

        {/* Enemy Cards Section - Vencidos */}
        {activeTab === "vencidos" && (
          <section className="space-y-4">
            {/* Defeated Card - Equações */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-green-200 dark:border-green-900/50 shadow-md p-5 flex flex-col">
              <div className="absolute top-5 right-5 z-10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400 mb-3 ring-4 ring-green-50/50 dark:ring-green-900/10">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Matemática</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Equações 1º Grau</h3>
                <p className="text-[10px] text-green-500 font-bold mt-0.5">✓ Dominado</p>
              </div>
              <div className="w-full h-1 bg-green-100 dark:bg-green-900/20 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-4 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">25</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-sm font-bold text-green-500">23/25</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">450</span>
                </div>
              </div>
              <div className="w-full space-y-2 mb-5 px-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="font-medium">Conquistado em:</span>
                  </div>
                  <div className="font-bold text-green-600">05/12/25</div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span className="font-medium">Sequência:</span>
                  </div>
                  <div className="font-bold text-orange-500">5 vitórias seguidas</div>
                </div>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3 rounded-2xl shadow-sm shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <History className="w-4 h-4" />
                Revisar Novamente
              </button>
            </div>

            {/* Defeated Card - Cinemática */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-green-200 dark:border-green-900/50 shadow-md p-5 flex flex-col">
              <div className="absolute top-5 right-5 z-10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400 mb-3">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-1">Física</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Cinemática</h3>
                <p className="text-[10px] text-green-500 font-bold mt-0.5">✓ Dominado</p>
              </div>
              <div className="w-full h-1 bg-green-100 dark:bg-green-900/20 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-4 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">18</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-sm font-bold text-green-500">16/18</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">320</span>
                </div>
              </div>
              <div className="w-full space-y-2 mb-5 px-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="font-medium">Conquistado em:</span>
                  </div>
                  <div className="font-bold text-green-600">01/12/25</div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span className="font-medium">Sequência:</span>
                  </div>
                  <div className="font-bold text-orange-500">3 vitórias seguidas</div>
                </div>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3 rounded-2xl shadow-sm shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <History className="w-4 h-4" />
                Revisar Novamente
              </button>
            </div>

            {/* Defeated Card - Regra de Três */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-green-200 dark:border-green-900/50 shadow-md p-5 flex flex-col">
              <div className="absolute top-5 right-5 z-10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex flex-col items-center w-full mb-4 pt-2">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400 mb-3">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Matemática</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center leading-tight">Regra de Três</h3>
                <p className="text-[10px] text-green-500 font-bold mt-0.5">✓ Dominado</p>
              </div>
              <div className="w-full h-1 bg-green-100 dark:bg-green-900/20 rounded-full mb-5 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mb-4 divide-x divide-gray-100 dark:divide-gray-700">
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Questões</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">15</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Acertos</span>
                  <span className="block text-sm font-bold text-green-500">14/15</span>
                </div>
                <div className="text-center px-1">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">XP</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">280</span>
                </div>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3 rounded-2xl shadow-sm shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <History className="w-4 h-4" />
                Revisar Novamente
              </button>
            </div>
          </section>
        )}

        {/* Chefes de Matéria Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              Chefes de Matéria
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Boss Card - Direito Adm */}
            <div className="snap-start flex-none w-56 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-orange-100 dark:border-gray-600">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">Direito Adm.</h4>
                <span className="text-[10px] bg-white/80 dark:bg-black/20 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">10q</span>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-orange-500/20 flex items-center justify-center gap-1 mt-2">
                <Trophy className="w-3.5 h-3.5" /> Desafiar Chefe
              </button>
            </div>
            
            {/* Boss Card - Direito Penal (Locked) */}
            <div className="snap-start flex-none w-56 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 opacity-70">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">Direito Penal</h4>
                <span className="text-[10px] bg-white/80 dark:bg-black/20 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">5q</span>
              </div>
              <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 mt-2 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5" /> Precisa de 5 questões
              </button>
            </div>
          </div>
        </section>
      </main>

      <QuestionBattleDialog 
        open={battleDialogOpen} 
        onOpenChange={setBattleDialogOpen}
        enemyName={currentBattle.name}
        subject={currentBattle.subject}
      />
      <BottomNav />
    </div>
  );
};

export default BatalhaPage;
