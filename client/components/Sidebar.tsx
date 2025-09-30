import React from 'react';
import type { Annotation, FormData, NewAnnotation } from '@/types';
import AnnotationForm from '@/components/AnnotationForm';

// A simple component to display a key-value pair for details
const DetailRow = ({ label, value }: { label: string; value?: string | boolean | null }) => {
  if (value === null || value === undefined || value === '') return null;
  
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</h3>
      <p className="text-base text-gray-200">{displayValue}</p>
    </div>
  );
};

// Props for our new Sidebar component
interface SidebarProps {
  newAnnotation: NewAnnotation | null;
  selectedAnnotation: Annotation | null;
  onSave: (formData: FormData) => void;
  onCancel: () => void;
}

export default function Sidebar({ newAnnotation, selectedAnnotation, onSave, onCancel }: SidebarProps) {
  return (
    <div className="bg-[#1E1E1E] border border-gray-800  p-6 overflow-y-auto h-full">
      {selectedAnnotation && (
        <div>
          <h2 className="text-xl font-bold mb-6 text-amber-500">Annotation Details</h2>
          <DetailRow label="Marker" value={selectedAnnotation.marker} />
          <DetailRow label="Component ID" value={selectedAnnotation.componentId} />
          <DetailRow label="Section" value={selectedAnnotation.section} />
          <DetailRow label="Is Required" value={selectedAnnotation.isRequired} />
          <DetailRow label="Is API Available" value={selectedAnnotation.isApiAvailable} />
          <DetailRow label="Is API Available" value={selectedAnnotation.isApiAvailable} />
          <DetailRow label="Is API Available" value={selectedAnnotation.isApiAvailable} />
          <DetailRow label="Is API Available" value={selectedAnnotation.isApiAvailable} />
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Interactivity/Logic</h3>
            <p className="text-base text-gray-200 whitespace-pre-wrap">{String(selectedAnnotation.interactivity)}</p>
          </div>
        </div>
      )}

      

      {!newAnnotation && !selectedAnnotation && (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <p className="text-lg">Select an existing marker to view its details, or click on the canvas to add a new annotation.</p>
        </div>
      )}
    </div>
  );
}
