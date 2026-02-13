import React, { forwardRef, useId } from 'react';

/* ───────────────────────────── Types ───────────────────────────── */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
  
  size?: Size;
  indeterminate?: boolean;
  
  description?: string;
}

/* ───────────────────────────── Helpers ───────────────────────────── */

const SIZE_CLASSES: Record<Size, { checkbox: string; label: string; icon: number }> = {
  xs: { checkbox: 'h-3.5 w-3.5', label: 'text-xs', icon: 12 },
  sm: { checkbox: 'h-4 w-4', label: 'text-sm', icon: 14 },
  md: { checkbox: 'h-5 w-5', label: 'text-sm', icon: 16 },
  lg: { checkbox: 'h-6 w-6', label: 'text-base', icon: 18 },
  xl: { checkbox: 'h-7 w-7', label: 'text-lg', icon: 20 }
};

/* ───────────────────────────── Component ───────────────────────────── */

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      description,
      
      size = 'md',
      indeterminate = false,
      
      disabled,
      checked,
      defaultChecked,
      onChange,
      
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = error ? `${checkboxId}-error` : undefined;

    const sizeClasses = SIZE_CLASSES[size];

    return (
      <div className="w-full">
        <div className="relative flex gap-2 items-start">
          {/* Checkbox Container */}
          <div className="flex h-5 items-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              onChange={onChange}
              aria-describedby={`${descriptionId || ''} ${errorId || ''}`.trim() || undefined}
              aria-invalid={!!error}
              className={`
                peer
                ${sizeClasses.checkbox}
                rounded-sm
                border
                disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-300
                ${error 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300'
                }
                ${className || ''}
              `}
              {...props}
            />
          </div>

          {/* Label and Description */}
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={`
                    font-medium
                    ${sizeClasses.label}
                    ${disabled ? 'text-gray-400' : 'text-gray-700'}
                    ${error ? 'text-red-700' : ''}
                    cursor-${disabled ? 'not-allowed' : 'pointer'}
                  `}
                >
                  {label}
                </label>
              )}
              
              {description && (
                <p 
                  id={descriptionId}
                  className={`
                    ${size === 'xs' || size === 'sm' ? 'text-xs' : 'text-sm'}
                    ${disabled ? 'text-gray-400' : 'text-gray-500'}
                  `}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error or Helper Text */}
        {(error || helperText) && (
          <p 
            id={errorId}
            className={`
              mt-1
              ${size === 'xs' || size === 'sm' ? 'text-xs' : 'text-sm'}
              ${error ? 'text-red-600' : 'text-gray-500'}
            `}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;