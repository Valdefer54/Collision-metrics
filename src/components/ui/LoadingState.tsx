"use client";

interface Props {
  progress: number; // 0–100
  label: string;
}

export default function LoadingState({ progress, label }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div
          className="absolute inset-0 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"
          style={{ animationDuration: "0.8s" }}
        />
      </div>
      <div className="text-center">
        <p className="text-slate-300 text-sm font-medium">{label}</p>
        <p className="text-slate-500 text-xs mt-1">{progress}% received</p>
      </div>
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
