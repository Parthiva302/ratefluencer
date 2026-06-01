import React from 'react';

const SkeletonLoader = ({ className = "h-8 w-full", count = 1 }) => {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className={`bg-slate-700/50 rounded-xl ${className}`}></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
