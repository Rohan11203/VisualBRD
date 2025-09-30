import React, {
  useRef,
  useState,
  SyntheticEvent,
  MouseEvent,
  forwardRef,
  useEffect,
} from "react";
import type { Annotation, ImageDimensions } from "@/types";
import AnnotationMarker from "./AnnotationMaker";

interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  zoom: number;
  onCanvasClick: (
    e: MouseEvent<HTMLDivElement>,
    dimensions: {
      naturalWidth: number;
      naturalHeight: number;
      clientWidth: number;
      clientHeight: number;
    }
  ) => void;
  onMarkerClick: (
    e: MouseEvent<HTMLDivElement>,
    annotation: Annotation
  ) => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
}

const AnnotationCanvas = forwardRef<HTMLDivElement, AnnotationCanvasProps>(
  (
    { imageUrl, annotations, zoom, onCanvasClick, onMarkerClick, onWheel },
    ref
  ) => {
    const [imageDimensions, setImageDimensions] =
      useState<ImageDimensions | null>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
      setImageDimensions({
        naturalWidth: e.currentTarget.naturalWidth,
        naturalHeight: e.currentTarget.naturalHeight,
      });
    };

    const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
      if (!imageContainerRef.current) return;
      const img = imageContainerRef.current.querySelector("img");
      if (!img) return;
      onCanvasClick(e, {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: img.clientWidth,
        clientHeight: img.clientHeight,
      });
    };

    return (
      <div
        className="relative w-full webkit-scrollbar flex-grow max-w-6xl px-20 py-40 mx-auto shadow-lg cursor-crosshair bg-[#191919] rounded-md overflow-auto"
        onClick={handleCanvasClick}
        onWheel={onWheel}
        ref={imageContainerRef}
        style={{ touchAction: "none", height: "calc(100vh - 8rem)" }}
      >
        <div className="absolute  min-h-full">
          
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})` }}
              ref={ref}
            >
              <img
                src={imageUrl}
                alt="Figma design"
                className="max-w-full max-h-full object-contain"
                onLoad={handleImageLoad}
              />
              <div className="annotations-layer absolute top-0 left-0 w-full h-full">
                {imageDimensions &&
                  annotations.map((anno) => (
                    <AnnotationMarker
                    ref={ref}
                      key={anno._id}
                      annotation={anno}
                      imageDimensions={imageDimensions}
                      onClick={(e: any) => onMarkerClick(e, anno)}
                    />
                  ))}
              </div>
            </div>
        </div>
      </div>
    );
  }
);

AnnotationCanvas.displayName = "AnnotationCanvas";
export default AnnotationCanvas;
