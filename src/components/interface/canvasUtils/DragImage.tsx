import { useSelected } from "../../../context/SelectedContext";
import { useEffect, useRef } from "react";
import Utils from "./Utils";

const DragImage = ({ data, setTaille  }: any) => {
  console.log(data)
  const { canvas, ctx, img } = useSelected();
  const draggingImage = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const initialDistance = useRef(0);  // Pour le zoom avec les deux doigts
  const initialTaille = useRef(1);    // Taille initiale pour le zoom

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

      // Gérer le zoom avec les deux doigts (pinch-to-zoom)
      if (e instanceof TouchEvent && e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance.current = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialTaille.current = data.tailleImage;
      }
    };

    const handleMouseMove = async (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!draggingImage.current) return;
    
      const pos = getMousePos(e);
      data.imagePosX = pos.x - startX.current;
      data.imagePosY = pos.y - startY.current;
    
      // Si data.image existe, attendre que la nouvelle image soit prête avant d'effacer le canvas
      if (data.image) {
        try {
          const outputImage = await Utils.crop(data.image, data.tailleImage); // Attendre que l'image recadrée soit prête
    
          if (!outputImage) { return; }
    
          // Effacer le canvas une fois l'image prête
          ctx.clearRect(0, 0, canvas.width, canvas.height);
    
          let imagePosX = data.imagePosX || 0;
          let imagePosY = data.imagePosY || 0;
    
          // Dessiner l'image de masque par-dessus si elle existe
          const idImg = Utils.getBackgroundImageId(data);
          const updatedImg = document.getElementById(idImg) as HTMLImageElement | null;

          if (!data.radioplanete || data.radioPlanete === "sansFond"){
            // Dessiner l'image recadrée
            ctx.drawImage(outputImage, imagePosX, imagePosY, outputImage.width, outputImage.height);
            if (updatedImg) { ctx.drawImage(updatedImg, 0, 0, canvas.width, canvas.height)}
          }
          else {
            // Dessiner l'image recadrée
            if (updatedImg) { ctx.drawImage(updatedImg, 0, 0, canvas.width, canvas.height)}
            ctx.drawImage(outputImage, imagePosX, imagePosY, outputImage.width, outputImage.height);
          }
    
          // Mettre à jour les positions de l'image
          data.imagePosX = imagePosX;
          data.imagePosY = imagePosY;
    
        } catch (error) {
          console.error("Erreur lors du recadrage et du chargement de l'image :", error);
        }
      } else {
        // Si aucune image n'est uploadée, juste dessiner l'image de masque
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      // Gestion du zoom par pincement (pinch-to-zoom)
      if (e instanceof TouchEvent && e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const scale = currentDistance / initialDistance.current;
        const newTaille = Math.min(Math.max(initialTaille.current * scale, 0.1), 6); // Appliquer des limites au zoom

        setTaille(newTaille); // Mettre à jour l'input du zoom
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
