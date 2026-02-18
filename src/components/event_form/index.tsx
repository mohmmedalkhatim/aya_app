import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  IconChevronLeft,
  IconColorSwatch,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import DataInput from '../data_input';
import Select from '../select';

/* ───────────────────────────── Types ───────────────────────────── */

export interface EventModel {
  id: string;
  dosage?:string;
  color_id?:string;
  medication?:string;
  time?:string;
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
    id:"",
    ...initialData
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
    <form onSubmit={handleSubmit} className="h-[44rem] w-[calc(100%-2rem)] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white  px-2 py-3">
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-2'>
            {onCancel && (
              <div
                onClick={onCancel}
                onTouchEnd={onCancel}
                className="text-sm font-medium p-2 rounded-sm cursor-pointer   text-gray-700 active:bg-gray-200 touch-manipulation"
              >
                <IconChevronLeft />
              </div>
            )}
            <h1 className="text-lg font-semibold text-gray-900">
              {initialData ? 'Edit Event' : 'Add Medition'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">

            <button
              type="submit"
              disabled={isLoading}
              className="text-sm font-medium text-gray-600 rounded px-2   disabled:opacity-50 touch-manipulation"
            >
              {isLoading ? 'Saving...' : <IconDeviceFloppy size={"1.8rem"} />}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border flex gap-4 flex-col border-gray-200 p-4">
        <div className="space-y-4 flex flex-col gap-4">

          <div className='flex flex-col gap-2'>
            <DataInput
              type="text"
              label="MEDICATION DETAILS"
              required
              value={formData.medication}
              onChange={(v) => handleChange("medication", v)}
              placeholder="Medication Name (e.g., Metformin)"
              fullWidth
            />
            <DataInput
              type="text"
              value={formData.dosage}
              onChange={(v) => handleChange('dosage', v)}
              placeholder="Dosage (e.g., 500mg)"
              required
              className='rounded-none'
              size="lg"
              fullWidth
            />
          </div>


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

       {<div className="space-y-3 flex flex-col gap-4">
          <DataInput
            type="time"
            label="Time"
            required
            value={formData.time}
            onChange={(v) => handleChange('time', v)}
            size="lg"
            fullWidth
          />

        </div>}
      </div>
    </form>
  );
};

export default React.memo(EventForm);