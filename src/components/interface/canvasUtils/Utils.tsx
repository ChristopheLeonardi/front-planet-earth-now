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

const getBackgroundImageId = (type:string, orientation:string) => {
  if (type == "logoIncrustation"){
    var idImg = orientation === 'paysage'? 'baseEfoPerso' : 'baseEfoPersoVertical';
  } else {
    var idImg = orientation === 'paysage'? 'baseEfoSlogan' : 'baseEfoSloganVertical';
  }       

  return idImg
}
const loadFont = async (data: any) => {
  const css = `@import url('https://fonts.googleapis.com/css?family=${data.fontFamily.replace(' ', '+')}&subset=latin,latin-ext');`;
  const head = document.head || document.getElementsByTagName('head')[0];
  let style = document.getElementById('loadFont') || document.createElement('style');
  style.setAttribute('id', 'loadFont');
  head.appendChild(style);

  style.appendChild(document.createTextNode(css));
  await document.fonts.load(`${parseInt(data.taille)}px ${data.fontFamily}`);
};
const crop = (inputImage: any, aspectRatio: number, scalerValue:number) => {
  if(!scalerValue) { 
    scalerValue = 1
  }
  // let's store the width and height of our image
  const inputWidth = inputImage.naturalWidth;
  const inputHeight = inputImage.naturalHeight;

  const scaler = scalerValue;
  // get the aspect ratio of the input image
  const inputImageAspectRatio = inputImage.width / inputImage.height;

  // if it's bigger than our target aspect ratio
  let outputWidth = inputWidth;
  let outputHeight = inputHeight;
  if (inputImageAspectRatio > aspectRatio) {
    outputWidth = inputHeight * aspectRatio;
  } else if (inputImageAspectRatio < aspectRatio) {
    outputHeight = inputWidth / aspectRatio;
  }

  // calculate the position to draw the image at
  const outputX = (outputWidth * scaler - inputWidth) * 0.5;
  const outputY = (outputHeight * scaler - inputHeight) * 0.5;

  // create a canvas that will present the output image
  const outputCanvas = document.createElement('canvas');

  // set it to the same size as the image
  outputCanvas.width = outputWidth * scaler;
  outputCanvas.height = outputHeight * scaler;

  // draw our image at position 0, 0 on the canvas
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) { return; }
  ctx.drawImage(inputImage, outputX, outputY);
  var outputImage = new Image();
  outputImage.crossOrigin = "anonymous";
  outputImage.src = outputCanvas.toDataURL();
  return outputImage;
}

export default { resetCanvas, loadFont, crop, getBackgroundImageId }