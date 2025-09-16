import { useEffect, useState, WheelEvent as ReactWheelEvent } from "react";

export const useImageViewer = () => {
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_SPEED = 0.02;

  useEffect(() => {
    const preventNativeZoom = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };
    document.addEventListener("wheel", preventNativeZoom, { passive: false });
    return () => document.removeEventListener("wheel", preventNativeZoom);
  }, []);

  const handleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const delta = -Math.sign(e.deltaY);
      setZoom((currentZoom) => {
        const newZoom = currentZoom + delta * ZOOM_SPEED;
        return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
      });
    }
  };

  const handleZoomIn = () => {
    setZoom((currentZoom) => Math.min(currentZoom + ZOOM_SPEED, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((currentZoom) => Math.max(currentZoom - ZOOM_SPEED, MIN_ZOOM));
  };

  return { zoom, handleWheel, handleZoomIn, handleZoomOut };
};
