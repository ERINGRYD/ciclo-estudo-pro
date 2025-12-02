import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Subject } from "@/types/study";

interface PomodoroTimerProps {
  subject: Subject | null;
  onClose: () => void;
}

const PomodoroTimer = ({ subject, onClose }: PomodoroTimerProps) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const WORK_TIME = 25;
  const BREAK_TIME = 5;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                // Timer completed
                setIsRunning(false);
                handleTimerComplete();
                return isBreak ? WORK_TIME : BREAK_TIME;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isBreak]);

  const handleTimerComplete = () => {
    setIsBreak(!isBreak);
    // Play sound or notification here
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(isBreak ? BREAK_TIME : WORK_TIME);
    setSeconds(0);
  };

  const totalSeconds = (isBreak ? BREAK_TIME : WORK_TIME) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <Dialog open={!!subject} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: subject?.color }}
              />
              <DialogTitle>{subject?.name}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="text-center">
            <div className="inline-block px-4 py-2 rounded-lg bg-muted mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {isBreak ? "Pausa" : "Foco"}
              </span>
            </div>
            <div className="text-7xl font-bold text-foreground tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-12 w-12"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={toggleTimer}
              className="h-12 px-8"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground px-2">
            <span>Trabalho: {WORK_TIME} min</span>
            <span>Pausa: {BREAK_TIME} min</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PomodoroTimer;
