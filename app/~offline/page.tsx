import React from "react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          You&apos;re Offline
        </h1>
        <p className="text-lg text-gray-600">
          It looks like you&apos;ve lost your internet connection.
          Don&apos;t worry, HospiceFind will be back as soon as you&apos;re reconnected.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Refreshing
          </Link>
        </div>
      </div>
    </div>
  );
}
