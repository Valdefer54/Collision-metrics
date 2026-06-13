"use client";

interface Props {
  text: string;
}

export default function InterpretationCard({ text }: Props) {
  return (
    <div className="flex gap-2.5 px-4 py-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
      <svg
        className="w-4 h-4 text-blue-400 shrink-0 mt-0.5"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
      </svg>
      <p className="text-slate-300 text-xs leading-relaxed">{text}</p>
    </div>
  );
}
