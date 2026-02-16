import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  IconClock,
  IconColorSwatch,
  IconDeviceFloppy,
  IconX
} from '@tabler/icons-react';
import DataInput from '../../../components/data_input';
import Checkbox from '../../../components/checkbox';
import Input from '../../../components/Input';

import Select from '../../../components/select';
import SelectBox from '../../../components/BoxSelect';

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
    { value: 'Daily', label: 'Daily' },
    { value: 'one time', label: 'one time' },
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
    <form onSubmit={handleSubmit} className="min-h-screen  pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white  px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            {initialData ? 'Edit Event' : 'Add Medition'}
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
              className="text-sm font-medium text-gray-600 rounded   disabled:opacity-50 touch-manipulation"
            >
              {isLoading ? 'Saving...' : <IconDeviceFloppy size={"1.8rem"} />}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border flex gap-4 flex-col border-gray-200 p-4">
        <div className="space-y-4 flex flex-col gap-4">

          <Input
            type="text"
            label="Title"
            value={formData.summary}
            onChange={(v) => handleChange('summary', v)}
            placeholder="title"
            fullWidth
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

          <SelectBox
            label="type"
            options={statusOptions}
            value={formData.status}
            onChange={(v) => handleChange('kind', v)}
            placeholder="Select status"
            size="lg"
            fullWidth
            clearable
            leftSection={<IconClock size={18} />}
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
        <div className='px-1'>
          <Checkbox checked={range} className='rounded-lg' label='range action' onClick={() => setRange(!range)} />
        </div>
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
    </form>
  );
};

export default React.memo(EventForm);