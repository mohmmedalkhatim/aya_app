import React, { forwardRef, useState, useRef, useEffect, useId } from 'react';
import {
  IconChevronDown,
  IconCheck,
  IconSearch,
  IconX,
  IconAlertCircle,
  IconLoader2
} from '@tabler/icons-react';

/* ───────────────────────────── Types ───────────────────────────── */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'default' | 'filled' | 'underline';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  
  options: SelectOption[];
  
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  
  leftSection?: React.ReactNode;
  
  maxHeight?: number;
  portal?: boolean;
  
  className?: string;
  dropdownClassName?: string;
  
  name?: string;
  id?: string;
}

/* ───────────────────────────── Helpers ───────────────────────────── */

const SIZE_CLASSES: Record<Size, { trigger: string; option: string; label: string; icon: number }> = {
  xs: { trigger: 'h-7 text-xs px-2', option: 'text-xs py-1.5 px-2', label: 'text-xs', icon: 14 },
  sm: { trigger: 'h-8 text-sm px-2.5', option: 'text-sm py-2 px-2.5', label: 'text-xs', icon: 16 },
  md: { trigger: 'h-9 text-sm px-3', option: 'text-sm py-2 px-3', label: 'text-sm', icon: 18 },
  lg: { trigger: 'h-10 text-base px-3.5', option: 'text-base py-2.5 px-3.5', label: 'text-sm', icon: 20 },
  xl: { trigger: 'h-12 text-lg px-4', option: 'text-lg py-3 px-4', label: 'text-base', icon: 22 }
};

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'border-gray-300 focus:border-blue-500',
  filled: 'bg-gray-50 focus:bg-white border-transparent',
  underline: 'border-x-0 border-t-0 border-b-2 rounded-none px-0'
};

/* ───────────────────────────── Component ───────────────────────────── */

