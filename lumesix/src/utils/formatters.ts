/**
 * Formatter Utilities
 * Common formatting functions for the app
 */

/**
 * Format currency values
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: amount < 1 ? 4 : 2,
    maximumFractionDigits: amount < 1 ? 4 : 2,
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (
  rate: number,
  decimals: number = 1
): string => {
  return `${(rate * 100).toFixed(decimals)}%`;
};

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format dates in a user-friendly way
 */
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return dateObj.toLocaleDateString('en-US', options || defaultOptions);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  return formatDate(dateObj, { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Format change values with proper sign and color indication
 */
export const formatChange = (
  change: number,
  isPercentage: boolean = true
): { text: string; isPositive: boolean; isNegative: boolean } => {
  const sign = change > 0 ? '+' : '';
  const value = isPercentage ? formatPercentage(change / 100) : change.toFixed(1);
  
  return {
    text: `${sign}${value}${isPercentage ? '' : '%'}`,
    isPositive: change > 0,
    isNegative: change < 0,
  };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format metric values based on type
 */
export const formatMetricValue = (value: number, type: string): string => {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('rate') || lowerType.includes('retention') || lowerType.includes('conversion')) {
    return formatPercentage(value / 100);
  }
  
  if (lowerType.includes('mrr') || lowerType.includes('arr') || 
      lowerType.includes('arpu') || lowerType.includes('ltv') || 
      lowerType.includes('cac') || lowerType.includes('revenue')) {
    return formatCurrency(value);
  }
  
  if (value >= 1000) {
    return formatLargeNumber(value);
  }
  
  return value.toLocaleString();
};

/**
 * Get confidence level description
 */
export const getConfidenceLevel = (confidence: number): string => {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.7) return 'Good';
  if (confidence >= 0.6) return 'Moderate';
  if (confidence >= 0.5) return 'Low';
  return 'Very Low';
};

/**
 * Get impact level emoji
 */
export const getImpactEmoji = (impact: 'high' | 'medium' | 'low'): string => {
  switch (impact) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
};
