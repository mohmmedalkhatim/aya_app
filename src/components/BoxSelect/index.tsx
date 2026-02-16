import React, { forwardRef, useState, useRef, useEffect, useId } from 'react';

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



/* ───────────────────────────── Component ───────────────────────────── */

const SelectBox = forwardRef<HTMLDivElement, SelectProps>(({
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
    fullWidth,

    disabled = false,
    required = false,

    multiple = false,
    searchable = false,



    className = '',
    dropdownClassName = '',

    name,
    id
}) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const triggerId = `${selectId}-trigger`;
    const dropdownId = `${selectId}-dropdown`;

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [internalValue, setInternalValue] = useState<string | string[]>(
        defaultValue !== undefined
            ? defaultValue
            : multiple ? [] : ''
    );
    useEffect(() => {
        handleOptionSelect({ value: 'Daily', label: 'Daily' })
    }, [])
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


    const isOptionSelected = (option: SelectOption) => {
        if (multiple && Array.isArray(currentValue)) {
            return currentValue.includes(option.value);
        }
        return !multiple && currentValue === option.value;
    };


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
          justify-between grow
          ${sizeClasses.option}
          ${option.disabled
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-100 cursor-pointer'
                    }
          ${selected ? 'bg-white rounded-sm border' : 'text-gray-900'}
          transition-colors
          touch-manipulation
        `}
            >
                <div className="flex gap-2 items-center truncate">
                    {/* Option Icon */}
                    {option.icon && (
                        <span className="mr-2">
                            {option.icon}
                        </span>
                    )}

                    {/* Option Label */}
                    <span className="truncate">{option.label}</span>
                </div>

                {/* Selected Checkmark */}

            </button>
        );
    };


    /* ───────────── Render Dropdown ───────────── */

    const renderDropdown = () => {

        const dropdown = (
            <div
                ref={dropdownRef}
                id={dropdownId}
                className={`
          z-50
          mt-1
          w-full
          bg-gray-200
          border
          border-gray-200
          rounded-sm
            flex
          overflow-hidden
          ${dropdownClassName}
        `}
                role="listbox"
            >
                <div className="divide-y divide-gray-100 w-full">
                    {/* Ungrouped Options */}
                    {groupedOptions.ungrouped.length > 0 && (
                        <div className='flex w-full p-1 gap-1'>
                            {groupedOptions.ungrouped.map(renderOption)}
                        </div>
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
            -translate-y-1 translate-x-2
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

SelectBox.displayName = 'SelectBox';

export default SelectBox;