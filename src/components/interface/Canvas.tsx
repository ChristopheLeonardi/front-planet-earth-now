import React, { useState, useEffect, useRef } from 'react';
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
    
  },
  taille:any,
  setTaille:any,
  dataTitle:any,
  formData:any;

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
  lineWidth: string;
}

const Canvas: React.FC<CanvasProps> = ({ data, setTaille, dataTitle }) => { 

  const { setSelected } = useSelected();
  const [persoImageLoaded, setPersoImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const drawSlogan = async (ctx: any, img: any, data: any, canvas: any) => {

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    await utils.loadFont(data);

    const fontSize = parseInt(data.taille);
    const fontFamily = data.fontFamily;
    data.size.canvas = {width: canvas.width, height: canvas.height}
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
        is_selected: false,
        lineWidth: lineWidth
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


    const drawPersonnalisation = async (ctx: any, img: any, data: any, canvas: any) => {
      if (data.image) {
        try {
          const outputImage = await Utils.crop(data.image, data.tailleImage); // Attendre que l'image soit recadrée
          // Si les positions de l'image sont définies, les utiliser ; sinon, calculer une position centrée par défaut
          let imagePosX = (typeof data.imagePosX === 'number' && data.imagePosX != 0)  ? data.imagePosX : (canvas.width / 2 - outputImage.width / 2);

          let imagePosY = (typeof data.imagePosY === 'number' && data.imagePosX != 0) ? data.imagePosY : 
            (outputImage.width > outputImage.height 
              ? canvas.height / 2 - outputImage.height / 2 
              : canvas.height / 2 - outputImage.height / 2);
    
          // Calculer le centre de l'image actuelle avant le redimensionnement
          const centerX = imagePosX + outputImage.width / 2;
          const centerY = imagePosY + outputImage.height / 2;
    
          // Recalculer les nouvelles positions pour que l'image reste centrée après redimensionnement
          imagePosX = centerX - outputImage.width / 2;
          imagePosY = centerY - outputImage.height / 2;
          
          if (!data.radioplanete || data.radioPlanete === "sansFond"){
            // Dessiner l'image recadrée à la nouvelle position centrée
            ctx.drawImage(outputImage, imagePosX, imagePosY, outputImage.width, outputImage.height);
      
            // Dessiner l'image de masque par-dessus si nécessaire
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } 
          else {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(outputImage, imagePosX, imagePosY, outputImage.width, outputImage.height);
          }

    
          // Mettre à jour les positions de l'image dans les données
          data.imagePosX = imagePosX;
          data.imagePosY = imagePosY;
          data.size = {width: outputImage.width, height: outputImage.height, canvas: { width:canvas.width, height:canvas.height}}
          
        } catch (error) {
          console.error("Erreur lors du chargement de l'image :", error);
        }
      } else {
        // Si aucune image personnalisée n'est présente, dessiner l'image par défaut
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };
    
    


  const drawCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    data: any,
    setPersoImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
  ) => {

    const canvasData = utils.resetCanvas(canvasRef);
    if (!canvasData) return;

    const idImg = Utils.getBackgroundImageId(data)
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

    if (data.type === 'slogan') {
      if (img.complete) {
        drawSlogan(canvasData.ctx, img, data, canvasData.canvas)
        setPersoImageLoaded(true);
      } else {
        img.onload = () => {
          drawSlogan(canvasData.ctx, img, data, canvasData.canvas)
        };
      }
    }

    if (data.type === 'logoIncrustation') {
      //canvasData.ctx.drawImage(img, 0, 0, canvasData.canvas.width, canvasData.canvas.height);

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

  const canvasSize = data.format === 'paysage' ? 
    { width: window.innerWidth, height: window.innerWidth * 2 / 3 } : 
    { width: window.innerWidth * 2 / 3, height: window.innerWidth };

  const [displayCanvasTitle, setDisplayCanvasTitle] = useState(false)
  useEffect(() => {
    if (persoImageLoaded) {
      drawCanvas(canvasRef, data, setPersoImageLoaded); 
      setDisplayCanvasTitle(true)
      setPersoImageLoaded(false);
    }
  }, [persoImageLoaded]);

  useEffect(() => {
    if (!persoImageLoaded){
      drawCanvas(canvasRef, data, setPersoImageLoaded);
    }
    
  }, [data]);

  console.log(displayCanvasTitle)
  const [baseImageSrc, setBaseImageSrc] = useState("")



  useEffect(() => {
    const imgId = Utils.getBackgroundImageId(data)
    const imgLink = document.getElementById(imgId)?.getAttribute("srcset")
    if (!imgLink) { return }
    setBaseImageSrc(imgLink)
  }, [data])

   return (
      <>
      {data.type === "slogan" && (
        <DragText fontSize={parseInt(data.taille) * 10}/>
      )}
      {data.type === "logoIncrustation" && (
        <DragImage data={data} setTaille={setTaille} />
      )}
      <h3 className='number-title'>4 & 5<br/>{dataTitle.legend}</h3>
      <p className='center'>{dataTitle.modeEmploi}</p>
      <div className={`center-canvas ${data.format}`}>
        <img id='flag-personnalisation-background' className={data.format} srcSet={baseImageSrc} width={canvasSize.width} height={canvasSize.height}/>

        <canvas id="flag-personnalisation" className={data.format} ref={canvasRef} width={canvasSize.width} height={canvasSize.height}></canvas>
      </div>
      </>
  );
};

export default Canvas;
