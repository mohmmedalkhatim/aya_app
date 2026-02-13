import React, { forwardRef, useRef, useState, useEffect, useId } from 'react';
import {
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconX
} from '@tabler/icons-react';

/* ───────────────────────────── Types ───────────────────────────── */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'default' | 'filled' | 'underline';
type Resize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;

  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;

  resize?: Resize;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;

  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;

  clearable?: boolean;
  loading?: boolean;
  showCount?: boolean;
  maxLength?: number;

  onClear?: () => void;
}

/* ───────────────────────────── Helpers ───────────────────────────── */

const SIZE_CLASSES: Record<Size, { textarea: string; label: string; helper: string }> = {
  xs: { textarea: 'text-xs p-2', label: 'text-xs', helper: 'text-xs' },
  sm: { textarea: 'text-sm p-2.5', label: 'text-xs', helper: 'text-xs' },
  md: { textarea: 'text-sm p-3', label: 'text-sm', helper: 'text-xs' },
  lg: { textarea: 'text-base p-3.5', label: 'text-sm', helper: 'text-sm' },
  xl: { textarea: 'text-lg p-4', label: 'text-base', helper: 'text-sm' }
};

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'border-gray-300 focus:border-blue-500',
  filled: 'bg-gray-50 focus:bg-white border-transparent',
  underline: 'border-x-0 border-t-0 border-b-2 rounded-none px-0'
};

const RESIZE_CLASSES: Record<Resize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize'
};

/* ───────────────────────────── Component ───────────────────────────── */

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      warning,

      size = 'md',
      variant = 'default',
      fullWidth,

      resize = 'vertical',
      rows = 4,
      minRows,
      maxRows,
      autoResize = false,

      leftSection,
      rightSection,

      clearable = false,
      loading = false,
      showCount = false,
      maxLength,

      value,
      defaultValue,
      onChange,
      onClear,

      disabled,
      required,
      placeholder,
      className = '',
      id,
      name,

      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState(
      defaultValue ?? ''
    );

    const currentValue = isControlled ? value : internalValue;
    const valueLength = typeof currentValue === 'string' ? currentValue.length : 0;

    /* ───────────── Auto Resize ───────────── */

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Calculate new height
        let newHeight = textarea.scrollHeight;
        
        // Apply min/max rows constraints
        if (minRows) {
          const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
          const minHeight = minRows * lineHeight;
          newHeight = Math.max(newHeight, minHeight);
        }
        
        if (maxRows) {
          const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
          const maxHeight = maxRows * lineHeight;
          newHeight = Math.min(newHeight, maxHeight);
        }
        
        textarea.style.height = `${newHeight}px`;
      }
    }, [currentValue, autoResize, minRows, maxRows]);

    /* ───────────── Handlers ───────────── */

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('');
      }
      onClear?.();
      
      // Create a synthetic event
      if (textareaRef.current) {
        const event = new Event('input', { bubbles: true });
        textareaRef.current.dispatchEvent(event);
      }
      
      textareaRef.current?.focus();
    };

    /* ───────────── Status Classes ───────────── */

    const borderColorClass = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : success
      ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
      : warning
      ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    /* ───────────── Render ───────────── */

    return (
      <div className={`
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}>
        {/* Label */}
        {label && (
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor={textareaId}
              className={`
                block font-medium
                ${SIZE_CLASSES[size].label}
                ${disabled ? 'text-gray-400' : 'text-gray-700'}
                ${required ? "after:content-['*'] after:ml-1 after:text-red-500" : ''}
              `}
            >
              {label}
            </label>
            
            {/* Character Count */}
            {showCount && maxLength && (
              <span className={`
                ${SIZE_CLASSES[size].helper}
                ${valueLength > maxLength * 0.9 ? 'text-orange-600' : ''}
                ${valueLength >= maxLength ? 'text-red-600 font-semibold' : 'text-gray-500'}
              `}>
                {valueLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        {/* Textarea Container */}
        <div className="relative">
          {/* Left Section */}
          {leftSection && (
            <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center pl-3 pointer-events-none">
              <span className={`
                ${disabled ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {leftSection}
              </span>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            id={textareaId}
            name={name}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            className={`
              w-full
              border
              rounded-lg
              outline-none
              transition
              ${SIZE_CLASSES[size].textarea}
              ${VARIANT_CLASSES[variant]}
              ${borderColorClass}
              ${RESIZE_CLASSES[resize]}
              ${leftSection ? 'pl-10' : ''}
              ${rightSection || clearable || loading || error || success ? 'pr-10' : ''}
              ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}
              ${variant === 'filled' && !disabled ? 'bg-gray-50' : ''}
              focus:ring-2 focus:ring-offset-2
              placeholder:text-gray-400
              disabled:placeholder:text-gray-300
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
            }
            {...props}
          />

          {/* Right Section */}
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center gap-1 pr-3">
            {/* Loading Spinner */}
            {loading && (
              <IconLoader2 
                size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'md' ? 18 : 20} 
                className="animate-spin text-gray-400" 
              />
            )}

            {/* Error Icon */}
            {error && !loading && (
              <IconAlertCircle 
                size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'md' ? 18 : 20}
                className="text-red-500" 
              />
            )}

            {/* Success Icon */}
            {success && !loading && !error && (
              <IconCheck 
                size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'md' ? 18 : 20}
                className="text-green-500" 
              />
            )}

            {/* Clear Button */}
            {clearable && currentValue && !disabled && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 touch-manipulation"
                aria-label="Clear text"
              >
                <IconX 
                  size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'md' ? 18 : 20}
                  className="text-gray-500 hover:text-gray-700" 
                />
              </button>
            )}

            {/* Custom Right Section */}
            {rightSection && !loading && !error && !success && !clearable && (
              <span className={`
                ${disabled ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {rightSection}
              </span>
            )}
          </div>
        </div>

        {/* Helper Text / Error / Success / Warning */}
        {(error || helperText || success || warning) && (
          <p
            id={error ? `${textareaId}-error` : `${textareaId}-helper`}
            className={`
              mt-1.5
              ${SIZE_CLASSES[size].helper}
              ${error ? 'text-red-600' : ''}
              ${success ? 'text-green-600' : ''}
              ${warning ? 'text-yellow-600' : ''}
              ${!error && !success && !warning ? 'text-gray-500' : ''}
            `}
          >
            {error || success || warning || helperText}
          </p>
        )}

        {/* Character Count (when no label) */}
        {!label && showCount && maxLength && (
          <div className="flex justify-end mt-1">
            <span className={`
              ${SIZE_CLASSES[size].helper}
              ${valueLength > maxLength * 0.9 ? 'text-orange-600' : ''}
              ${valueLength >= maxLength ? 'text-red-600 font-semibold' : 'text-gray-500'}
            `}>
              {valueLength}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;