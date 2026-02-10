import React, {
  forwardRef,
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react';
import {
  IconX,
  IconEye,
  IconEyeOff,
  IconSearch,
  IconMail,
  IconLock,
  IconPhone,
  IconLoader2,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';

/* ───────────────────────────── Types ───────────────────────────── */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'default' | 'filled' | 'underline';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;

  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;

  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  leftSectionWidth?: number;
  rightSectionWidth?: number;

  clearable?: boolean;
  loading?: boolean;

  onClear?: () => void;
}

/* ───────────────────────────── Helpers ───────────────────────────── */

const SIZE_CLASSES: Record<Size, string> = {
  xs: 'h-7 text-xs',
  sm: 'h-8 text-sm',
  md: 'h-9 text-sm',
  lg: 'h-10 text-base',
  xl: 'h-12 text-lg'
};

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'border-gray-300 focus:border-blue-500',
  filled: 'bg-gray-50 focus:bg-white border-transparent',
  underline: 'border-x-0 border-t-0 border-b-2 rounded-none'
};

function getDefaultIcon(type?: string) {
  switch (type) {
    case 'email':
      return <IconMail size={18} />;
    case 'password':
      return <IconLock size={18} />;
    case 'search':
      return <IconSearch size={18} />;
    case 'tel':
      return <IconPhone size={18} />;
    default:
      return null;
  }
}

/* ───────────────────────────── Component ───────────────────────────── */

const Input = forwardRef<HTMLInputElement, InputProps>(
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

      leftSection,
      rightSection,
      leftSectionWidth = 40,
      rightSectionWidth = 40,

      clearable,
      loading,

      value,
      defaultValue,
      onChange,
      onClear,

      type = 'text',
      disabled,

      className,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState(
      defaultValue ?? ''
    );
    const [showPassword, setShowPassword] = useState(false);

    const currentValue = isControlled ? value : internalValue;

    useEffect(() => {
      if (isControlled) {
        setInternalValue(value ?? '');
      }
    }, [value, isControlled]);

    /* ───────────── Derived flags ───────────── */

    const isPassword = type === 'password';
    const resolvedType =
      isPassword && showPassword ? 'text' : type;

    const leftIcon = leftSection ?? getDefaultIcon(type);

    const showClear =
      clearable && !!currentValue && !disabled && !loading;

    /* ───────────── Layout math (explicit) ───────────── */

    const inputStyle = useMemo(
      () => ({

        paddingRight:
          rightSection || showClear || isPassword || loading
            ? rightSectionWidth
            : undefined
      }),
      [
        leftIcon,
        rightSection,
        showClear,
        isPassword,
        loading,
        leftSectionWidth,
        rightSectionWidth
      ]
    );

    /* ───────────── Handlers ───────────── */

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    }

    function handleClear() {
      if (!isControlled) setInternalValue('');
      onClear?.();
      inputRef.current?.focus();
    }

    /* ───────────── Styles ───────────── */

    const baseInputClasses = `
      w-full
      border
      outline-none
      transition
      ${SIZE_CLASSES[size]}
      ${VARIANT_CLASSES[variant]}
      ${disabled ? 'bg-gray-100 text-gray-400' : ''}
    `;

    /* ───────────────────────────── Render ───────────────────────────── */

    return (
      <div className={fullWidth ? 'w-full' : ''} >
        {label && (
          <label className="mb-2 text-sm flex font-medium relative">
            {isPassword && (
              <div
                className="flex items-center justify-center text-gray-500"
                style={{ width: 26 }}
              >
                {leftIcon}
              </div>
            )}
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left section */}


          {/* Input */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            type={resolvedType}
            value={currentValue}
            disabled={disabled}
            onChange={handleChange}
            style={inputStyle}
            className={`${baseInputClasses} ${className ?? ''}`}
            {...props}
          />

          {/* Right section */}
          <div
            className="absolute inset-y-0 right-0 flex items-center justify-center gap-1"
            style={{ width: rightSectionWidth }}
          >
            {loading && <IconLoader2 size={16} className="animate-spin" />}
            {error && <IconAlertCircle size={16} />}
            {success && <IconCheck size={16} />}

            {showClear && (
              <button type="button" onClick={handleClear}>
                <IconX size={16} />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <IconEyeOff size={16} />
                ) : (
                  <IconEye size={16} />
                )}
              </button>
            )}

            {rightSection}
          </div>
        </div>

        {(error || helperText || success || warning) && (
          <p className="mt-1 text-sm text-gray-500">
            {error || warning || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
