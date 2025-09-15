'use client';

// Define the shape of the annotation data this component will receive
interface Annotation {
  _id: string;
  marker: string;
  componentId?: string;
  section?: string;
  interactivity: String;
  isRequired?: boolean;
  isApiAvailable?: boolean;
  // Add other fields from your schema
}

interface AnnotationDetailViewProps {
  annotation: Annotation;
  onClose: () => void;
}

export default function AnnotationDetailView({ annotation, onClose }: AnnotationDetailViewProps) {
  return (
    <div className="absolute top-4 right-4 bg-white w-96 rounded-lg shadow-2xl p-6 border border-gray-200 z-20">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-800 break-words">{annotation.marker}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          {/* Close Icon SVG */}
          <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        {annotation.componentId && (
            <p><strong className="font-medium text-gray-900">Component ID:</strong> {annotation.componentId}</p>
        )}
        {annotation.section && (
            <p><strong className="font-medium text-gray-900">Section:</strong> {annotation.section}</p>
        )}
        
        <div className="prose prose-sm max-w-none">
            <p className="font-medium text-gray-900">Interactivity/Logic:</p>
            {/* You can later use a Markdown renderer here for rich text */}
            <p className="mt-1 p-2 bg-gray-50 border rounded">{annotation.interactivity}</p>
        </div>
        
        <div className="flex space-x-4 pt-2">
            <p><strong className="font-medium text-gray-900">Is Required:</strong> {annotation.isRequired ? 'Yes' : 'No'}</p>
            <p><strong className="font-medium text-gray-900">API Available:</strong> {annotation.isApiAvailable ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}
