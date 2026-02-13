import React, { useState, useEffect, useCallback, useMemo, useActionState } from 'react';
import {
  IconClock,
  IconCheck,
  IconWorld,
  IconColorSwatch,
  IconX
} from '@tabler/icons-react';
import DataInput from '../../../components/data_input';
import Select from '../../../components/select';
import Checkbox from '../../../components/checkbox';
import Input from '../../../components/Input';


/* ───────────────────────────── Types ───────────────────────────── */

interface EventModel {
  id: string;
  kind?: string;
  status?: string;
  summary?: string;
  description?: string;
  color_id?: string;
  start_date?: string;
  start_datetime?: string;
  start_timezone?: string;
  end_date?: string;
  end_datetime?: string;
  end_timezone?: string;
  end_time_unspecified?: boolean;
}

interface EventFormProps {
  initialData?: EventModel;
  onSubmit: (data: EventModel) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

/* ───────────────────────────── Main Form ───────────────────────────── */

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<EventModel>({
    id: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = useCallback((field: keyof EventModel, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  /* ───────────── Select Options ───────────── */

  const statusOptions = useMemo(() => [
    { value: 'confirmed', label: 'Confirmed', icon: <IconCheck size={16} className="text-green-600" /> },
    { value: 'tentative', label: 'Tentative', icon: <IconClock size={16} className="text-yellow-600" /> },
    { value: 'cancelled', label: 'Cancelled', icon: <IconX size={16} className="text-red-600" /> }
  ], []);

  const timezoneOptions = useMemo(() => [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Australia/Sydney', label: 'Sydney' }
  ], []);
  let [range, setRange] = useState(false)
  const colorOptions = useMemo(() => [
    { value: '1', label: 'Blue', icon: <div className="w-4 h-4 rounded-full bg-blue-600" /> },
    { value: '2', label: 'Green', icon: <div className="w-4 h-4 rounded-full bg-green-600" /> },
    { value: '3', label: 'Purple', icon: <div className="w-4 h-4 rounded-full bg-purple-600" /> },
    { value: '4', label: 'Red', icon: <div className="w-4 h-4 rounded-full bg-red-600" /> },
    { value: '5', label: 'Yellow', icon: <div className="w-4 h-4 rounded-full bg-yellow-600" /> },
    { value: '6', label: 'Orange', icon: <div className="w-4 h-4 rounded-full bg-orange-600" /> },
    { value: '7', label: 'Turquoise', icon: <div className="w-4 h-4 rounded-full bg-cyan-600" /> }
  ], []);

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            {initialData ? 'Edit Event' : 'New Event'}
          </h1>
          <div className="flex items-center space-x-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg active:bg-gray-200 touch-manipulation"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg active:bg-indigo-700 disabled:opacity-50 touch-manipulation"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border flex gap-4 flex-col border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4 flex flex-col gap-4">

            <Input
              type="text"
              label="Summary"
              value={formData.summary}
              onChange={(v) => handleChange('summary', v)}
              placeholder="title"
              fullWidth
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(v) => handleChange('status', v)}
              placeholder="Select status"
              size="lg"
              fullWidth
              clearable
              leftSection={<IconClock size={18} />}
            />

            <DataInput
              type="text"
              label="Description"
              value={formData.description}
              onChange={(v) => handleChange('description', v)}
              placeholder="Event description and details"
              size="lg"
              fullWidth
            />


            <Select
              label="Color"
              options={colorOptions}
              value={formData.color_id}
              onChange={(v) => handleChange('color_id', v)}
              placeholder="Select color"
              size="lg"
              searchable
              fullWidth
              leftSection={<IconColorSwatch size={18} />}
            />

          </div>
          {/* Date & Time */}

          <Checkbox checked={range} label='range action' onClick={() => setRange(!range)} />
          {range ? <div className="space-y-6 flex flex-col gap-4">
            {/* Start Time */}
            <div className="space-y-3 flex flex-col gap-4">


              <DataInput
                type="datetime"
                label="Start Date & Time"
                value={formData.start_datetime}
                onChange={(v) => handleChange('start_datetime', v)}
                size="lg"
                fullWidth
              />

            </div>

            {/* End Time */}
            <div className="space-y-3 flex flex-col gap-4">


              <DataInput
                type="datetime"
                label="End Date & Time"
                value={formData.end_datetime}
                onChange={(v) => handleChange('end_datetime', v)}
                size="lg"
                fullWidth
              />
            </div>
          </div> : <div className="space-y-3 flex flex-col gap-4">


            <DataInput
              type="datetime"
              label="Date & Time"
              value={formData.start_datetime}
              onChange={(v) => handleChange('start_datetime', v)}
              size="lg"
              fullWidth
            />

          </div>}
        </div>

      </div>
    </form>
  );
};

export default React.memo(EventForm);