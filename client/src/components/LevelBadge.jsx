import React from 'react';

const LEVEL_STYLES = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  advanced: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function LevelBadge({ level, size = 'sm' }) {
  const normalizedLevel = (level || 'beginner').toLowerCase();
  const style = LEVEL_STYLES[normalizedLevel] || LEVEL_STYLES.beginner;

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-2 py-0.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-medium capitalize rounded-full border ${style} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        normalizedLevel === 'advanced' ? 'bg-purple-500' :
        normalizedLevel === 'intermediate' ? 'bg-amber-500' : 'bg-emerald-500'
      }`}></span>
      {normalizedLevel}
    </span>
  );
}
