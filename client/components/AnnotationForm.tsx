'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// This interface defines the data structure for our form
interface FormData {
  marker: string;
  componentId: string;
  section: string;
  interactivity: string;
  isRequired: boolean;
  isApiAvailable: boolean;
  // Add any other fields from your schema you want in the form
}

// Props that the component will accept
interface AnnotationFormProps {
  x: number;
  y: number;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}

export default function AnnotationForm({ x, y, onSave, onCancel }: AnnotationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    marker: '',
    componentId: '',
    section: '',
    interactivity: '',
    isRequired: false,
    isApiAvailable: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately
    const isCheckbox = type === 'checkbox';
    const checkedValue = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    onSave(formData);
  };

  return (
    <div
      className="absolute bg-white rounded-lg shadow-2xl p-6 w-96 border border-gray-200"
      style={{ left: `${x + 20}px`, top: `${y}px` }} // Position form next to the click
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the form from closing it
    >
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold mb-4 text-gray-800">New Annotation</h3>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="marker" className="block text-sm font-medium text-gray-600">Marker / Title</label>
            <input
              type="text"
              name="marker"
              id="marker"
              value={formData.marker}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="interactivity" className="block text-sm font-medium text-gray-600">Interactivity / Logic</label>
            <textarea
              name="interactivity"
              id="interactivity"
              value={formData.interactivity}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* Add other inputs for section, componentId, etc. here */}
          <div className="flex items-center justify-between">
             <div className="flex items-center">
                <input id="isRequired" name="isRequired" type="checkbox" checked={formData.isRequired} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-900">Is Required?</label>
             </div>
             <div className="flex items-center">
                <input id="isApiAvailable" name="isApiAvailable" type="checkbox" checked={formData.isApiAvailable} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="isApiAvailable" className="ml-2 block text-sm text-gray-900">API Available?</label>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
