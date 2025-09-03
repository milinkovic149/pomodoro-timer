import React, { useState, useRef } from 'react';
import Button from './Button';

const TIMER_MODES = [
  { label: 'Pomodoro', minutes: 25 },
  { label: 'Short Break', minutes: 5 },
  { label: 'Long Break', minutes: 15 }
];

const Timer = () => {
  const [mode, setMode] = useState(TIMER_MODES[0]);
  const [secondsLeft, setSecondsLeft] = useState(mode.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  React.useEffect(() => {
    setSecondsLeft(mode.minutes * 60);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, [mode]);

  React.useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
              onClick={() => setMode(m)}
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
              onClick={() => setIsRunning(true)}
              className={`rounded-full py-[12px] text-[20px]`}
          >
            Start
          </Button>

          <Button
            onClick={() => setIsRunning(false)}
            disabled={!isRunning}
            className={`rounded-full py-[12px] text-[20px] ${
              !isRunning ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            Pause
          </Button>

          <Button
              onClick={() => { setSecondsLeft(mode.minutes * 60); setIsRunning(false); }}
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
