import { useState, useEffect } from "react";

const useImageHeight = (selector: string) => {
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  const updateHeight = () => {
    const image = document.querySelector(selector) as HTMLImageElement | null;
    if (image) {
      setImageHeight(image.clientHeight);
    }
  };

  useEffect(() => {
    updateHeight(); // Mise à jour initiale
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [selector]);

  return imageHeight;
};

export default useImageHeight;