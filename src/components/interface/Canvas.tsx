import React, { useState, useEffect, useRef } from 'react';
import utils from './canvasUtils/Utils';
import Utils from './canvasUtils/Utils';
import { useSelected } from '../../context/SelectedContext';
import DragText from './canvasUtils/DragText';
import DragImage from './canvasUtils/DragImage';

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
  const { setSelected } = useSelected();
  const [persoImageLoaded, setPersoImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const drawSlogan = async (ctx: any, img: any, data: any, canvas: any) => {

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

  const drawPersonnalisation = (ctx: any, img: any, data: any, canvas: any) => {
    if (data.image) {
      const outputImage = Utils.crop(data.image, 1, data.tailleImage);
      const canvasRatio = canvas.width / canvas.height;
  
      if (!outputImage) { return; }
  
      let imagePosX = data.imagePosX || 0;
      let imagePosY = data.imagePosY || 0;
  
      if (canvasRatio >= 1) {
        outputImage.width = outputImage.height = canvas.height;
        if (!data.imagePosX && !data.imagePosY) {
          imagePosX = canvas.width / 2 - outputImage.width / 2;
          imagePosY = 0;
        }
      } else {
        outputImage.width = canvas.width;
        outputImage.height = canvas.width;
        if (!data.imagePosX && !data.imagePosY) {
          imagePosX = 0;
          imagePosY = canvas.height / 2 - outputImage.height / 2;
        }
      }
  
      ctx.drawImage(outputImage, imagePosX, imagePosY, outputImage.width, outputImage.height);
  
      // Dessiner l'image de masque par-dessus
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      data.imagePosX = imagePosX;
      data.imagePosY = imagePosY;
  
    } else {
      // Si aucune image uploadée n'est présente, juste dessiner l'image de masque
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
    }
  }


  const drawCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    data: any,
    setPersoImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
  ) => {

    const canvasData = utils.resetCanvas(canvasRef);
    if (!canvasData) return;

    const idImg = Utils.getBackgroundImageId(data.typedepersonnalisation, data.orientation)
    const img = document.getElementById(idImg) as HTMLImageElement | null;
    if (!img) {
      console.error(`Image element with ID '${idImg}' not found.`);
      return;
    }
    img.crossOrigin = 'anonymous';

    setSelected((prevState) => ({
      ...prevState,
      img: img,
    }));

    if (data.typedepersonnalisation === 'slogan') {
      if (img.complete) {
        drawSlogan(canvasData.ctx, img, data, canvasData.canvas)
        setPersoImageLoaded(true);
      } else {
        img.onload = () => {
          drawSlogan(canvasData.ctx, img, data, canvasData.canvas)
        };
      }
    }

    if (data.typedepersonnalisation === 'logoIncrustation') {
      if (!data.image) { return }
      if (img.complete) {
        drawPersonnalisation(canvasData.ctx, img, data, canvasData.canvas);
        setPersoImageLoaded(true);
      } else {
        img.onload = () => {
          drawPersonnalisation(canvasData.ctx, img, data, canvasData.canvas);
          setPersoImageLoaded(true);
        };
      }
      canvasData.ctx.drawImage(img, 0, 0, canvasData.canvas.width, canvasData.canvas.height);
    }
  };

  const canvasSize = data.orientation === 'paysage' ? { width: 1718, height: 1168 } : { width: 1168, height: 1718 };

  useEffect(() => {
    drawCanvas(canvasRef, data, setPersoImageLoaded);
  }, [data]);

  useEffect(() => {
    if (persoImageLoaded) {
      drawCanvas(canvasRef, data, setPersoImageLoaded); 
      setPersoImageLoaded(false);
    }
  }, [persoImageLoaded]);

  useEffect(() => {
    if(!data) { return }
    var idImg = Utils.getBackgroundImageId(data.typedepersonnalisation, data.orientation)   
    const updatedImg = document.getElementById(idImg) as HTMLImageElement | null;
    setSelected((prevState) => ({
      ...prevState,
      img: updatedImg,
    }));

  }, [data])

   return (
      <>
      {data.typedepersonnalisation === "slogan" && (
        <DragText fontSize={parseInt(data.taille) * 10}/>
      )}
      {data.typedepersonnalisation === "logoIncrustation" && (
        <DragImage data={data}/>
      )}
      <canvas id="flag-personnalisation" className={data.orientation} ref={canvasRef} width={canvasSize.width} height={canvasSize.height}></canvas>
      </>
  );
};

export default Canvas;
