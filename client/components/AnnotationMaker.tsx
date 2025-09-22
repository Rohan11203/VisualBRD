import React, { MouseEvent, useEffect, useRef, useState } from "react";
import type { Annotation, ImageDimensions } from "@/types";
import axios from "axios";
import { useProject } from "@/hooks/useProject";

interface AnnotationMarkerProps {
  annotation: Annotation;
  imageDimensions: ImageDimensions;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  ref: any;
}

const AnnotationMarker: React.FC<AnnotationMarkerProps> = ({
  annotation,
  imageDimensions,
  onClick,
  ref,
}) => {
  const { id } = useProject();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: annotation.x,
    y: annotation.y,
  });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging || !ref.current) return;

    // const rect = ref.current.getBoundingClientRect();
    const img = ref.current.querySelector("img");
    if (!img) return;

    // Calculate the image's actual dimensions on screen
    const imgRect = img.getBoundingClientRect();

    // Calculate relative position within the image
    const x =
      ((e.clientX - imgRect.left) / imgRect.width) *
      imageDimensions.naturalWidth;
    const y =
      ((e.clientY - imgRect.top) / imgRect.height) *
      imageDimensions.naturalHeight;

    setPosition({ x, y });
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      await axios.put(
        `http://localhost:3000/api/v1/screens/${id}/annotations/${annotation._id}/coordinates`,
        {
          x: position.x,
          y: position.y,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to update annotation position:", error);
      setPosition({ x: annotation.x, y: annotation.y });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position.x, position.y]);

  const leftPercent = (position.x / imageDimensions.naturalWidth) * 100;
  const topPercent = (position.y / imageDimensions.naturalHeight) * 100;

  return (
    <div
      className={`absolute w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center 
        text-white font-bold text-sm border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 
        cursor-move hover:scale-110 transition-transform ${
          isDragging ? "scale-110" : ""
        }`}
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        cursor: isDragging ? "grabbing" : "grab",
        transform: `translate(-50%, -50%) ${
          isDragging ? "scale(1.1)" : "scale(1)"
        }`,
      }}
      title={annotation.marker}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      <span className="absolute bg-black/70 text-white px-2 py-1 opacity-60 rounded-md text-xs whitespace-nowrap -translate-y-full -translate-x-1/2 left-1/2 -top-2">
        {annotation.marker}
      </span>
    </div>
  );
};

export default AnnotationMarker;
