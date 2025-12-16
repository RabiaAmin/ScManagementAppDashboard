// usePdfDownloader.js
import { useState } from "react";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

export const usePdfDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePdfDownload = async (elementRef, fileName) => {
    try {
      setIsDownloading(true);
      const element = elementRef.current;

      const imgData = await toJpeg(element, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("PDF download failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handlePdfDownload };
};