const Select = forwardRef<HTMLDivElement, SelectProps>(({
  value: controlledValue,
  defaultValue,
  onChange,
  
  options,
  
  label,
  helperText,
  error,
  success,
  warning,
  
  size = 'md',
  variant = 'default',
  fullWidth,
  
  placeholder = 'Select...',
  disabled = false,
  required = false,
  loading = false,
  
  multiple = false,
  searchable = false,
  clearable = false,
  
  leftSection,
  
  maxHeight = 300,
  portal = false,
  
  className = '',
  dropdownClassName = '',
  
  name,
  id
}, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const triggerId = `${selectId}-trigger`;
  const dropdownId = `${selectId}-dropdown`;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue !== undefined 
      ? defaultValue 
      : multiple ? [] : ''
  );
  
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  
  /* ───────────── Derived Values ───────────── */
  
  const selectedOptions = useRef<SelectOption[]>([]);
  
  selectedOptions.current = React.useMemo(() => {
    if (multiple && Array.isArray(currentValue)) {
      return options.filter(opt => currentValue.includes(opt.value));
    } else if (!multiple && typeof currentValue === 'string' && currentValue) {
      const found = options.find(opt => opt.value === currentValue);
      return found ? [found] : [];
    }
    return [];
  }, [currentValue, options, multiple]);
  
  const displayValue = multiple
    ? selectedOptions.current.map(opt => opt.label).join(', ') || placeholder
    : selectedOptions.current[0]?.label || placeholder;
  
  /* ───────────── Filtered Options ───────────── */
  
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchTerm) return options;
    
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);
  
  /* ───────────── Grouped Options ───────────── */
  
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, SelectOption[]> = {};
    const ungrouped: SelectOption[] = [];
    
    filteredOptions.forEach(opt => {
      if (opt.group) {
        if (!groups[opt.group]) groups[opt.group] = [];
        groups[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    });
    
    return { groups, ungrouped };
  }, [filteredOptions]);
  
  /* ───────────── Effects ───────────── */
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, searchable]);
  
  /* ───────────── Handlers ───────────── */
  
  const handleTriggerClick = () => {
    if (!disabled && !loading) {
      setIsOpen(prev => !prev);
    }
  };
  
  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;
    
    let newValue: string | string[];
    
    if (multiple) {
      const current = Array.isArray(currentValue) ? currentValue : [];
      newValue = current.includes(option.value)
        ? current.filter(v => v !== option.value)
        : [...current, option.value];
    } else {
      newValue = option.value;
      setIsOpen(false);
      setSearchTerm('');
    }
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newValue = multiple ? [] : '';
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  const isOptionSelected = (option: SelectOption) => {
    if (multiple && Array.isArray(currentValue)) {
      return currentValue.includes(option.value);
    }
    return !multiple && currentValue === option.value;
  };
  
  /* ───────────── Status Classes ───────────── */
  
  const statusColor = error ? 'red' : success ? 'green' : warning ? 'yellow' : 'blue';
  const borderColorClass = error 
    ? 'border-red-300 focus:border-red-500' 
    : success 
      ? 'border-green-300 focus:border-green-500'
      : warning 
        ? 'border-yellow-300 focus:border-yellow-500'
        : 'border-gray-300 focus:border-blue-500';
  
  /* ───────────── Render Trigger ───────────── */
  
  const renderTrigger = () => (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      onClick={handleTriggerClick}
      disabled={disabled || loading}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-labelledby={label ? `${selectId}-label ${triggerId}` : triggerId}
      className={`
        w-full
        flex
        items-center
        justify-between
        border
        rounded-sm
        outline-none
        transition
        ${SIZE_CLASSES[size].trigger}
        ${VARIANT_CLASSES[variant]}
        ${borderColorClass}
        ${disabled || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}
        ${variant === 'filled' && !disabled ? 'bg-gray-50' : ''}
        touch-manipulation
      `}
    >
      <div className="flex items-center gap-2 truncate">
        {/* Left Section */}
        {leftSection && (
          <span className="text-gray-500">
            {leftSection}
          </span>
        )}
        
        {/* Selected Value */}
        <span className={`truncate ${!selectedOptions.current.length ? 'text-gray-400' : ''}`}>
          {displayValue}
        </span>
      </div>
      
      {/* Right Icons */}
      <div className="flex items-center space-x-1">
        {/* Clear Button */}
        {clearable && selectedOptions.current.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 rounded-sm hover:bg-gray-200 focus:outline-none touch-manipulation"
            aria-label="Clear selection"
          >
            <IconX size={SIZE_CLASSES[size].icon - 2} />
          </button>
        )}
        
        {/* Loading Spinner */}
        {loading && (
          <IconLoader2 
            size={SIZE_CLASSES[size].icon} 
            className="animate-spin text-gray-400" 
          />
        )}
        
        {/* Error Icon */}
        {error && !loading && (
          <IconAlertCircle size={SIZE_CLASSES[size].icon} className="text-red-500" />
        )}
        
        {/* Success Icon */}
        {success && !loading && !error && (
          <IconCheck size={SIZE_CLASSES[size].icon} className="text-green-500" />
        )}
        
        {/* Chevron */}
        <IconChevronDown
          size={SIZE_CLASSES[size].icon}
          className={`
            text-gray-500
            transition-transform
            duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </div>
    </button>
  );
  
  /* ───────────── Render Search ───────────── */
  
  const renderSearch = () => (
    <div className="p-2 flex border-b w-full border-gray-200">
      <div className="relative w-full">
        <IconSearch 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="
            w-full
            pl-9
            pr-3
            py-2
            text-sm
            border
            border-gray-300
            rounded
            outline-none
            focus:border-blue-500
            focus:ring-1
            focus:ring-blue-500
          "
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
  
  /* ───────────── Render Options ───────────── */
  
  const renderOption = (option: SelectOption) => {
    const selected = isOptionSelected(option);
    const sizeClasses = SIZE_CLASSES[size];
    
    return (
      <button
        key={option.value}
        type="button"
        onClick={() => handleOptionSelect(option)}
        disabled={option.disabled}
        role="option"
        aria-selected={selected}
        className={`
          w-full
          flex
          items-center
          justify-between
          ${sizeClasses.option}
          ${option.disabled 
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
            : 'hover:bg-gray-100 cursor-pointer'
          }
          ${selected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
          transition-colors
          touch-manipulation
        `}
      >
        <div className="flex gap-2 items-center truncate">
          {/* Option Icon */}
          {option.icon && (
            <span className="mr-2 text-gray-500">
              {option.icon}
            </span>
          )}
          
          {/* Option Label */}
          <span className="truncate">{option.label}</span>
        </div>
        
        {/* Selected Checkmark */}
        {selected && (
          <IconCheck 
            size={sizeClasses.icon - 2} 
            className="text-blue-600 flex-shrink-0" 
          />
        )}
      </button>
    );
  };
  
  const renderGroup = (groupName: string, groupOptions: SelectOption[]) => (
    <div key={groupName}>
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
        {groupName}
      </div>
      {groupOptions.map(renderOption)}
    </div>
  );
  
  /* ───────────── Render Dropdown ───────────── */
  
  const renderDropdown = () => {
    if (!isOpen) return null;
    
    const dropdown = (
      <div
        ref={dropdownRef}
        id={dropdownId}
        className={`
          absolute
          z-50
          mt-1
          w-full
          bg-white
          border
          border-gray-200
          rounded-sm
          shadow-lg
          overflow-hidden
          ${dropdownClassName}
        `}
        style={{ maxHeight, overflowY: 'auto' }}
        role="listbox"
        aria-multiselectable={multiple}
      >
        {/* Search */}
        {searchable && renderSearch()}
        
        {/* Options */}
        <div className="divide-y divide-gray-100">
          {/* Ungrouped Options */}
          {groupedOptions.ungrouped.length > 0 && (
            <div>
              {groupedOptions.ungrouped.map(renderOption)}
            </div>
          )}
          
          {/* Grouped Options */}
          {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => 
            renderGroup(groupName, groupOptions)
          )}
          
          {/* No Results */}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No options found
            </div>
          )}
        </div>
      </div>
    );
    
    return dropdown;
  };
  
  /* ───────────── Render ───────────── */
  
  return (
    <div 
      ref={containerRef}
      className={`
        relative
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Label */}
      {label && (
        <label 
          id={`${selectId}-label`}
          htmlFor={triggerId}
          className={`
            block
            mb-20
            font-medium
            ${SIZE_CLASSES[size].label}
            ${disabled ? 'text-gray-400' : 'text-gray-700'}
            ${required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}
          `}
        >
            {label}
        </label>
      )}
      
      {/* Hidden Input for Form */}
      {name && (
        <input
          type="hidden"
          name={name}
          className='rounded-sm'
          value={multiple ? JSON.stringify(currentValue) : currentValue as string}
          disabled={disabled}
        />
      )}
      
      {/* Trigger */}
      {renderTrigger()}
      
      {/* Dropdown */}
      {renderDropdown()}
      
      {/* Helper Text / Error / Success / Warning */}
      {(error || helperText || success || warning) && (
        <p className={`
          mt-1.5
          text-xs
          ${error ? 'text-red-600' : ''}
          ${success ? 'text-green-600' : ''}
          ${warning ? 'text-yellow-600' : ''}
          ${!error && !success && !warning ? 'text-gray-500' : ''}
        `}>
          {error || success || warning || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;