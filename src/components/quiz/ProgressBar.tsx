import React from 'react';
import { Star } from 'lucide-react';

export const ProgressBar = ({
  current,
  total,
  score = 0,
}: {
  current: number;
  total: number;
  score?: number;
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full flex flex-col px-4 md:px-0 mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500 text-sm font-medium">
          Question {current} of {total}
        </span>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-gray-900 font-bold">{score}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
