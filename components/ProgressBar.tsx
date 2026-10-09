import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  colorClass?: string; // e.g., 'bg-blue-500'
  heightClass?: string; // e.g., 'h-4'
  showLabels?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  colorClass = 'bg-primary',
  heightClass = 'h-4',
  showLabels = false,
}) => {
  // Ensure percentage doesn't exceed 100% strictly for visual (unless we want to show overlimit)
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-1">
      <div className={`w-full bg-black/40 rounded-full overflow-hidden border border-white/5 ${heightClass}`}>
        <div
          className={`${heightClass} ${colorClass} transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs font-mono text-gray-500 px-1">
          <span>R$ 0,00</span>
          <span>{percentage.toFixed(0)}%</span>
          <span>R$ {max.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};
