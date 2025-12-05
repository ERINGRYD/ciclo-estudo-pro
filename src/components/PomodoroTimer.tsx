import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X, Settings2, Check, Square } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Subject } from "@/types/study";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { playPomodoroEndSound, playBreakEndSound } from "@/lib/sounds";

interface PomodoroTimerProps {
  subject: Subject | null;
  themeName?: string;
  onClose: () => void;
  onSessionComplete?: (subjectName: string, subjectColor: string, focusMinutes: number, breakMinutes: number, themeName?: string) => void;
}

const PomodoroTimer = ({ subject, themeName, onClose, onSessionComplete }: PomodoroTimerProps) => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [totalPauseTime, setTotalPauseTime] = useState(0); // Time spent with timer paused
  const [currentFocusElapsed, setCurrentFocusElapsed] = useState(0); // Seconds elapsed in current focus session
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setMinutes(isBreak ? breakTime : workTime);
      setSeconds(0);
    }
  }, [workTime, breakTime, isBreak]);

  // Reset state when subject changes
  useEffect(() => {
    if (subject) {
      setCompletedFocusSessions(0);
      setTotalBreakTime(0);
      setTotalPauseTime(0);
      setCurrentFocusElapsed(0);
      setIsBreak(false);
      setIsRunning(false);
      setMinutes(workTime);
      setSeconds(0);
      pauseStartRef.current = null;
    }
  }, [subject?.name]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Track elapsed time in current focus session
        if (!isBreak) {
          setCurrentFocusElapsed(prev => prev + 1);
        }
        
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
    if (!isBreak) {
      // Completed a focus session
      setCompletedFocusSessions(prev => prev + 1);
      setCurrentFocusElapsed(0); // Reset for next session
      playPomodoroEndSound();
    } else {
      // Completed a break session
      setTotalBreakTime(prev => prev + breakTime);
      playBreakEndSound();
    }
    setIsBreak(!isBreak);
  };

  const toggleTimer = () => {
    if (isRunning) {
      // Pausing - record pause start time
      pauseStartRef.current = Date.now();
    } else {
      // Resuming - add pause duration
      if (pauseStartRef.current) {
        const pauseDuration = Math.floor((Date.now() - pauseStartRef.current) / 1000);
        setTotalPauseTime(prev => prev + pauseDuration);
        pauseStartRef.current = null;
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(isBreak ? breakTime : workTime);
    setSeconds(0);
  };

  const handleFinishSession = () => {
    if (subject && onSessionComplete && completedFocusSessions > 0) {
      const totalFocusMinutes = completedFocusSessions * workTime;
      const pauseMinutes = Math.floor(totalPauseTime / 60);
      onSessionComplete(subject.name, subject.color, totalFocusMinutes, totalBreakTime + pauseMinutes, themeName);
    }
    resetAllState();
    onClose();
  };

  const handleStopAndSave = () => {
    if (subject && onSessionComplete) {
      // Calculate total focus time: completed sessions + current partial session
      const completedMinutes = completedFocusSessions * workTime;
      const partialMinutes = Math.floor(currentFocusElapsed / 60);
      const totalFocusMinutes = completedMinutes + partialMinutes;
      
      // Add current pause if timer is paused
      let finalPauseTime = totalPauseTime;
      if (pauseStartRef.current) {
        finalPauseTime += Math.floor((Date.now() - pauseStartRef.current) / 1000);
      }
      const pauseMinutes = Math.floor(finalPauseTime / 60);
      
      if (totalFocusMinutes > 0) {
        onSessionComplete(subject.name, subject.color, totalFocusMinutes, totalBreakTime + pauseMinutes, themeName);
      }
    }
    resetAllState();
    onClose();
  };

  const resetAllState = () => {
    setCompletedFocusSessions(0);
    setTotalBreakTime(0);
    setTotalPauseTime(0);
    setCurrentFocusElapsed(0);
    setIsBreak(false);
    setIsRunning(false);
    setMinutes(workTime);
    setSeconds(0);
    pauseStartRef.current = null;
  };

  const totalSeconds = (isBreak ? breakTime : workTime) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <Dialog open={!!subject} onOpenChange={() => {
      if (completedFocusSessions > 0) {
        handleFinishSession();
      } else {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: subject?.color }}
              />
              <div>
                <DialogTitle>{subject?.name}</DialogTitle>
                {themeName && (
                  <p className="text-sm text-muted-foreground">{themeName}</p>
                )}
              </div>
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
              <Button variant="ghost" size="icon" onClick={() => {
                if (completedFocusSessions > 0) {
                  handleFinishSession();
                } else {
                  onClose();
                }
              }}>
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

              {/* Session Stats */}
              {(completedFocusSessions > 0 || currentFocusElapsed > 0 || totalPauseTime > 0) && (
                <div className="flex justify-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Sessões</p>
                    <p className="font-semibold text-foreground">{completedFocusSessions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Foco Total</p>
                    <p className="font-semibold text-primary">
                      {completedFocusSessions * workTime + Math.floor(currentFocusElapsed / 60)}m
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Descanso</p>
                    <p className="font-semibold text-warning">{totalBreakTime}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Pausado</p>
                    <p className="font-semibold text-muted-foreground">{Math.floor(totalPauseTime / 60)}m</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                  className="h-12 w-12"
                  title="Reiniciar timer"
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
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleStopAndSave}
                  className="h-12 w-12"
                  title="Parar e salvar sessão"
                >
                  <Square className="w-5 h-5" />
                </Button>
                {completedFocusSessions > 0 && (
                  <Button
                    variant="default"
                    size="icon"
                    onClick={handleFinishSession}
                    className="h-12 w-12 bg-success hover:bg-success/90"
                    title="Finalizar e registrar sessão"
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                )}
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