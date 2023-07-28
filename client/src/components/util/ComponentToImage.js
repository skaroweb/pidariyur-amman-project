import React, { useRef } from "react";
import html2canvas from "html2canvas";

const ComponentToImage = ({ children }) => {
  const componentRef = useRef(null);

  // Extract the value at index 0
  const donorName = children[1].props.children;
  donorName.map((donar) => {
    return donar;
  });
  const donor = donorName[1];

  const handleConvertToImage = () => {
    const node = componentRef.current;

    html2canvas(node)
      .then((canvas) => {
        const imageDataURL = canvas.toDataURL("image/png");

        // Create a temporary link and click it to download the image
        const downloadLink = document.createElement("a");
        downloadLink.href = imageDataURL;
        downloadLink.download = `Receipt-${donor || "Unknown"}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        console.error("Error capturing component as image:", error);
      });
  };

  return (
    <div>
      {/* Render children inside the ref */}
      <div
        style={{ display: "inline-block", padding: "10px" }}
        ref={componentRef}
      >
        {children}
      </div>

      <button onClick={handleConvertToImage}>Convert to PNG</button>
    </div>
  );
};

export default ComponentToImage;
