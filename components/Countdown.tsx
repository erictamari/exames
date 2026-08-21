"use client";

import { useEffect, useState } from "react";

export default function Countdown({ date }: { date: string }) {
  const calculate = () => {
    const diff = new Date(date).getTime() - Date.now();
    if (diff <= 0) return "Hoje";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  const [value, setValue] = useState(calculate());
  useEffect(() => {
    const timer = setInterval(() => setValue(calculate()), 1000);
    return () => clearInterval(timer);
  }, [date]);
  return <span className="countdown">{value}</span>;
}
