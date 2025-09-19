import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, StarOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_ENDPOINTS } from '../config/api';
import { makeAuthenticatedRequest } from '../utils/api';

const PriorityButton = ({ 
  reportId, 
  priorityCount = 0, 
  userHasVoted = false, 
  onVoteChange,
  size = 'sm',
  showCount = true,
  disabled = false 
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [localVoted, setLocalVoted] = useState(userHasVoted);
  const [localCount, setLocalCount] = useState(priorityCount);

  // Sync local state with props
  useEffect(() => {
    setLocalVoted(userHasVoted);
    setLocalCount(priorityCount);
  }, [userHasVoted, priorityCount]);

  // Only show for citizens
  if (user?.role !== 'citizen') {
    return null;
  }

  const handleToggleVote = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    
    try {
      const response = await makeAuthenticatedRequest(
        API_ENDPOINTS.REPORTS_PRIORITY(reportId),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle priority vote');
      }

      const data = await response.json();
      
      // Update local state
      setLocalVoted(data.hasVoted);
      setLocalCount(data.priorityCount);
      
      // Notify parent component
      if (onVoteChange) {
        onVoteChange(data.hasVoted, data.priorityCount);
      }

      // Show success message
      showToast(
        data.hasVoted ? 'Marked as priority' : 'Removed priority vote',
        'success'
      );

    } catch (error) {
      console.error('Error toggling priority vote:', error);
      showToast(
        error.message || 'Failed to update priority vote',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <motion.button
      onClick={handleToggleVote}
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center gap-1 rounded-full border transition-all duration-200
        ${sizeClasses[size]}
        ${localVoted 
          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
          : 'bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!isLoading && !disabled ? { scale: 1.05 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.95 } : {}}
      title={localVoted ? 'Remove priority vote' : 'Mark as priority'}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
      ) : localVoted ? (
        <Star size={iconSizes[size]} className="fill-current" />
      ) : (
        <StarOff size={iconSizes[size]} />
      )}
      
      {showCount && localCount > 0 && (
        <span className="font-medium">
          {localCount}
        </span>
      )}
    </motion.button>
  );
};

export default PriorityButton;
