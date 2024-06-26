import React, { useState, useEffect, useRef } from 'react';
import utils from './canvasUtils/Utils';
import drawPersonnalisation from './canvasUtils/ImagePersonnalisation';
import { useSelected } from './../../context/SelectedContext';

interface CanvasProps {
  data: {
    consent: boolean;
    image: any;
    orientation: string;
    perso: boolean;
    sloganInput: string;
    typedepersonnalisation: string;
    taille: string;
    fontFamily: string;
  };
}

interface Line {
  height: number;
  width: any;
  text: string;
  x: number;
  y: number;
  size: number;
  fontFamily: string;
}

const Canvas: React.FC<CanvasProps> = ({ data }) => {
  const { textsSaved, setSelected } = useSelected();
  const [persoImageLoaded, setPersoImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFont = async (data: any) => {
    const css = `@import url('https://fonts.googleapis.com/css?family=${data.fontFamily.replace(' ', '+')}&subset=latin,latin-ext');`;
    const head = document.head || document.getElementsByTagName('head')[0];
    let style = document.getElementById('loadFont') || document.createElement('style');
    style.setAttribute('id', 'loadFont');
    head.appendChild(style);

    style.appendChild(document.createTextNode(css));
    await document.fonts.load(`${parseInt(data.taille)}px ${data.fontFamily}`);
  };

  const drawSlogan = async (ctx: any, img: any, data: any, canvas: any) => {
    utils.handleOrientation(ctx, img, data, canvas);

    await loadFont(data);

    const fontSize = parseInt(data.taille) * 10;
    const fontFamily = data.fontFamily;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;

    const text = data.sloganInput;
    const lines = text.split('\n');

    const canvasLines: Line[] = [];

    const lineX = canvas.width / 2;
    lines.forEach((line: string, index: number) => {
      const heightDivision = canvas.height / (lines.length + 1);
      const lineY = heightDivision * (index + 1);
      const lineWidth = ctx.measureText(line).width;

      const lineObj: Line = {
        text: line,
        x: lineX - lineWidth / 2,
        y: lineY - fontSize,
        height: fontSize,
        width: lineWidth,
        size: fontSize,
        fontFamily: fontFamily,
      };
      canvasLines.push(lineObj);
    });

    setSelected((prevState) => ({
      ...prevState,
      textsSaved: canvasLines,
      selectedText: -1,
      ctx: ctx,
      canvas: canvas,
      img: img,
      canvasRef: canvasRef,
      data: data,
    }));

    canvasLines.forEach((line: Line, index: number) => {
      const heightDivision = canvas.height / (lines.length + 1);
      const lineY = heightDivision * (index + 1);

      ctx.fillText(line.text, lineX, lineY);
      ctx.strokeText(line.text, lineX, lineY);
      ctx.fillText(line.text, lineX, lineY);
    });

    return canvasLines;
  };

  const dragText = (texts: Line[], canvas: any, ctx: any, fontSize: number, img: any, data: any, canvasRef: any) => {
    if (!textsSaved.length || !canvas) {
      return;
    }

    let startX: any;
    let startY: any;
    let selectedText = -1;

    const textHittest = (x: any, y: any, textIndex: any) => {
      console.log(x,y)
      if (!textsSaved || textsSaved == undefined) {return}
      const text = textsSaved[textIndex];
      //if (!text ) {return}
      console.log(text)
      return (
        x >= text.x && x <= text.x + text.width &&
        y >= text.y && y <= text.y + text.height
      );
    };

    const getMousePos = (e: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const canvasOffset = canvas.getBoundingClientRect();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      let canvasMouseX = e.clientX - canvasOffset.left;
      let canvasMouseY = e.clientY - canvasOffset.top;

      const realCanvasWidth = canvas.offsetWidth;
      const realCanvasHeight = canvas.offsetHeight;

      const scaleX = canvasWidth / realCanvasWidth;
      const scaleY = canvasHeight / realCanvasHeight;

      canvasMouseX *= scaleX;
      canvasMouseY *= scaleY;

      return { x: canvasMouseX, y: canvasMouseY };
    };

    const getTouchPos = (e: any) => {
      const touch = e.touches[0];
      return getMousePos({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleMouseDown = (e: any) => {
      e.preventDefault();
      const pos = getMousePos(e);
      for (let i = 0; i < texts.length; i++) {
        if (textHittest(pos.x, pos.y, i)) {
          selectedText = i;
          startX = pos.x - texts[i].x;
          startY = pos.y - texts[i].y;
          break;
        }
      }
    };

    const handleTouchStart = (e: any) => {
      e.preventDefault();
      const pos = getTouchPos(e);

      for (let i = 0; i < texts.length; i++) {
        if (textHittest(pos.x, pos.y, i)) {
          selectedText = i;
          startX = pos.x - texts[i].x;
          startY = pos.y - texts[i].y;
          break;
        }
      }
    };

    const handleMouseUp = (e: any) => {
      e.preventDefault();
      selectedText = -1;
    };

    const handleTouchEnd = (e: any) => {
      e.preventDefault();
      selectedText = -1;
    };

    const handleMouseOut = (e: any) => {
      e.preventDefault();
      selectedText = -1;
    };

    const handleMouseMove = (e: any) => {
      if (selectedText < 0) {
        return;
      }
      e.preventDefault();
      const pos = getMousePos(e);

      const text = { ...textsSaved[selectedText] };
      text.x = pos.x - startX;
      text.y = pos.y - startY;

      texts = [
        ...texts.slice(0, selectedText),
        text,
        ...texts.slice(selectedText + 1)
      ];

      setSelected((prevState) => ({
        ...prevState,
        textsSaved: texts,
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      utils.handleOrientation(ctx, img, data, canvas);

      ctx.font = `${fontSize}px ${data.fontFamily}`;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      texts.forEach((t: Line) => {
        ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
        ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
        ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      });
    };

    const handleTouchMove = (e: any) => {
      if (selectedText < 0) {
        return;
      }
      e.preventDefault();
      const pos = getTouchPos(e);

      const text = { ...textsSaved[selectedText] };
      text.x = pos.x - startX;
      text.y = pos.y - startY;

      texts = [
        ...texts.slice(0, selectedText),
        text,
        ...texts.slice(selectedText + 1)
      ];

      setSelected((prevState) => ({
        ...prevState,
        textsSaved: texts,
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      utils.handleOrientation(ctx, img, data, canvas);

      ctx.font = `${fontSize}px ${data.fontFamily}`;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      texts.forEach((t: Line) => {
        ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
        ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
        ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mouseout', handleMouseOut);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
  };

  const drawCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    data: any,
    setPersoImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const canvasData = utils.resetCanvas(canvasRef);
    if (!canvasData) return;
    drawImage(canvasData.ctx, data, canvasData.canvas, canvasRef, setPersoImageLoaded);
  };

  const drawImage = (
    ctx: any,
    data: any,
    canvas: any,
    canvasRef: any,
    setPersoImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const idImg =
      data.typedepersonnalisation === 'logoIncrustation'
        ? 'baseEfoPerso'
        : data.orientation === 'paysage'
        ? 'baseEfoSlogan'
        : 'baseEfoSloganVertical';

    const img = document.getElementById(idImg) as HTMLImageElement | null;
    if (!img) {
      console.error(`Image element with ID '${idImg}' not found.`);
      return;
    }
    img.crossOrigin = 'anonymous';
    if (data.typedepersonnalisation === 'slogan') {
      processSloganCanvas(ctx, img, data, canvas, canvasRef);
    }
    if (data.typedepersonnalisation === 'logoIncrustation') {
      if (data.image) {
        if (img.complete) {
          drawPersonnalisation(ctx, img, data, canvas);
          setPersoImageLoaded(true);
        } else {
          img.onload = () => {
            drawPersonnalisation(ctx, img, data, canvas);
            setPersoImageLoaded(true);
          };
        }
      }
      utils.handleOrientation(ctx, img, data, canvas);
    }
  };

  const processSloganCanvas = async (ctx: any, img: any, data: any, canvas: any, canvasRef: any) => {
    if (data.typedepersonnalisation === 'slogan') {
      let canvasLines: Line[];

      if (img.complete) {
        canvasLines = await drawSlogan(ctx, img, data, canvas);
      } else {
        canvasLines = await new Promise<Line[]>((resolve) => {
          img.onload = () => {
            resolve(drawSlogan(ctx, img, data, canvas));
          };
        });
      }
      if (canvasLines) {
        dragText(canvasLines, canvas, ctx, parseInt(data.taille) * 10, img, data, canvasRef);
      }
    }
  };

  const canvasSize = data.orientation === 'paysage' ? { width: 1000, height: 680 } : { width: 680, height: 1000 };

  useEffect(() => {
    drawCanvas(canvasRef, data, setPersoImageLoaded);
  }, [data]);

  useEffect(() => {
    if (persoImageLoaded) {
      drawCanvas(canvasRef, data, setPersoImageLoaded);
      setPersoImageLoaded(false);
    }
  }, [persoImageLoaded]);

  return (
      <canvas id="flag-personnalisation" className={data.orientation} ref={canvasRef} width={canvasSize.width} height={canvasSize.height}></canvas>
  );
};

export default Canvas;
