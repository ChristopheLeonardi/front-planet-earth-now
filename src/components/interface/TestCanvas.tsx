import React, { useState, useEffect, useRef } from 'react';
import utils from './canvasUtils/Utils';
import drawPersonnalisation from './canvasUtils/ImagePersonnalisation';
import { useSelected } from './../../context/SelectedContext';
import DragText from './canvasUtils/DragText';

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
  is_selected: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ data }) => {
  const { textsSaved, selectedText, canvas, ctx, img, setSelected } = useSelected();
  const [persoImageLoaded, setPersoImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const drawSlogan = async (ctx: any, img: any, data: any, canvas: any) => {
    utils.handleOrientation(ctx, img, data, canvas);

    await utils.loadFont(data);

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
        is_selected: false
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

      if (img.complete) {
         drawSlogan(ctx, img, data, canvas);
      } else {
        await new Promise<Line[]>((resolve) => {
          img.onload = () => {
            resolve(drawSlogan(ctx, img, data, canvas));
          };
        });
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
      <>
      <DragText fontSize={parseInt(data.taille) * 10}/>
      <canvas id="flag-personnalisation" className={data.orientation} ref={canvasRef} width={canvasSize.width} height={canvasSize.height}></canvas>
      </>
  );
};

export default Canvas;
