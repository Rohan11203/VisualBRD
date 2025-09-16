import React, { MouseEvent } from 'react';
import type { Annotation, ImageDimensions } from '@/types';

interface AnnotationMarkerProps {
  annotation: Annotation;
  imageDimensions: ImageDimensions;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

const AnnotationMarker: React.FC<AnnotationMarkerProps> = ({ annotation, imageDimensions, onClick }) => {
  const leftPercent = (annotation.x / imageDimensions.naturalWidth) * 100;
  const topPercent = (annotation.y / imageDimensions.naturalHeight) * 100;

  return (
    <div
      className="absolute w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
      title={annotation.marker}
      onClick={onClick}
    >
      <span className="absolute bg-black/70  text-white px-2 py-1 rounded-md text-xs whitespace-nowrap -translate-y-full -translate-x-1/2 left-1/2 -top-2 ">
        {annotation.marker}
      </span>
    </div>
  );
};

export default AnnotationMarker;
