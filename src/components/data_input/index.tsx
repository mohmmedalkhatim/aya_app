import React, { forwardRef, useState, useEffect } from 'react';
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconLink,
  IconColorSwatch,
  IconPlus,
  IconTrash,
  IconCheck,
  IconAlertCircle,
  IconPhone
} from '@tabler/icons-react';
import Input from '../Input';

/* ───────────────────────────── Types ───────────────────────────── */

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type DataType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'url' 
  | 'date' 
  | 'time' 
  | 'datetime' 
  | 'timezone'
  | 'color'
  | 'recurrence'
  | 'json'
  | 'array'
  | 'phone'
  | 'location';

export interface DataInputProps {
  type: DataType;
  label?: string;
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  
  size?: Size;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  
  // Date/Time specific
  timezone?: string;
  onTimezoneChange?: (timezone: string) => void;
  
  // Array/Recurrence specific
  itemLabel?: string;
  maxItems?: number;
  
  // JSON specific
  formatJson?: boolean;
  
  // Color specific
  colorFormat?: 'hex' | 'rgb' | 'name';
  
  fullWidth?: boolean;
  className?: string;
}

/* ───────────────────────────── Helpers ───────────────────────────── */

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland'
];

const COLOR_PRESETS = [
  '#1a73e8', // Google Blue
  '#0b8043', // Google Green
  '#c5221f', // Google Red
  '#f09300', // Google Orange
  '#833ab4', // Google Purple
  '#b80672', // Google Pink
  '#5e5e5e', // Google Grey
  '#f6bf26', // Yellow
  '#8f8f8f', // Light Grey
];

/* ───────────────────────────── Components ───────────────────────────── */

