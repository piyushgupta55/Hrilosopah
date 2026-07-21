import React from 'react';

export const StreakTracker = () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  // Hardcoded for demo: Monday is active (fire), Wednesday is current day (highlighted)
  const todayIndex = 3; // WED
  const fireIndex = 1; // MON

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-extrabold text-text-primary">For you</h2>
        <button className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-text-secondary hover:bg-slate-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      </div>
      <p className="text-text-secondary text-sm mb-4">
        Finish a lesson or episode to start a streak{' '}
        <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-border rounded-full ml-1">
          i
        </span>
      </p>

      <div className="flex justify-between items-center w-full">
        {days.map((day, idx) => {
          let circleClass =
            'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium border border-border text-text-secondary bg-white shrink-0';
          let content = <span>{day}</span>;

          if (idx === fireIndex) {
            circleClass =
              'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg bg-orange-100 border-none shadow-sm shrink-0';
            content = <span>🔥</span>;
          } else if (idx === todayIndex) {
            circleClass =
              'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 border-score text-score bg-white shadow-sm shrink-0';
          }

          return (
            <div key={day} className={circleClass}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
