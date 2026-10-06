import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/90',
      text: 'text-emerald-200',
      iconColor: 'text-emerald-400',
      bar: 'bg-emerald-500',
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/90',
      text: 'text-rose-200',
      iconColor: 'text-rose-400',
      bar: 'bg-rose-500',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/90',
      text: 'text-amber-200',
      iconColor: 'text-amber-400',
      bar: 'bg-amber-500',
    },
    info: {
      icon: Info,
      border: 'border-indigo-500/30',
      bg: 'bg-slate-900/95',
      text: 'text-slate-200',
      iconColor: 'text-indigo-400',
      bar: 'bg-indigo-500',
    },
  }[type] || {
    icon: Info,
    border: 'border-slate-800',
    bg: 'bg-slate-900',
    text: 'text-slate-200',
    iconColor: 'text-indigo-400',
    bar: 'bg-indigo-500',
  };

  const Icon = config.icon;

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md w-full shadow-2xl rounded-2xl border backdrop-blur-md overflow-hidden ${config.bg} ${config.border} animate-slide-up`}>
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 shrink-0 ${config.iconColor}`} />
          <p className={`text-xs font-semibold ${config.text} leading-snug`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {duration > 0 && (
        <div className="h-1 w-full bg-slate-800/40">
          <div
            className={`h-full ${config.bar} transition-all duration-75`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
