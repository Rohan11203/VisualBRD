"use client";

import {
  useEffect,
  useState,
  MouseEvent,
  useRef,
  SyntheticEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import axios from "axios";
import AnnotationForm from "@/components/AnnotationForm";
import AnnotationDetailView from "@/components/AnnotationDetailView";
import type {
  Annotation,
  FormData,
  ImageDimensions,
  NewAnnotation,
} from "@/types";
import { useProject } from "@/hooks/useProject";
import { useImageViewer } from "@/hooks/useImageViewer";
import { useImageExport } from "@/hooks/useImageExport";
import ProjectHeader from "@/components/ProjectHeader";
import AnnotationCanvas from "@/components/AnnotationCanvas";
import Sidebar from "@/components/Sidebar";
import { apiClient } from "@/lib/apiClient";

export default function ProjectPage() {
  const { id, project, setProject, error } = useProject();
  const { zoom, handleWheel, handleZoomIn, handleZoomOut } = useImageViewer();

  const imageContentRef = useRef<HTMLDivElement>(null); // Ref for the element to screenshot

  const { isExporting, handleExport } = useImageExport(imageContentRef, id);
  const [newAnnotation, setNewAnnotation] = useState<NewAnnotation | null>(
    null
  );
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<Annotation | null>(null);

  const handleDeselect = () => {
    setNewAnnotation(null);
    setSelectedAnnotation(null);
  };

  const handleCanvasClick = (
    e: MouseEvent<HTMLDivElement>,
    dimensions: {
      naturalWidth: number;
      naturalHeight: number;
      clientWidth: number;
      clientHeight: number;
    }
  ) => {
    if (newAnnotation || selectedAnnotation) {
      handleDeselect();
      return;
    }

    // Calculation to place a new annotation
    const rect = e.currentTarget.getBoundingClientRect();
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } =
      dimensions;

    const widthRatio = naturalWidth / (clientWidth * zoom);
    const heightRatio = naturalHeight / (clientHeight * zoom);
    const xOffset = (rect.width - clientWidth * zoom) / 2;
    const yOffset = (rect.height - clientHeight * zoom) / 2;

    const x = (e.clientX - rect.left - xOffset) * widthRatio;
    const y = (e.clientY - rect.top - yOffset) * heightRatio;

    setNewAnnotation({ x, y });
  };

  const handleSaveAnnotation = async (formData: FormData) => {
    if (!newAnnotation) return;
    const annotationData = {
      ...formData,
      x: newAnnotation.x,
      y: newAnnotation.y,
    };

    try {
      const savedAnnotation = await apiClient(`/screens/${id}/annotations`, {
        method: "POST",
        body: JSON.stringify(annotationData),
      });

      setProject((prev) =>
        prev
          ? { ...prev, annotations: [...prev.annotations, savedAnnotation] }
          : null
      );
      setNewAnnotation(null);
    } catch (err) {
      console.error("Failed to save annotation:", err);
    }
  };

  const handleMarkerClick = (
    e: MouseEvent<HTMLDivElement>,
    annotation: Annotation
  ) => {
    e.stopPropagation(); // Prevent the main canvas click from firing
    setSelectedAnnotation(annotation);
    setNewAnnotation(null); // Ensure the new annotation form is closed
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!project) return <p className="text-center mt-10">Loading project...</p>;

  return (
    <main className="w-full h-screen   bg-black text-white overflow-hidden">
      {/* --- Main Canvas Area (Left Side) --- */}
      <div className="bg-[#1E1E1E]">
        <ProjectHeader
          projectId={project.name}
          zoomLevel={zoom}
          isExporting={isExporting}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onExport={handleExport}
        />
      </div>
      <div className="flex">
        <div className="bg-[#1E1E1E] h-screen flex flex-col flex-grow">
          <AnnotationCanvas
            ref={imageContentRef}
            imageUrl={project.imageUrl}
            annotations={project.annotations}
            zoom={zoom}
            // selectedAnnotationId={selectedAnnotation?._id} // Pass selected ID for highlighting
            onWheel={handleWheel}
            onCanvasClick={handleCanvasClick}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {newAnnotation && (
          <>
            <AnnotationForm
              x={newAnnotation.x}
              y={newAnnotation.y}
              onSave={handleSaveAnnotation}
              onCancel={() => setNewAnnotation(null)}
            />
          </>
        )}

        {/* --- Sidebar Area (Right Side) --- */}
        <div className="flex-shrink-0 w-1/3 max-w-sm">
          <Sidebar
            newAnnotation={newAnnotation}
            selectedAnnotation={selectedAnnotation}
            onSave={handleSaveAnnotation}
            onCancel={handleDeselect}
          />
        </div>
      </div>
    </main>
  );
}
