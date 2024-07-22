import { useSelected } from "../../../context/SelectedContext";
import { useEffect, useRef } from "react";
import Utils from "./Utils";

const DragImage = ({ data }: any) => {
  const { canvas, ctx, img } = useSelected();
  const draggingImage = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {

    if (!canvas || !ctx || !img) return;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const isCanvasHit = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      return (
        x >= 0 &&
        x <= rect.width &&
        y >= 0 &&
        y <= rect.height
      );
    };
    
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const pos = getMousePos(e);
      if (isCanvasHit(pos.x, pos.y)) {
        draggingImage.current = true;
        startX.current = pos.x - data.imagePosX;
        startY.current = pos.y - data.imagePosY;
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      if (!draggingImage.current) return;
      const pos = getMousePos(e);
      data.imagePosX = pos.x - startX.current;
      data.imagePosY = pos.y - startY.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (data.image) {
        const outputImage = Utils.crop(data.image, data.tailleImage);
    
        if (!outputImage) { return; }
        let imagePosX = data.imagePosX || 0;
        let imagePosY = data.imagePosY || 0;

        ctx.drawImage(outputImage, imagePosX, imagePosY, outputImage.width, outputImage.height);
    
        // Dessiner l'image de masque par-dessus
        var idImg = Utils.getBackgroundImageId(data.type, data.orientation)   
        const updatedImg = document.getElementById(idImg) as HTMLImageElement | null;
        if (!updatedImg) { return }
        ctx.drawImage(updatedImg, 0, 0, canvas.width, canvas.height);
        data.imagePosX = imagePosX;
        data.imagePosY = imagePosY;
    
      } else {
        // Si aucune image uploadée n'est présente, juste dessiner l'image de masque
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
      }
    };

    const handleMouseUp = () => {
      draggingImage.current = false;
    };

    // Add event listeners for mouse interactions
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("touchend", handleMouseUp);

    // Cleanup function
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    };
  }, [canvas, data]);



  return null;
};

export default DragImage;
