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

  const linesBreak = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    text: string, 
    padding: number
  ) => {

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
}
const crop = (inputImage:any, aspectRatio:number) => {
  // let's store the width and height of our image
  const inputWidth = inputImage.naturalWidth;
  const inputHeight = inputImage.naturalHeight;

  // get the aspect ratio of the input image
  const inputImageAspectRatio = inputWidth / inputHeight;

  // if it's bigger than our target aspect ratio
  let outputWidth = inputWidth;
  let outputHeight = inputHeight;
  if (inputImageAspectRatio > aspectRatio) {
      outputWidth = inputHeight * aspectRatio;
  } else if (inputImageAspectRatio < aspectRatio) {
      outputHeight = inputWidth / aspectRatio;
  }

  // calculate the position to draw the image at
  const outputX = (outputWidth - inputWidth) * 0.5;
  const outputY = (outputHeight - inputHeight) * 0.5;

  // create a canvas that will present the output image
  const outputCanvas = document.createElement('canvas');

  // set it to the same size as the image
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;

  // draw our image at position 0, 0 on the canvas
  const ctx = outputCanvas.getContext('2d');
  if(!ctx) { return }
  ctx.drawImage(inputImage, outputX, outputY);
  var outputImage = new Image();
  outputImage.src = outputCanvas.toDataURL();
  return outputImage
}


const drawPersonnalisation = (ctx:any, img:any, data:any, canvas:any) => {
  if (data.image){

    const outputImage = crop(data.image, 1)
    const canvasRatio = canvas.width / canvas.height 

    if (!outputImage) { return }

    if (canvasRatio >= 1) {
      outputImage.width = outputImage.height = canvas.height
      const posX = canvas.width / 2 - outputImage.width / 2
      ctx.drawImage(outputImage,  posX, 0, outputImage.width, outputImage.height);
    }
    else {
      outputImage.width = canvas.width
      outputImage.height = canvas.width
      const posY = canvas.height / 2 - outputImage.height / 2
      ctx.drawImage(outputImage,  0, posY, outputImage.width, outputImage.height);
    }
    
  }
  
}
export default { resetCanvas, drawSlogan, drawPersonnalisation }