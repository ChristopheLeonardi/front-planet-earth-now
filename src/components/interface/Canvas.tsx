import React, { useEffect, useRef, useState } from 'react';
import utils from './canvasUtils/Utils';
import Utils from './canvasUtils/Utils';
import { useSelected } from '../../context/SelectedContext';
import DragText from './canvasUtils/DragText';
import DragImage from './canvasUtils/DragImage';

interface CanvasProps {
  data: {
    PersoCanvasSubtitle: any;
    PersoCanvasTitle: any;
    SloganCanvasSubtitle: any;
    SloganCanvasTitle: any;
    consent: boolean;
    image: any;
    format: string;
    perso: boolean;
    sloganInput: string;
    type: string;
    taille: string;
    fontFamily: string;
    [key: string]: any;
  };
  taille: any;
  setTaille: any;
  dataTitle: any;
  formData: any;
}

interface Line {
  height: number;
  width: number;
  text: string;
  x: number;
  y: number;
  size: number;
  fontFamily: string;
  is_selected: boolean;
  lineWidth: number;
}

const waitForImage = (img: HTMLImageElement): Promise<void> => {
  return new Promise((resolve, reject) => {
    const checkImage = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve();
      } else {
        reject(
          new Error(
            `L’image n’a pas pu être chargée : ${img.currentSrc || img.src}`
          )
        );
      }
    };

    if (img.complete) {
      checkImage();
      return;
    }

    img.addEventListener('load', checkImage, { once: true });
    img.addEventListener(
      'error',
      () => {
        reject(
          new Error(
            `Erreur de chargement de l’image : ${img.currentSrc || img.src}`
          )
        );
      },
      { once: true }
    );
  });
};

const Canvas: React.FC<CanvasProps> = ({ data, setTaille, dataTitle }) => {
  const { setSelected } = useSelected();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseImageSrc, setBaseImageSrc] = useState('');

  const drawSlogan = async (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    currentData: any,
    canvas: HTMLCanvasElement
  ) => {
    await waitForImage(img);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    await utils.loadFont(currentData);

    const fontSize = parseInt(currentData.taille, 10);
    const fontFamily = currentData.fontFamily;

    currentData.size = {
      ...(currentData.size || {}),
      canvas: {
        width: canvas.width,
        height: canvas.height,
      },
    };

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;

    const lines = String(currentData.sloganInput || '').split('\n');
    const canvasLines: Line[] = [];
    const lineX = canvas.width / 2;

    lines.forEach((line: string, index: number) => {
      const heightDivision = canvas.height / (lines.length + 1);
      const lineY = heightDivision * (index + 1);
      const lineWidth = ctx.measureText(line).width;

      canvasLines.push({
        text: line,
        x: lineX - lineWidth / 2,
        y: lineY - fontSize,
        height: fontSize,
        width: lineWidth,
        size: fontSize,
        fontFamily,
        is_selected: false,
        lineWidth,
      });
    });

    setSelected((prevState: any) => ({
      ...prevState,
      textsSaved: canvasLines,
      selectedText: -1,
      ctx,
      canvas,
      img,
      canvasRef,
      data: currentData,
    }));

    lines.forEach((line: string, index: number) => {
      const heightDivision = canvas.height / (lines.length + 1);
      const lineY = heightDivision * (index + 1);

      ctx.fillText(line, lineX, lineY);
      ctx.strokeText(line, lineX, lineY);
      ctx.fillText(line, lineX, lineY);
    });

    return canvasLines;
  };

  const drawPersonnalisation = async (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    currentData: any,
    canvas: HTMLCanvasElement
  ) => {
    await waitForImage(img);

    if (!currentData.image) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return;
    }

    try {
      const outputImage = await Utils.crop(
        currentData.image,
        currentData.tailleImage
      );

      let imagePosX =
        typeof currentData.imagePosX === 'number' &&
        currentData.imagePosX !== 0
          ? currentData.imagePosX
          : canvas.width / 2 - outputImage.width / 2;

      let imagePosY =
        typeof currentData.imagePosY === 'number' &&
        currentData.imagePosY !== 0
          ? currentData.imagePosY
          : canvas.height / 2 - outputImage.height / 2;

      // Conserver le centre de l’image après le calcul de sa position.
      const centerX = imagePosX + outputImage.width / 2;
      const centerY = imagePosY + outputImage.height / 2;

      imagePosX = centerX - outputImage.width / 2;
      imagePosY = centerY - outputImage.height / 2;

      if (!currentData.radioPlanete || currentData.radioPlanete === 'sansFond') {
        ctx.drawImage(
          outputImage,
          imagePosX,
          imagePosY,
          outputImage.width,
          outputImage.height
        );
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          outputImage,
          imagePosX,
          imagePosY,
          outputImage.width,
          outputImage.height
        );
      }

      currentData.imagePosX = imagePosX;
      currentData.imagePosY = imagePosY;
      currentData.size = {
        width: outputImage.width,
        height: outputImage.height,
        canvas: {
          width: canvas.width,
          height: canvas.height,
        },
      };
    } catch (error) {
      console.error("Erreur lors du chargement de l'image personnalisée :", error);
    }
  };

  const drawCanvas = async () => {
    const canvasData = utils.resetCanvas(canvasRef);
    if (!canvasData) return;

    const { canvas, ctx } = canvasData;
    const idImg = Utils.getBackgroundImageId(data);
    const img = document.getElementById(idImg) as HTMLImageElement | null;

    if (!img) {
      console.error(`Image avec l’ID '${idImg}' introuvable.`);
      return;
    }

    img.crossOrigin = 'anonymous';

    try {
      await waitForImage(img);

      setSelected((prevState: any) => ({
        ...prevState,
        img,
      }));

      if (data.type === 'slogan') {
        await drawSlogan(ctx, img, data, canvas);
      }

      if (data.type === 'logoIncrustation') {
        await drawPersonnalisation(ctx, img, data, canvas);
      }
    } catch (error) {
      console.error('Impossible de dessiner le canvas :', error);
    }
  };

  const canvasSize =
    data.format === 'paysage'
      ? {
          width: window.innerWidth,
          height: (window.innerWidth * 2) / 3,
        }
      : {
          width: (window.innerWidth * 2) / 3,
          height: window.innerWidth,
        };

  useEffect(() => {
    const imgId = Utils.getBackgroundImageId(data);
    const imgLink = document
      .getElementById(imgId)
      ?.getAttribute('srcset');

    if (imgLink) {
      setBaseImageSrc(imgLink);
    }
  }, [data]);

  useEffect(() => {
    void drawCanvas();
  }, [data]);

  return (
    <>
      {data.type === 'slogan' && (
        <DragText fontSize={parseInt(data.taille, 10) * 10} />
      )}

      {data.type === 'logoIncrustation' && (
        <DragImage data={data} setTaille={setTaille} />
      )}

      <h3 className="number-title">
        4 & 5
        <br />
        {dataTitle.legend}
      </h3>

      <p className="center">{dataTitle.modeEmploi}</p>

      <div className={`center-canvas ${data.format}`}>
        <img
          id="flag-personnalisation-background"
          className={data.format}
          srcSet={baseImageSrc}
          width={canvasSize.width}
          height={canvasSize.height}
          alt=""
        />

        <canvas
          id="flag-personnalisation"
          className={data.format}
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
        />
      </div>
    </>
  );
};

export default Canvas;