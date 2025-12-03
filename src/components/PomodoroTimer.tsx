import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Subject } from "@/types/study";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PomodoroTimerProps {
  subject: Subject | null;
  onClose: () => void;
}

const PomodoroTimer = ({ subject, onClose }: PomodoroTimerProps) => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setMinutes(isBreak ? breakTime : workTime);
      setSeconds(0);
    }
  }, [workTime, breakTime, isBreak]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                setIsRunning(false);
                handleTimerComplete();
                return isBreak ? workTime : breakTime;
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
  }, [isRunning, isBreak, workTime, breakTime]);

  const handleTimerComplete = () => {
    setIsBreak(!isBreak);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(isBreak ? breakTime : workTime);
    setSeconds(0);
  };

  const totalSeconds = (isBreak ? breakTime : workTime) * 60;
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
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettings(!showSettings)}
                disabled={isRunning}
              >
                <Settings2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {showSettings ? (
            <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Tempo de Foco</Label>
                  <span className="text-sm font-medium text-foreground">{workTime} min</span>
                </div>
                <Slider
                  value={[workTime]}
                  onValueChange={([value]) => setWorkTime(value)}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Tempo de Pausa</Label>
                  <span className="text-sm font-medium text-foreground">{breakTime} min</span>
                </div>
                <Slider
                  value={[breakTime]}
                  onValueChange={([value]) => setBreakTime(value)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowSettings(false)}
              >
                Fechar Configurações
              </Button>
            </div>
          ) : (
            <>
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
                <span>Trabalho: {workTime} min</span>
                <span>Pausa: {breakTime} min</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PomodoroTimer;