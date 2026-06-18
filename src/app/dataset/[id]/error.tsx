"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DatasetError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-md text-center px-6">
        <p className="text-red-400 font-semibold mb-2">Something went wrong</p>
        <p className="text-slate-400 text-sm mb-6">
          An unexpected error occurred while loading this dataset.
        </p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={reset}
            className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white underline underline-offset-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
