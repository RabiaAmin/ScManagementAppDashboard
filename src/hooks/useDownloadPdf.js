// usePdfDownloader.js
import { useState } from "react";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

export const usePdfDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePdfDownload = async (elementRef, fileName) => {
    setIsDownloading(true);
    const element = elementRef.current;
    const imgData = await toJpeg(element, { cacheBust: true, pixelRatio: 1.5, quality: 0.9 });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    if (imgHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (imgProps.width * pageHeight) / imgProps.height;
    }

    const x = (pageWidth - finalWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
    pdf.save(`${fileName}.pdf`);
    setIsDownloading(false);
  };

  return { isDownloading, handlePdfDownload };
};
