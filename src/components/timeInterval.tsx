"use client";

import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

export default function TimeLeft({ endTime }: { endTime: string }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const now = new Date();
      const end = new Date(endTime);

      if (now >= end) {
        setIsExpired(true);
        setTimeLeft("Closed");
        return;
      }

      const duration = intervalToDuration({ start: now, end });
      const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        const pad = (n: number) => n.toString().padStart(2, "0");
        setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!mounted) {
    return <span className="font-mono tabular-nums">--:--:--</span>;
  }

  return (
    <span
      className={`font-mono tabular-nums tracking-tight ${
        isExpired ? "text-destructive" : ""
      }`}
    >
      {timeLeft}
    </span>
  );
}
