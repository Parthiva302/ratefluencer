import React from 'react';

const ProgressBar = ({ currentStep, totalSteps = 6, label }) => {
  const percentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Step {currentStep} of {totalSteps}: {label}
        </span>
        <span className="text-xs font-bold text-primary">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
