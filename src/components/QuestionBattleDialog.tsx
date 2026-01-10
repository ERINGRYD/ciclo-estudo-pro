import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Volume2, Zap, Clock, Hourglass, Search, Check, Home, RefreshCw, Swords } from "lucide-react";
import BottomNav from "./BottomNav";

interface QuestionBattleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enemyName?: string;
  subject?: string;
}

const QuestionBattleDialog = ({ open, onOpenChange, enemyName = "Gramática", subject = "Português" }: QuestionBattleDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<"certeza" | "duvida" | "chute" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalTime, setTotalTime] = useState("14:20");
  const [questionTime, setQuestionTime] = useState("00:45");

  const options = [
    { letter: "A", text: "1889" },
    { letter: "B", text: "1822" },
    { letter: "C", text: "1500" },
    { letter: "D", text: "1789" },
  ];

  const handleConfirm = () => {
    if (selectedOption && confidenceLevel) {
      // Handle answer submission
      console.log("Answer:", selectedOption, "Confidence:", confidenceLevel);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-[100dvh] max-h-[100dvh] p-0 gap-0 border-0 rounded-none bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-[#0B1120] border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => onOpenChange(false)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Progresso</span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">Questão {currentQuestion} de 5</span>
            </div>
            <button className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Battle Status + Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Batalha Ativa</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Total</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{totalTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Hourglass className="w-4 h-4" />
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Questão</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{questionTime}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-32">
          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-5">
            {/* Question Meta */}
            <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-700">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{subject}</span>
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-md">Conceitos Básicos</span>
              <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-md">easy</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 text-[10px] text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
              <span><span className="font-bold text-gray-600 dark:text-gray-300">Banca:</span> FGV</span>
              <span><span className="font-bold text-gray-600 dark:text-gray-300">Ano:</span> 2023</span>
              <span><span className="font-bold text-gray-600 dark:text-gray-300">Cargo:</span> Analista</span>
              <span><span className="font-bold text-gray-600 dark:text-gray-300">Instituição:</span> IBGE</span>
            </div>

            {/* Question Body */}
            <div className="p-5">
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3 leading-tight">Independência do Brasil</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Em que ano ocorreu a Independência do Brasil?
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {options.map((option) => (
              <button
                key={option.letter}
                onClick={() => setSelectedOption(option.letter)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === option.letter
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <span className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-black transition-colors ${
                  selectedOption === option.letter
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {option.letter}
                </span>
                <span className={`text-sm font-semibold transition-colors ${
                  selectedOption === option.letter
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  {option.text}
                </span>
              </button>
            ))}
          </div>

          {/* Confidence Level */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nível de Confiança</p>
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">XP Multiplier</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setConfidenceLevel("certeza")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  confidenceLevel === "certeza"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                }`}
              >
                <Check className={`w-5 h-5 mb-1 ${confidenceLevel === "certeza" ? "text-emerald-500" : "text-gray-400"}`} />
                <span className={`text-xs font-bold ${confidenceLevel === "certeza" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"}`}>✅Certeza</span>
                <span className="text-[10px] text-emerald-500 font-bold mt-0.5">+5 XP</span>
              </button>
              <button
                onClick={() => setConfidenceLevel("duvida")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  confidenceLevel === "duvida"
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
                }`}
              >
                <span className={`text-lg mb-1 ${confidenceLevel === "duvida" ? "opacity-100" : "opacity-50"}`}>🤔</span>
                <span className={`text-xs font-bold ${confidenceLevel === "duvida" ? "text-yellow-600 dark:text-yellow-400" : "text-gray-600 dark:text-gray-400"}`}>🟡Dúvida</span>
                <span className="text-[10px] text-yellow-500 font-bold mt-0.5">+3 XP</span>
              </button>
              <button
                onClick={() => setConfidenceLevel("chute")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  confidenceLevel === "chute"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                }`}
              >
                <span className={`text-lg mb-1 ${confidenceLevel === "chute" ? "opacity-100" : "opacity-50"}`}>🎲</span>
                <span className={`text-xs font-bold ${confidenceLevel === "chute" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>🔵Chute</span>
                <span className="text-[10px] text-blue-500 font-bold mt-0.5">+1 XP</span>
              </button>
            </div>
          </div>
        </main>

        {/* Fixed Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-white/0 dark:from-[#0B1120] dark:via-[#0B1120] dark:to-transparent pb-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedOption || !confidenceLevel}
            className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              selectedOption && confidenceLevel
                ? "bg-primary hover:bg-primary/90 text-white shadow-primary/30"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <Search className="w-5 h-5" />
            Confirmar Resposta
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionBattleDialog;
