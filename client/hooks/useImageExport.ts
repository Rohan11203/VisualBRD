import { RefObject, useState } from "react";
import * as htmlToImage from "html-to-image";
import axios from "axios";

export const useImageExport = (
  imageContentRef: RefObject<any>,
  screenId?: string,
) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = async () => {

    if (!imageContentRef.current || !screenId) return;
    setIsExporting(true);
    try {
      // 1. Capture the screenshot as a Blob
      const imageBlob = await htmlToImage.toBlob(imageContentRef.current!, {
        quality: 0.95,
      });
      if (!imageBlob) {
        throw new Error("Failed to create image from canvas.");
      }

      // 2. Create FormData to send the file
      const formData = new FormData();
      formData.append(
        "annotatedImage",
        imageBlob,
        `specsync-export-${screenId}.png`
      );
      // 3. Send the file to the backend using a POST request
      const response = await axios({
        
        url: `http://localhost:3000/api/v1/screens/${screenId}/export`, // The endpoint is the same
        method: "POST",
        data: formData,
        withCredentials: true,
        responseType: "blob", // We still expect a file back
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 4. Handle the download (this part is the same as before)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `BRD-${screenId || "export"}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export the BRD. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  return { isExporting, handleExport };
};
