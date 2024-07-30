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

const crop = (inputImage: any, scalerValue: number) => {

  if (!scalerValue) { scalerValue = 1 }

  const minSizeValue = 1168

  // Store the width and height of the image
  const inputWidth = inputImage.naturalWidth;
  const inputHeight = inputImage.naturalHeight;

  // Set initial image size in proportion of flag
  const outputHeight = inputWidth <= inputHeight ? minSizeValue : minSizeValue * inputHeight / inputWidth
  const outputWidth = inputWidth <= inputHeight ? minSizeValue * inputWidth / inputHeight : minSizeValue
  // Create a canvas that will present the output image
  const outputCanvas = document.createElement('canvas');

  // Set it to the scaled size of the image
  outputCanvas.width = outputWidth * scalerValue;
  outputCanvas.height = outputHeight * scalerValue;

  // Draw the image at the calculated position on the canvas
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) { return }
  ctx.drawImage(inputImage, 0, 0, outputCanvas.width, outputCanvas.height);
  
  const outputImage = new Image();
  outputImage.crossOrigin = "anonymous";
  outputImage.src = outputCanvas.toDataURL();
  return outputImage;
}
  
export default { resetCanvas, loadFont, crop, getBackgroundImageId }