const DateTimeInput = forwardRef<HTMLDivElement, DataInputProps>(({
  value,
  defaultValue,
  onChange,
  size = 'md',
  error,
  disabled,
  required,
  className
}, ref) => {
  const [dateValue, setDateValue] = useState(
    value?.slice(0, 10) || defaultValue?.slice(0, 10) || ''
  );
  const [timeValue, setTimeValue] = useState(
    value?.slice(11, 16) || defaultValue?.slice(11, 16) || ''
  );

  useEffect(() => {
    if (value) {
      setDateValue(value.slice(0, 10));
      setTimeValue(value.slice(11, 16));
    }
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDateValue(newDate);
    if (newDate && timeValue) {
      onChange?.(`${newDate}T${timeValue}:00.000Z`);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    if (dateValue && newTime) {
      onChange?.(`${dateValue}T${newTime}:00.000Z`);
    }
  };

  return (
    <div ref={ref} className={`space-y-2 ${className || ''}`}>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          value={dateValue}
          onChange={handleDateChange}
          size={size}
          error={error}
          disabled={disabled}
          required={required}
          placeholder="Date"
          leftSection={<IconCalendar size={size === 'xs' ? 14 : 16} />}
        />
        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          size={size}
          error={error}
          disabled={disabled}
          required={required}
          placeholder="Time"
          leftSection={<IconClock size={size === 'xs' ? 14 : 16} />}
        />
      </div>
    </div>
  );
});

DateTimeInput.displayName = 'DateTimeInput';

const TimezoneInput = forwardRef<HTMLDivElement, DataInputProps>(({
  value,
  onChange,
  size = 'md',
  error,
  disabled,
  required,
  className
}, ref) => {
  return (
    <div ref={ref} className={className}>
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className={`
          w-full border rounded outline-none transition
          ${size === 'xs' ? 'h-7 text-xs px-2' : ''}
          ${size === 'sm' ? 'h-8 text-sm px-2.5' : ''}
          ${size === 'md' ? 'h-9 text-sm px-3' : ''}
          ${size === 'lg' ? 'h-10 text-base px-3.5' : ''}
          ${size === 'xl' ? 'h-12 text-lg px-4' : ''}
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500'}
          ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white'}
          focus:ring-2 focus:ring-offset-2
          appearance-none
        `}
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")',
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25rem'
        }}
      >
        <option value="">Select timezone</option>
        {TIMEZONES.map((tz) => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

TimezoneInput.displayName = 'TimezoneInput';

const RecurrenceInput = forwardRef<HTMLDivElement, DataInputProps>(({
  value = [],
  onChange,
  size = 'md',
  error,
  disabled,
  required,
  itemLabel = 'RRULE',
  maxItems = 10,
  className
}, ref) => {
  const [rules, setRules] = useState<string[]>(value || []);

  useEffect(() => {
    setRules(value || []);
  }, [value]);

  const handleAdd = () => {
    if (rules.length < maxItems) {
      const newRules = [...rules, ''];
      setRules(newRules);
      onChange?.(newRules);
    }
  };

  const handleChange = (index: number, newValue: string) => {
    const newRules = [...rules];
    newRules[index] = newValue;
    setRules(newRules);
    onChange?.(newRules);
  };

  const handleRemove = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    onChange?.(newRules);
  };

  return (
    <div ref={ref} className={`space-y-2 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {itemLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || rules.length >= maxItems}
          className={`
            flex items-center space-x-1 px-2 py-1 text-xs font-medium
            rounded-md transition touch-manipulation
            ${disabled || rules.length >= maxItems
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-50 text-indigo-600 active:bg-indigo-100'
            }
          `}
        >
          <IconPlus size={14} />
          <span>Add Rule</span>
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {rules.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            No recurrence rules added
          </p>
        ) : (
          rules.map((rule, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Input
                value={rule}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR"
                size={size}
                disabled={disabled}
                className="flex-1 font-mono text-sm"
                error={error && index === rules.length - 1 ? error : undefined}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className={`
                  p-2 rounded-md transition touch-manipulation
                  ${disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-red-600 hover:bg-red-50 active:bg-red-100'
                  }
                `}
              >
                <IconTrash size={size === 'xs' ? 14 : 16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

RecurrenceInput.displayName = 'RecurrenceInput';

const JsonInput = forwardRef<HTMLDivElement, DataInputProps>(({
  value,
  onChange,
  size = 'md',
  error,
  disabled,
  required,
  placeholder = 'Enter JSON...',
  formatJson = true,
  className
}, ref) => {
  const [textValue, setTextValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      try {
        const formatted = formatJson 
          ? JSON.stringify(value, null, 2)
          : JSON.stringify(value);
        setTextValue(formatted);
        setIsValid(true);
        setLocalError('');
      } catch {
        setTextValue(String(value));
        setIsValid(false);
      }
    }
  }, [value, formatJson]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    
    try {
      if (newValue.trim() === '') {
        onChange?.(null);
        setIsValid(true);
        setLocalError('');
      } else {
        const parsed = JSON.parse(newValue);
        onChange?.(parsed);
        setIsValid(true);
        setLocalError('');
      }
    } catch (e) {
      setIsValid(false);
      setLocalError('Invalid JSON format');
    }
  };

  return (
    <div ref={ref} className={`space-y-1 ${className || ''}`}>
      <div className="relative">
        <textarea
          value={textValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`
            w-full border rounded-lg outline-none transition font-mono
            ${size === 'xs' ? 'h-20 text-xs p-2' : ''}
            ${size === 'sm' ? 'h-24 text-sm p-2.5' : ''}
            ${size === 'md' ? 'h-32 text-sm p-3' : ''}
            ${size === 'lg' ? 'h-40 text-base p-3.5' : ''}
            ${size === 'xl' ? 'h-48 text-lg p-4' : ''}
            ${!isValid || error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white'}
            focus:ring-2 focus:ring-offset-2
            resize-vertical
          `}
        />
        <div className="absolute top-2 right-2">
          {isValid && textValue && !error && (
            <IconCheck size={16} className="text-green-500" />
          )}
          {(!isValid || error) && (
            <IconAlertCircle size={16} className="text-red-500" />
          )}
        </div>
      </div>
      {(localError || error) && (
        <p className="text-xs text-red-600">{localError || error}</p>
      )}
    </div>
  );
});

JsonInput.displayName = 'JsonInput';

const ColorInput = forwardRef<HTMLDivElement, DataInputProps>(({
  value,
  onChange,
  size = 'md',
  error,
  disabled,
  required,
  className
}, ref) => {

  return (
    <div ref={ref} className={`space-y-2 ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          value={value || '#1a73e8'}
          onChange={(e) => onChange?.(e.target.value)}
          size={size}
          disabled={disabled}
          required={required}
          className="w-12 p-1"
        />
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="#000000"
          size={size}
          disabled={disabled}
          error={error}
          leftSection={<IconColorSwatch size={16} />}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange?.(color)}
            disabled={disabled}
            className={`
              w-8 h-8 rounded-full border-2 transition
              ${value === color ? 'border-blue-500 scale-110' : 'border-transparent'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
});

ColorInput.displayName = 'ColorInput';

const ArrayInput = forwardRef<HTMLDivElement, DataInputProps>(({
  value = [],
  onChange,
  size = 'md',
  error,
  disabled,
  required,
  itemLabel = 'Item',
  maxItems = 20,
  className
}, ref) => {
  const [items, setItems] = useState<string[]>(value || []);

  useEffect(() => {
    setItems(value || []);
  }, [value]);

  const handleAdd = () => {
    if (items.length < maxItems) {
      const newItems = [...items, ''];
      setItems(newItems);
      onChange?.(newItems);
    }
  };

  const handleChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
    onChange?.(newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange?.(newItems);
  };

  return (
    <div ref={ref} className={`space-y-2 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {itemLabel}s
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || items.length >= maxItems}
          className={`
            flex items-center space-x-1 px-2 py-1 text-xs font-medium
            rounded-md transition touch-manipulation
            ${disabled || items.length >= maxItems
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-50 text-indigo-600 active:bg-indigo-100'
            }
          `}
        >
          <IconPlus size={14} />
          <span>Add {itemLabel}</span>
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            No {itemLabel}s added
          </p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Input
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Enter ${itemLabel.toLowerCase()}`}
                size={size}
                disabled={disabled}
                className="flex-1"
                error={error && index === items.length - 1 ? error : undefined}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className={`
                  p-2 rounded-md transition touch-manipulation
                  ${disabled 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-red-600 hover:bg-red-50 active:bg-red-100'
                  }
                `}
              >
                <IconTrash size={size === 'xs' ? 14 : 16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

ArrayInput.displayName = 'ArrayInput';

/* ───────────────────────────── Main Component ───────────────────────────── */

const DataInput = forwardRef<HTMLDivElement, DataInputProps>(({
  type,
  label,
  value,
  defaultValue,
  onChange,
  size = 'md',
  error,
  helperText,
  disabled,
  required,
  placeholder,
  
  // Date/Time specific
  timezone,
  onTimezoneChange,
  
  // Array/Recurrence specific
  itemLabel,
  maxItems,
  
  // JSON specific
  formatJson = true,
  
  // Color specific
  colorFormat,
  
  fullWidth,
  className
}, ref) => {
  const id = React.useId();

  const renderInput = () => {
    switch (type) {
      case 'datetime':
        return (
          <DateTimeInput
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder} type={'number'}          />
        );

      case 'timezone':
        return (
          <TimezoneInput
            value={value || timezone}
            onChange={onTimezoneChange || onChange}
            size={size}
            error={error}
            disabled={disabled}
            required={required} type={'number'}          />
        );

      case 'recurrence':
        return (
          <RecurrenceInput
            value={value}
            onChange={onChange}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            itemLabel={itemLabel || 'RRULE'}
            maxItems={maxItems} type={'number'}          />
        );

      case 'json':
        return (
          <JsonInput
            value={value}
            onChange={onChange}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            formatJson={formatJson} type={'number'}          />
        );

      case 'array':
        return (
          <ArrayInput
            value={value}
            onChange={onChange}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            itemLabel={itemLabel || 'Item'}
            maxItems={maxItems} type={'number'}          />
        );

      case 'color':
        return (
          <ColorInput
            value={value}
            onChange={onChange}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            colorFormat={colorFormat} type={'number'}          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            leftSection={<IconCalendar size={size === 'xs' ? 14 : 16} />}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            leftSection={<IconClock size={size === 'xs' ? 14 : 16} />}
          />
        );

      case 'location':
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder || "Enter location"}
            leftSection={<IconMapPin size={size === 'xs' ? 14 : 16} />}
          />
        );

      case 'url':
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder || "https://..."}
            leftSection={<IconLink size={size === 'xs' ? 14 : 16} />}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder || "+1 234 567 8900"}
            leftSection={<IconPhone size={size === 'xs' ? 14 : 16} />}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
          />
        );

      case 'email':
      case 'text':
      default:
        return (
          <Input
            type={type === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            size={size}
            error={error}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div ref={ref} className={`${fullWidth ? 'w-full' : ''} ${className || ''}`}>
      {label && (
        <label 
          htmlFor={id}
          className={`
            block mb-1.5 font-medium
            ${size === 'xs' ? 'text-xs' : ''}
            ${size === 'sm' ? 'text-xs' : ''}
            ${size === 'md' ? 'text-sm' : ''}
            ${size === 'lg' ? 'text-sm' : ''}
            ${size === 'xl' ? 'text-base' : ''}
            ${disabled ? 'text-gray-400' : 'text-gray-700'}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderInput()}

      {helperText && !error && (
        <p className={`
          mt-1
          ${size === 'xs' || size === 'sm' ? 'text-xs' : 'text-sm'}
          text-gray-500
        `}>
          {helperText}
        </p>
      )}
    </div>
  );
});

DataInput.displayName = 'DataInput';

export default DataInput;