import { useSelected } from "../../../context/SelectedContext";
import { useState, useEffect } from "react";

interface Line {
  height: number;
  width: any;
  text: string;
  x: number;
  y: number;
  size: number;
  fontFamily: string;
  is_selected: boolean;
}

const DragText = ({ fontSize }: { fontSize: any }) => {
  const { textsSaved, selectedText, canvas, ctx, img, data, setSelected } = useSelected();

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (!textsSaved.length || !canvas) {
      return;
    }
    const texts = textsSaved;

    const textHittest = (x: number, y: number, textIndex: number) => {
      const text = textsSaved[textIndex];
      return x >= text.x && x <= text.x + text.width && y >= text.y && y <= text.y + text.height;
    };

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      if (!canvas) return { x: 0, y: 0 };

      const canvasOffset = canvas.getBoundingClientRect();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      let clientX: number, clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      let canvasMouseX = clientX - canvasOffset.left;
      let canvasMouseY = clientY - canvasOffset.top;

      const realCanvasWidth = canvas.offsetWidth;
      const realCanvasHeight = canvas.offsetHeight;

      const scaleX = canvasWidth / realCanvasWidth;
      const scaleY = canvasHeight / realCanvasHeight;

      canvasMouseX *= scaleX;
      canvasMouseY *= scaleY;

      return { x: canvasMouseX, y: canvasMouseY };
    };


const calculateStart = (pos: { x: number, y: number }) => {
  let foundText = false;
  const updatedTexts = textsSaved.map((text, index) => {
    const is_selected = textHittest(pos.x, pos.y, index);
    if (is_selected) {
      setStartX(pos.x - texts[index].x);
      setStartY(pos.y - texts[index].y);
      setSelected((prevState) => ({
        ...prevState,
        selectedText: index,
      }));
      foundText = true;
    }
    return {
      ...text,
      is_selected: is_selected,
    };
  });

  if (foundText) {
    setSelected((prevState) => ({
      ...prevState,
      textsSaved: updatedTexts,
    }));
  }
};


    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const pos = getMousePos(e);
      calculateStart(pos);
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const pos = getMousePos(e);
      calculateStart(pos);
    };

    const handleMouseUp = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setSelected((prevState) => ({
        ...prevState,
        selectedText: -1,
      }));
    };

    const drawMove = (pos: { x: number, y: number }) => {
      const text = { ...textsSaved[selectedText] };
      text.x = pos.x - startX;
      text.y = pos.y - startY;
      texts[selectedText] = text;

      setSelected((prevState) => ({
        ...prevState,
        textsSaved: [...texts],
      }));

      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(!ctx || !img || !canvas) { return }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


      
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      texts.forEach((t: Line) => {
        ctx.font = `${t.size}px ${data.fontFamily}`;
        ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
        ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
        ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (selectedText >= 0) {
        const pos = getMousePos(e);
        drawMove(pos);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (selectedText >= 0) {
        const pos = getMousePos(e);
        drawMove(pos);
      }
    };

    const handleMouseOut = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setSelected((prevState) => ({
        ...prevState,
        selectedText: -1,
      }));
    };

    // Remove previous event listeners to avoid duplicates
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mouseout", handleMouseOut);
    canvas.removeEventListener("touchstart", handleTouchStart);
    canvas.removeEventListener("touchmove", handleTouchMove);
    canvas.removeEventListener("touchend", handleMouseUp);

    // Attach new event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseout', handleMouseOut);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleMouseUp);

    return () => {
      // Clean up event listeners on unmount
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseOut);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleMouseUp);
    };
  }, [textsSaved, selectedText, startX, startY, canvas, ctx, img, data, setSelected, fontSize]);

  return null;
};

export default DragText;
