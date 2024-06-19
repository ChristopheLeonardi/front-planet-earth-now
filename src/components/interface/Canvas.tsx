import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  data: {
    typedepersonnalisation: string;
    sloganInput: string;
  };
}

const drawCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  idImg: string,
  data: any
) => {
  
  const canvasData = resetCanvas(canvasRef)
  if (!canvasData){ return }
  drawImage(canvasData.ctx, idImg, data, canvasData.canvas);

}
const resetCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  const canvas = canvasRef.current;
  if (!canvas) {
    console.error('Canvas element not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Failed to get 2d context for canvas.');
    return;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return {"ctx" : ctx, "canvas" : canvas}

}

// Function to draw image and text
const drawImage = (
  ctx: any,
  idImg: string,
  data: any, 
  canvas: any
) => {

  const img = document.getElementById(idImg) as HTMLImageElement | null;
  if (!img) {
    console.error(`Image element with ID '${idImg}' not found.`);
    return;
  }

  if( data.typedepersonnalisation === 'slogan'){
    img.complete ? drawSlogan(ctx, img, data, canvas) : img.onload = () => { drawSlogan(ctx, img, data, canvas) }
  } 
  if( data.typedepersonnalisation === 'logoIncrustation'){
    img.complete ? drawPersonnalisation(ctx, img, data, canvas) : img.onload = () => { drawPersonnalisation(ctx, img, data, canvas) }
  } 

};

const drawSlogan = (ctx:any, img:any, data:any, canvas:any) => {

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const padding = 30
  const text = data.sloganInput
  const fontSize = 5
  const lineX = canvas.width/2
  const emValue = parseFloat(getComputedStyle(canvas).fontSize);
  const fontSpec = emValue * 2
  const fontHeight = fontSize * emValue - fontSpec

  // fontstyle
  ctx.font = `${fontSize}em coconpro-bold`;
  ctx.fillStyle = "white";
  ctx.textAlign="center"

  const linesBreak = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string, padding: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
  
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < canvas.width - padding * 2) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    
    return lines;
  };

  const lines = linesBreak(ctx, canvas, text, padding)
  lines.map((line, index) => {

    // Disposition space between
    //var firstLineHeigth = fontHeight + padding
    //var midLineHeigth = canvas.height / 2 + fontHeight / 2 
    //var laststLineHeigth = canvas.height - fontHeight / 2

    // Disposition center block
    var firstLineHeigth = canvas.height / 2 - fontHeight * 2
    var midLineHeigth = canvas.height / 2 + fontHeight / 2 
    var laststLineHeigth = canvas.height / 2 + fontHeight * 2 + fontHeight

    switch (lines.length){
      case 1:
        var lineY = midLineHeigth
        break
      case 2:
        var lineY = index === 0 ? firstLineHeigth : laststLineHeigth 
        break
      case 3:
        var lineY = index === 0 ? firstLineHeigth : index === 1 ? midLineHeigth : laststLineHeigth 
        break
      default:
        var lineY = midLineHeigth
        break
    }
    
    ctx.fillText(line, lineX, lineY);
  })
  //
}

const drawPersonnalisation = (ctx:any, img:any, data:any, canvas:any) => {
  if (data.image){
    ctx.drawImage(data.image,  0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img,  0, 0, canvas.width, canvas.height);
}

const Canvas: React.FC<CanvasProps> = ({ data }) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idImg = data.typedepersonnalisation === 'slogan' ? 'baseEfoSlogan' : 'baseEfoPerso';


  useEffect(() => {
    drawCanvas(canvasRef, idImg, data)
  }, [idImg, data]);

  return <canvas ref={canvasRef} width="1000" height="680" />;
};

export default Canvas;
