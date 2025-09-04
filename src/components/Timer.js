import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { useUser } from '../contexts/UserContext';

const TIMER_MODES = [
  { label: 'Pomodoro', minutes: 25 },
  { label: 'Short Break', minutes: 5 },
  { label: 'Long Break', minutes: 15 }
];

const Timer = () => {
  const { timerData, setTimerData, saveTimerData, activeTaskId, addPomo } = useUser();
  const [mode, setMode] = useState(TIMER_MODES[timerData.modeIndex]);
  const [secondsLeft, setSecondsLeft] = useState(timerData.secondsLeft);
  const [isRunning, setIsRunning] = useState(timerData.isRunning);
  const [autoStartNext, setAutoStartNext] = useState(false);
  const intervalRef = useRef(null);
  const pomodoroCountRef = useRef(timerData.pomodoroCount);

  useEffect(() => {
    const newMode = TIMER_MODES[timerData.modeIndex] || TIMER_MODES[0];
    setMode(newMode);
    setSecondsLeft(timerData.secondsLeft);
    setIsRunning(timerData.isRunning);
    pomodoroCountRef.current = timerData.pomodoroCount;
    console.log('Pomodoro count updated to:', timerData.totalPomodoroCount);
  }, [timerData]);

  React.useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          // Switch mode: after Pomodoro -> Short -> Pomodoro -> Short -> Pomodoro -> Long -> repeat
          let increment = TIMER_MODES.indexOf(mode) === 0;
          let newPomodoroCount = pomodoroCountRef.current;
          let newTotalPomodoroCount = timerData.totalPomodoroCount;
          if (increment) {
            newPomodoroCount += 1; // cycle counter
            newTotalPomodoroCount += 1; // total (decides statistics only)
            pomodoroCountRef.current = newPomodoroCount;
            if (activeTaskId) {
              addPomo(activeTaskId);
            }
          }
          // Long break after every 4th completed Pomodoro (cycle)
          const newModeIndex = TIMER_MODES.indexOf(mode) === 0
            ? (increment ? (newPomodoroCount % 4 === 0 ? 2 : 1) : 1)
            : 0;
          const newMode = TIMER_MODES[newModeIndex];
          if (TIMER_MODES.indexOf(mode) === 2 && newModeIndex === 0) {
            newPomodoroCount = 0; // reset cycle counter after Long Break
            pomodoroCountRef.current = 0;
          }
          const newTimerData = { ...timerData, pomodoroCount: newPomodoroCount, totalPomodoroCount: newTotalPomodoroCount, modeIndex: newModeIndex, secondsLeft: newMode.minutes * 60, isRunning: true };
          setTimerData(newTimerData);
          saveTimerData(newTimerData);
          setAutoStartNext(true);
          setMode(newMode);
          return newMode.minutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, activeTaskId, addPomo, saveTimerData, timerData]);

  const handleReset = () => {
    setSecondsLeft(mode.minutes * 60);
    setIsRunning(false);
    saveTimerData({ modeIndex: TIMER_MODES.indexOf(mode), secondsLeft: mode.minutes * 60, isRunning: false });
  };

  const handleSkip = () => {
    if (secondsLeft === mode.minutes * 60) return;
    const increment = TIMER_MODES.indexOf(mode) === 0;
    // Increment count if skipping from Pomodoro
    if (increment) {
      const newPomodoroCount = pomodoroCountRef.current + 1;
      const newTotalPomodoroCount = timerData.totalPomodoroCount + 1;
      pomodoroCountRef.current = newPomodoroCount;
      if (activeTaskId) {
        addPomo(activeTaskId);
      }
      const newModeIndex = TIMER_MODES.indexOf(mode) === 0 ? (newPomodoroCount % 4 === 0 ? 2 : 1) : 0;
      const newMode = TIMER_MODES[newModeIndex];
      const newTimerData = { ...timerData, pomodoroCount: newPomodoroCount, totalPomodoroCount: newTotalPomodoroCount, modeIndex: newModeIndex, secondsLeft: newMode.minutes * 60, isRunning: false };
      setTimerData(newTimerData);
      saveTimerData(newTimerData);
      return;
    }
    // If not incrementing (skipping from break), just go to Pomodoro
    const newModeIndex = 0;
    const newTimerData = { ...timerData, modeIndex: newModeIndex, secondsLeft: TIMER_MODES[newModeIndex].minutes * 60, isRunning: false };
    setTimerData(newTimerData);
    saveTimerData(newTimerData);
  };

  const handleModeChange = (newMode) => {
    const newTimerData = { ...timerData, modeIndex: TIMER_MODES.indexOf(newMode), secondsLeft: newMode.minutes * 60, isRunning: false };
    setTimerData(newTimerData);
    saveTimerData(newTimerData);
  };

  // compute separate parts so we can render them in fixed-width spans
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="relative w-full flex items-start justify-center py-[40px]">
      <div className="w-full max-w-[920px] px-4 flex flex-col items-center gap-[32px]">
        {/* Mode pills */}
        <div className="mt-6 mb-8 flex items-center gap-[25px]">
          {TIMER_MODES.map((m) => (
            <Button
              key={m.label}
              onClick={() => handleModeChange(m)}
              className={m === mode ? 'underline underline-offset-[3px]' : ''}
            >
              {m.label}
            </Button>
          ))}
        </div>

        <div className="relative flex items-center justify-center w-full bg-gradient-to-r from-[#2523D5] to-[#FA3C91] max-w-[470px] rounded-[15px] h-[184px]">
          <div className="w-full flex items-center justify-center text-[120px] md:text-[96px] sm:text-[56px] leading-[1] font-sora font-bold text-white drop-shadow-lg">
            {/* Use fixed-width spans and tabular numbers so digits don't shift and colon stays centered */}
            <div className="inline-flex items-center justify-center select-none">
              <span className="tabular-nums w-[2ch] text-right">{minutes}</span>
              <span className="inline-block w-[0.5ch] text-center">:</span>
              <span className="tabular-nums w-[2ch] text-left">{seconds}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex gap-[25px] items-center z-30">
          <Button
              onClick={() => {
                if (isRunning) {
                  setIsRunning(false);
                  saveTimerData({ modeIndex: TIMER_MODES.indexOf(mode), secondsLeft, isRunning: false });
                } else {
                  if (secondsLeft === 0) {
                    setSecondsLeft(mode.minutes * 60);
                  }
                  setIsRunning(true);
                  saveTimerData({ modeIndex: TIMER_MODES.indexOf(mode), secondsLeft: secondsLeft === 0 ? mode.minutes * 60 : secondsLeft, isRunning: true });
                }
              }}
              className={`rounded-full py-[12px] text-[20px]`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>

          <Button
              onClick={handleSkip}
              disabled={secondsLeft === mode.minutes * 60}
              className={`rounded-full py-[12px] text-[20px] ${
                secondsLeft === mode.minutes * 60 ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/10'
              }`}
          >
            Skip
          </Button>

          <Button
              onClick={handleReset}
              className={`rounded-full py-[12px] text-[20px]`}
          >
            Reset
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Timer;
