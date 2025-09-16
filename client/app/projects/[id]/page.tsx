"use client";

import {
  useEffect,
  useState,
  MouseEvent,
  useRef,
  SyntheticEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import AnnotationForm from "../../../components/AnnotationForm";
import AnnotationDetailView from "../../../components/AnnotationDetailView";
import * as htmlToImage from "html-to-image";
import type {
  Annotation,
  FormData,
  ImageDimensions,
  NewAnnotation,
  Project,
} from "@/types";
import { useProject } from "@/hooks/useProject";
import { useImageViewer } from "@/hooks/useImageViewer";
import { useImageExport } from "@/hooks/useImageExport";

export default function ProjectPage() {
  const { id, project, setProject, error } = useProject();
  const { zoom, handleWheel, handleZoomIn, handleZoomOut } = useImageViewer();

  const imageContentRef = useRef<HTMLDivElement>(null); // Ref for the element to screenshot

  const { isExporting, handleExport } = useImageExport(
    imageContentRef,
    project?._id
  );
  const [newAnnotation, setNewAnnotation] = useState<NewAnnotation | null>(
    null
  );
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<Annotation | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  // const [isExporting, setIsExporting] = useState<boolean>(false);

  // --- Event Handlers ---
  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setImageDimensions({
      naturalWidth: e.currentTarget.naturalWidth,
      naturalHeight: e.currentTarget.naturalHeight,
    });
  };

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    if (newAnnotation || selectedAnnotation) {
      setNewAnnotation(null);
      setSelectedAnnotation(null);
      return;
    }
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const imageElement = imageContainerRef.current.querySelector("img");
    if (!imageElement) return;

    const { naturalWidth, naturalHeight, clientWidth, clientHeight } =
      imageElement;
    const widthRatio = naturalWidth / (clientWidth * zoom);
    const heightRatio = naturalHeight / (clientHeight * zoom);
    const xOffset = (rect.width - clientWidth * zoom) / 2;
    const yOffset = (rect.height - clientHeight * zoom) / 2;

    const xOnImage = (e.clientX - rect.left - xOffset) * widthRatio;
    const yOnImage = (e.clientY - rect.top - yOffset) * heightRatio;
    setNewAnnotation({ x: xOnImage, y: yOnImage });
  };

  const handleSaveAnnotation = (formData: FormData) => {
    if (!newAnnotation) return;
    const annotationData = {
      ...formData,
      x: newAnnotation.x,
      y: newAnnotation.y,
    };
    axios
      .post(
        `http://localhost:3000/api/v1/projects/${id}/annotations`,
        annotationData
      )
      .then((response) => {
        setProject((prev) =>
          prev
            ? { ...prev, annotations: [...prev.annotations, response.data] }
            : null
        );
        setNewAnnotation(null);
      })
      .catch((err) => console.error("Failed to save annotation:", err));
  };

  const handleCancelAnnotation = () => {
    setNewAnnotation(null);
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
    <main className="w-full h-screen flex flex-col bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 shrink-0">
          Project: {project._id}
        </h1>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isExporting ? "Exporting..." : "Export to Excel"}
        </button>

        <div className="flex gap-2 items-center">
          <button
            onClick={handleZoomOut}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span className="min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      <div
        className="relative w-full  flex-grow max-w-6xl mx-auto shadow-lg cursor-crosshair bg-gray-800 rounded-md overflow-auto  "
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        ref={imageContainerRef}
        style={{ touchAction: "none", height: "calc(100vh - 8rem)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
            ref={imageContentRef}
          >
            <img
              src={project.imageUrl}
              alt="Figma design"
              className="max-w-full max-h-full object-contain"
              onLoad={handleImageLoad}
            />
            <div className="annotations">
              {imageDimensions &&
                project.annotations.map((anno) => {
                  const leftPercent =
                    (anno.x / imageDimensions.naturalWidth) * 100;
                  const topPercent =
                    (anno.y / imageDimensions.naturalHeight) * 100;
                  return (
                    <div
                      key={anno._id}
                      className="absolute w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      title={anno.marker}
                      onClick={(e) => handleMarkerClick(e, anno)}
                    >
                      <span className="absolute  bg-black/70 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap -translate-y-full -translate-x-1/2 left-1/2 -top-2">
                        {anno.marker}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {newAnnotation && imageDimensions && (
          <AnnotationForm
            x={
              (newAnnotation.x / imageDimensions.naturalWidth) *
              imageContainerRef.current!.querySelector("img")!.clientWidth
            }
            y={
              (newAnnotation.y / imageDimensions.naturalHeight) *
              imageContainerRef.current!.querySelector("img")!.clientHeight
            }
            onSave={handleSaveAnnotation}
            onCancel={handleCancelAnnotation}
          />
        )}
        {/* Conditionally render the detail view */}
        {selectedAnnotation && (
          <AnnotationDetailView
            annotation={selectedAnnotation}
            onClose={() => setSelectedAnnotation(null)}
          />
        )}
      </div>
    </main>
  );
}
