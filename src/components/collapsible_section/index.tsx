import React, { useState, useEffect } from 'react';

/* ───────────────────────────── Types ───────────────────────────── */

export interface CollapsibleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (id: string, expanded: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  badge?: React.ReactNode;
  badgeColor?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

/* ───────────────────────────── Component ───────────────────────────── */

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  children,
  expanded: controlledExpanded,
  defaultExpanded = true,
  onToggle,
  className = '',
  headerClassName = '',
  contentClassName = '',
  disabled = false,
  iconPosition = 'right',
  size = 'md',
  badge,
  badgeColor = 'default'
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  const isExpanded = controlledExpanded !== undefined 
    ? controlledExpanded 
    : internalExpanded;

  useEffect(() => {
    if (controlledExpanded !== undefined) {
      setInternalExpanded(controlledExpanded);
    }
  }, [controlledExpanded]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newExpanded = !isExpanded;
    
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    
    onToggle?.(id, newExpanded);
  };

  /* ───────────── Size Classes ───────────── */
  const sizeClasses = {
    sm: {
      header: 'px-3 py-2',
      title: 'text-sm',
      icon: 'w-4 h-4'
    },
    md: {
      header: 'px-4 py-3',
      title: 'text-sm font-medium',
      icon: 'w-5 h-5'
    },
    lg: {
      header: 'px-5 py-4',
      title: 'text-base font-semibold',
      icon: 'w-6 h-6'
    }
  };

  /* ───────────── Badge Color Classes ───────────── */
  const badgeColorClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  /* ───────────── Icon ───────────── */
  const ChevronIcon = () => (
    <svg
      className={`
        ${sizeClasses[size].icon}
        text-gray-500 
        transform transition-transform duration-200
        ${isExpanded ? 'rotate-180' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <div 
      className={`
        bg-white 
        rounded-lg 
        border 
        border-gray-200 
        overflow-hidden
        ${disabled ? 'opacity-75' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full
          flex
          items-center
          justify-between
          ${sizeClasses[size].header}
          ${disabled 
            ? 'bg-gray-50 cursor-not-allowed' 
            : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
          }
          transition-colors
          duration-200
          touch-manipulation
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-2
          ${headerClassName}
        `}
        aria-expanded={isExpanded}
        aria-controls={`collapsible-content-${id}`}
      >
        {/* Left icon position */}
        {iconPosition === 'left' && (
          <div className="flex items-center space-x-2">
            <ChevronIcon />
            <span className={`
              ${sizeClasses[size].title}
              text-gray-900
            `}>
              {title}
            </span>
          </div>
        )}

        {/* Title (when icon on right) */}
        {iconPosition === 'right' && (
          <span className={`
            ${sizeClasses[size].title}
            text-gray-900
          `}>
            {title}
          </span>
        )}

        {/* Right side: Badge and/or Icon */}
        <div className="flex items-center space-x-3">
          {/* Badge */}
          {badge && (
            <span className={`
              inline-flex
              items-center
              px-2.5
              py-0.5
              rounded-full
              text-xs
              font-medium
              ${badgeColorClasses[badgeColor]}
            `}>
              {badge}
            </span>
          )}

          {/* Right icon position */}
          {iconPosition === 'right' && <ChevronIcon />}
        </div>
      </button>

      {/* Content */}
      <div
        id={`collapsible-content-${id}`}
        role="region"
        aria-labelledby={`collapsible-header-${id}`}
        className={`
          transition-all
          duration-300
          ease-in-out
          ${isExpanded ? 'block' : 'hidden'}
        `}
      >
        <div className={`
          ${size === 'sm' ? 'p-3' : ''}
          ${size === 'md' ? 'p-4' : ''}
          ${size === 'lg' ? 'p-5' : ''}
          ${contentClassName}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────── Group Component ───────────────────────────── */

export interface CollapsibleGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  className?: string;
}

export const CollapsibleGroup: React.FC<CollapsibleGroupProps> = ({
  children,
  allowMultiple = true,
  defaultExpandedIds = [],
  className = ''
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );

  const handleToggle = (id: string, expanded: boolean) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      
      if (expanded) {
        next.add(id);
        if (!allowMultiple) {
          // Close all other sections
          prev.forEach(sectionId => {
            if (sectionId !== id) {
              next.delete(sectionId);
            }
          });
        }
      } else {
        next.delete(id);
      }
      
      return next;
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<CollapsibleSectionProps>(child)) {
          return React.cloneElement(child, {
            expanded: expandedIds.has(child.props.id),
            onToggle: handleToggle
          });
        }
        return child;
      })}
    </div>
  );
};

/* ───────────── Compound Components Pattern ───────────── */

export const Collapsible = {
  Section: CollapsibleSection,
  Group: CollapsibleGroup
};

export default CollapsibleSection;