import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-5 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">404</h2>
      <p className="text-gray-500 font-medium mb-6">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href="/en/explore"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors"
      >
        Go back to Explore
      </Link>
    </div>
  );
}
