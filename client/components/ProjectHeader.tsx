interface ProjectHeaderProps {
  projectId?: string;
  zoomLevel: number;
  isExporting: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExport: () => void;
}

const ZoomIcon = () => (
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
);
const MinusIcon = () => (
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
);

export default function ProjectHeader({
  projectId,
  zoomLevel,
  isExporting,
  onZoomIn,
  onZoomOut,
  onExport,
}: ProjectHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 shrink-0">
        Project: {projectId}
      </h1>

      <button
        onClick={onExport}
        disabled={isExporting}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isExporting ? "Exporting..." : "Export to Excel"}
      </button>

      <div className="flex gap-2 items-center">
        <button
          onClick={onZoomOut}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
        >
          <ZoomIcon />
        </button>
        <span className="min-w-[60px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
        >
          <MinusIcon />
        </button>
      </div>
    </div>
  );
}
