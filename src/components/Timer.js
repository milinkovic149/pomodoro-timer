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
  // Play a short beep using Web Audio API (no external file needed)
  const playSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880; // A5
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      o.start();
      // fade out
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.stop(ctx.currentTime + 0.5);
      // close context after a short delay
      setTimeout(() => { try { ctx.close(); } catch (e) {} }, 800);
    } catch (err) {
      // fallback: try simple Audio with short beep data URI (if desired)
      console.warn('Unable to play sound', err);
    }
  };

  // Show a browser notification for the finished timer
  const showNotification = (modeLabel) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const title = `${modeLabel} finished`;
    const body = `${modeLabel} timer has finished.`;
    const show = () => {
      try { new Notification(title, { body, tag: 'pomo-timer' }); } catch (e) { /* ignore */ }
    };
    if (Notification.permission === 'granted') show();
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(p => { if (p === 'granted') show(); });
    }
  };

  // Request notification permission immediately on first visit (if not already decided)
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      if (Notification.permission === 'default') {
        // prompt the user once — do not show any notification here, just request permission
        Notification.requestPermission().catch(() => {});
      }
    } catch (e) {
      // ignore errors
    }
  }, []);

  // Use a numeric modeIndex locally to avoid object identity issues
  const [modeIndex, setModeIndex] = useState(Number(timerData?.modeIndex) || 0);
  const mode = TIMER_MODES[modeIndex] || TIMER_MODES[0];
  const [secondsLeft, setSecondsLeft] = useState(Number(timerData?.secondsLeft) || (mode.minutes * 60));
  const [isRunning, setIsRunning] = useState(Boolean(timerData?.isRunning));
  const [autoStartNext, setAutoStartNext] = useState(false);
  const intervalRef = useRef(null);
  const pomodoroCountRef = useRef(Number(timerData?.pomodoroCount) || 0);

  useEffect(() => {
    // Defensive numeric parsing for all timer counters coming from storage/context
    const safeModeIndex = Number(timerData?.modeIndex);
    const safeSeconds = Number(timerData?.secondsLeft);
    const safeIsRunning = Boolean(timerData?.isRunning);
    const safePomodoroCount = Number(timerData?.pomodoroCount);
    const safeTotalPomodoroCount = Number(timerData?.totalPomodoroCount);

    setModeIndex(Number.isFinite(safeModeIndex) ? safeModeIndex : 0);
    setSecondsLeft(Number.isFinite(safeSeconds) ? safeSeconds : (TIMER_MODES[modeIndex]?.minutes || TIMER_MODES[0].minutes) * 60);
    setIsRunning(safeIsRunning);
    pomodoroCountRef.current = Number.isFinite(safePomodoroCount) ? safePomodoroCount : 0;
  }, [timerData]);

  React.useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // play sound and show notification when a timer naturally expires
          playSound();
          showNotification(mode.label);
          clearInterval(intervalRef.current);
          setIsRunning(false);

          // Determine whether this expiry is a Pomodoro
          const isPomodoro = modeIndex === 0;

          // Defensive numeric reads
          let newPomodoroCount = pomodoroCountRef.current || 0;
          let newTotalPomodoroCount = Number(timerData?.totalPomodoroCount) || 0;

          if (isPomodoro) {
            newPomodoroCount = (newPomodoroCount || 0) + 1; // cycle counter
            newTotalPomodoroCount = (newTotalPomodoroCount || 0) + 1; // total (statistics)
            pomodoroCountRef.current = newPomodoroCount;
            if (activeTaskId) addPomo(activeTaskId);
          }

          // Long break after every 4th completed Pomodoro (cycle)
          const newModeIndex = isPomodoro ? (newPomodoroCount % 4 === 0 ? 2 : 1) : 0;
          // If we just came from a Long Break back to Pomodoro, reset cycle
          if (modeIndex === 2 && newModeIndex === 0) {
            newPomodoroCount = 0;
            pomodoroCountRef.current = 0;
          }

          const nextMode = TIMER_MODES[newModeIndex] || TIMER_MODES[0];
          const newTimerData = {
            ...timerData,
            pomodoroCount: Number.isFinite(newPomodoroCount) ? newPomodoroCount : 0,
            totalPomodoroCount: Number.isFinite(newTotalPomodoroCount) ? newTotalPomodoroCount : 0,
            modeIndex: Number.isFinite(newModeIndex) ? newModeIndex : 0,
            secondsLeft: nextMode.minutes * 60,
            isRunning: true,
          };

          setTimerData(newTimerData);
          saveTimerData(newTimerData);
          setAutoStartNext(true);
          setModeIndex(newTimerData.modeIndex);
          return nextMode.minutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, modeIndex, activeTaskId, addPomo, saveTimerData, timerData]);

  const handleReset = () => {
    setSecondsLeft(mode.minutes * 60);
    setIsRunning(false);
    // reset pomodoro counters when resetting the timer
    pomodoroCountRef.current = 0;
    const payload = { modeIndex, secondsLeft: mode.minutes * 60, isRunning: false, pomodoroCount: 0, totalPomodoroCount: 0 };
    setTimerData(payload);
    saveTimerData(payload);
  };

  const handleSkip = () => {
    if (secondsLeft === mode.minutes * 60) return;
    const isPomodoro = modeIndex === 0;
    if (isPomodoro) {
      const newPomodoroCount = (pomodoroCountRef.current || 0) + 1;
      const newTotalPomodoroCount = (Number(timerData?.totalPomodoroCount) || 0) + 1;
      pomodoroCountRef.current = newPomodoroCount;
      if (activeTaskId) addPomo(activeTaskId);
      const newModeIndex = newPomodoroCount % 4 === 0 ? 2 : 1;
      const nextMode = TIMER_MODES[newModeIndex];
      const newTimerData = {
        ...timerData,
        pomodoroCount: newPomodoroCount,
        totalPomodoroCount: newTotalPomodoroCount,
        modeIndex: newModeIndex,
        secondsLeft: nextMode.minutes * 60,
        isRunning: false,
      };
      setTimerData(newTimerData);
      saveTimerData(newTimerData);
      setModeIndex(newModeIndex);
      setSecondsLeft(nextMode.minutes * 60);
      return;
    }
    // Skipping from break -> go to Pomodoro
    const newModeIndex = 0;
    const nextMode = TIMER_MODES[newModeIndex];
    const newTimerData = { ...timerData, modeIndex: newModeIndex, secondsLeft: nextMode.minutes * 60, isRunning: false };
    setTimerData(newTimerData);
    saveTimerData(newTimerData);
    setModeIndex(newModeIndex);
    setSecondsLeft(nextMode.minutes * 60);
  };

  const handleModeChange = (newMode) => {
    const newModeIndex = TIMER_MODES.indexOf(newMode);
    const payload = { ...timerData, modeIndex: newModeIndex, secondsLeft: newMode.minutes * 60, isRunning: false };
    setTimerData(payload);
    saveTimerData(payload);
    setModeIndex(newModeIndex);
    setSecondsLeft(newMode.minutes * 60);
  };

  // compute separate parts so we can render them in fixed-width spans
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  // Update document title with remaining time and mode; restore original title on unmount
  const originalTitleRef = useRef(typeof document !== 'undefined' ? document.title : 'Pomodoro Timer');
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const formatted = `${minutes}:${seconds} — ${mode.label}${isRunning ? '' : ' (paused)'}`;
    document.title = formatted;
  }, [minutes, seconds, mode.label, isRunning]);

  useEffect(() => () => {
    if (typeof document !== 'undefined') document.title = originalTitleRef.current || 'Pomodoro Timer';
  }, []);

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

        <div className="relative flex items-center justify-center w-full border-white border-opacity-20 bg-gradient-to-r from-[#2523D5] to-[#FA3C91] max-w-[470px] rounded-[15px] h-[184px]">
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
                  saveTimerData({ modeIndex, secondsLeft, isRunning: false });
                } else {
                  if (secondsLeft === 0) setSecondsLeft(mode.minutes * 60);
                  setIsRunning(true);
                  saveTimerData({ modeIndex, secondsLeft: secondsLeft === 0 ? mode.minutes * 60 : secondsLeft, isRunning: true });
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
