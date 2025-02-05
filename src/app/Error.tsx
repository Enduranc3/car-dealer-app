'use client';

import Link from 'next/link';

export default function Error(x: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h1>
        <div className="space-x-4">
          <button
            onClick={x.reset}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
