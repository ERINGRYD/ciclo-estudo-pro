import { CheckCircle2, XCircle, Zap, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface QuestionFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  xpEarned: number;
  explanation?: string;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuestionFeedback = ({
  isCorrect,
  correctAnswer,
  selectedAnswer,
  xpEarned,
  explanation,
  onNext,
  isLastQuestion,
}: QuestionFeedbackProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade-in">
      <div
        className={`w-full max-w-md rounded-t-3xl p-6 pb-8 animate-slide-up ${
          isCorrect
            ? "bg-emerald-500 dark:bg-emerald-600"
            : "bg-red-500 dark:bg-red-600"
        }`}
        style={{
          animation: "slideUp 0.3s ease-out forwards",
        }}
      >
        {/* Icon and Message */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            {isCorrect ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <XCircle className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              {isCorrect ? "Correto!" : "Incorreto!"}
            </h3>
            {isCorrect && (
              <div className="flex items-center gap-1.5 mt-1">
                <Zap className="w-4 h-4 text-amber-300" />
                <span className="text-white font-bold">+{xpEarned} XP</span>
              </div>
            )}
          </div>
        </div>

        {/* Correct Answer (if wrong) */}
        {!isCorrect && (
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <p className="text-white/80 text-sm font-medium mb-1">Resposta correta:</p>
            <p className="text-white font-bold text-lg">{correctAnswer}</p>
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-white/90 text-sm leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Next Button */}
        <Button
          onClick={onNext}
          className="w-full h-14 rounded-xl bg-white text-gray-900 hover:bg-white/90 font-bold text-base"
        >
          {isLastQuestion ? "Ver Resultado" : "Próxima Questão"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionFeedback;
