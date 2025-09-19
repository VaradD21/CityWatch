import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const PriorityBadge = ({ 
  priorityCount = 0, 
  size = 'sm',
  showCount = true,
  className = ''
}) => {
  // Only show badge if there are priority votes
  if (priorityCount <= 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const getPriorityLevel = (count) => {
    if (count >= 10) return 'high';
    if (count >= 5) return 'medium';
    return 'low';
  };

  const priorityLevel = getPriorityLevel(priorityCount);

  const getBadgeStyles = (level) => {
    switch (level) {
      case 'high':
        return 'bg-red-600 text-white border-red-700';
      case 'medium':
        return 'bg-orange-500 text-white border-orange-600';
      case 'low':
        return 'bg-yellow-500 text-white border-yellow-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getBadgeText = (level) => {
    switch (level) {
      case 'high':
        return 'HIGH PRIORITY';
      case 'medium':
        return 'PRIORITY';
      case 'low':
        return 'PRIORITY';
      default:
        return 'PRIORITY';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1 rounded-full border font-semibold
        ${sizeClasses[size]}
        ${getBadgeStyles(priorityLevel)}
        ${className}
      `}
    >
      <Star size={iconSizes[size]} className="fill-current" />
      <span>{getBadgeText(priorityLevel)}</span>
      {showCount && (
        <span className="ml-1 bg-white bg-opacity-20 rounded-full px-1.5 py-0.5 text-xs font-bold">
          {priorityCount}
        </span>
      )}
    </motion.div>
  );
};

export default PriorityBadge;
