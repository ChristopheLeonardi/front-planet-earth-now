import React, { useState, useEffect, useRef } from 'react';
import utils from './canvasUtils/Utils'

interface CanvasProps {
  data: {
    consent: boolean,
    image: any,
    orientation: string,
    perso: boolean,
    sloganInput: string,
    typedepersonnalisation:string
  };
}

const drawCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  data: any,
  setPersoImageLoaded: React.Dispatch<React.SetStateAction<boolean>>

) => {
  
  const canvasData = utils.resetCanvas(canvasRef)
  if (!canvasData){ return }
  drawImage(canvasData.ctx, data, canvasData.canvas, setPersoImageLoaded);
}

// Function to draw image and text
const drawImage = (
  ctx: any,
  data: any, 
  canvas: any,
  setPersoImageLoaded: React.Dispatch<React.SetStateAction<boolean>>

) => {
  const idImg = data.typedepersonnalisation === 'slogan' ? 'baseEfoSlogan' : 'baseEfoPerso';
  const img = document.getElementById(idImg) as HTMLImageElement | null;
  if (!img) {
    console.error(`Image element with ID '${idImg}' not found.`);
    return;
  }
  img.crossOrigin="anonymous"
  if( data.typedepersonnalisation === 'slogan'){
    img.complete 
    ? utils.drawSlogan(ctx, img, data, canvas) 
    : img.onload = () => { utils.drawSlogan(ctx, img, data, canvas) }
  } 
  if( data.typedepersonnalisation === 'logoIncrustation'){
    if(data.image){
      if (img.complete) {
        utils.drawPersonnalisation(ctx, img, data, canvas)
        setPersoImageLoaded(true)
      } 
      else {
        img.onload = () => { 
          utils.drawPersonnalisation(ctx, img, data, canvas)
          setPersoImageLoaded(true)
        }
      }
    }
    utils.handleOrientation(ctx, img, data, canvas)
  } 

};

const Canvas: React.FC<CanvasProps> = ({ data }) => {

  const [persoImageLoaded, setPersoImageLoaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasSize = data.orientation === "paysage" ? {width: 1000, height: 680} : {width: 680, height: 1000}

  useEffect(() => {
    drawCanvas(canvasRef, data, setPersoImageLoaded)
  }, [data]);

  useEffect(() => {
    if (persoImageLoaded) {
      drawCanvas(canvasRef, data, setPersoImageLoaded);
      setPersoImageLoaded(false)
    }
  }, [persoImageLoaded]);

  return <canvas id="flag-personnalisation" className={data.orientation} ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />;
};

export default Canvas;
