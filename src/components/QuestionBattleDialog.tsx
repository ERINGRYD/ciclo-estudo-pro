import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Volume2, Zap, Clock, Hourglass, Search, Check } from "lucide-react";
import { Question, QuestionResult, BattleResult } from "@/types/question";
import { getQuestionsBySubject, calculateXP } from "@/lib/questions";
import { useTimer } from "@/hooks/useTimer";
import QuestionFeedback from "./QuestionFeedback";
import BattleResultDialog from "./BattleResultDialog";

interface QuestionBattleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enemyName?: string;
  subject?: string;
  questionCount?: number;
}

const QuestionBattleDialog = ({ 
  open, 
  onOpenChange, 
  enemyName = "Gramática", 
  subject = "Português",
  questionCount = 5 
}: QuestionBattleDialogProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<"certeza" | "duvida" | "chute" | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null);
  const [showBattleResult, setShowBattleResult] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  const { 
    totalSeconds, 
    questionSeconds, 
    formattedTotal, 
    formattedQuestion, 
    resetQuestionTimer,
    pauseTimer,
    resumeTimer 
  } = useTimer();

  // Initialize questions when dialog opens
  useEffect(() => {
    if (open) {
      const loadedQuestions = getQuestionsBySubject(subject, questionCount);
      setQuestions(loadedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setConfidenceLevel(null);
      setResults([]);
      setShowFeedback(false);
      setShowBattleResult(false);
      resetQuestionTimer();
    }
  }, [open, subject, questionCount]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleConfirm = () => {
    if (!selectedOption || !confidenceLevel || !currentQuestion) return;

    pauseTimer();

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const xpEarned = calculateXP(isCorrect, confidenceLevel);

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      confidence: confidenceLevel,
      xpEarned,
      timeSpent: questionSeconds,
    };

    setLastResult(result);
    setResults((prev) => [...prev, result]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    
    if (isLastQuestion) {
      // Calculate final results
      const allResults = [...results, lastResult!];
      const totalXP = allResults.reduce((sum, r) => sum + r.xpEarned, 0);
      const correctAnswers = allResults.filter((r) => r.isCorrect).length;

      setBattleResult({
        totalQuestions: questions.length,
        correctAnswers,
        totalXP,
        totalTime: totalSeconds,
        results: allResults,
      });
      setShowBattleResult(true);
    } else {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setConfidenceLevel(null);
      resetQuestionTimer();
      resumeTimer();
    }
  };

  const handleRetry = () => {
    setShowBattleResult(false);
    const loadedQuestions = getQuestionsBySubject(subject, questionCount);
    setQuestions(loadedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setConfidenceLevel(null);
    setResults([]);
    setShowFeedback(false);
    resetQuestionTimer();
    resumeTimer();
  };

  const handleGoHome = () => {
    setShowBattleResult(false);
    onOpenChange(false);
  };

  const getCorrectAnswerText = () => {
    if (!currentQuestion || !lastResult) return "";
    const option = currentQuestion.options.find((o) => o.letter === lastResult.correctAnswer);
    return `${lastResult.correctAnswer}) ${option?.text || ""}`;
  };

  if (!currentQuestion) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300";
      case "medium": return "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300";
      case "hard": return "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300";
      default: return "bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-300";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Fácil";
      case "medium": return "Médio";
      case "hard": return "Difícil";
      default: return difficulty;
    }
  };

  return (
    <>
      <Dialog open={open && !showBattleResult} onOpenChange={onOpenChange}>
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
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  Questão {currentQuestionIndex + 1} de {questions.length}
                </span>
              </div>
              <button className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
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
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tabular-nums">{formattedTotal}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Hourglass className="w-4 h-4" />
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">Questão</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tabular-nums">{formattedQuestion}</span>
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
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {currentQuestion.subject}
                </span>
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
                  {currentQuestion.topic}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {getDifficultyLabel(currentQuestion.difficulty)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 text-[10px] text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                <span><span className="font-bold text-gray-600 dark:text-gray-300">Banca:</span> {currentQuestion.banca}</span>
                <span><span className="font-bold text-gray-600 dark:text-gray-300">Ano:</span> {currentQuestion.year}</span>
                <span><span className="font-bold text-gray-600 dark:text-gray-300">Cargo:</span> {currentQuestion.cargo}</span>
                <span><span className="font-bold text-gray-600 dark:text-gray-300">Instituição:</span> {currentQuestion.instituicao}</span>
              </div>

              {/* Question Body */}
              <div className="p-5">
                <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                  {currentQuestion.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {currentQuestion.text}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option) => (
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
                  <span className={`text-sm font-semibold transition-colors text-left ${
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

          {/* Feedback Overlay */}
          {showFeedback && lastResult && (
            <QuestionFeedback
              isCorrect={lastResult.isCorrect}
              correctAnswer={getCorrectAnswerText()}
              selectedAnswer={lastResult.selectedAnswer}
              xpEarned={lastResult.xpEarned}
              onNext={handleNextQuestion}
              isLastQuestion={isLastQuestion}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Battle Result Dialog */}
      {battleResult && (
        <BattleResultDialog
          open={showBattleResult}
          onOpenChange={setShowBattleResult}
          result={battleResult}
          onRetry={handleRetry}
          onGoHome={handleGoHome}
        />
      )}
    </>
  );
};

export default QuestionBattleDialog;
