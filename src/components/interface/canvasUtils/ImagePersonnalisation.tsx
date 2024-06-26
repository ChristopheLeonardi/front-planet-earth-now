import utils from './Utils'

const crop = (inputImage: any, aspectRatio: number) => {
  // let's store the width and height of our image
  const inputWidth = inputImage.naturalWidth;
  const inputHeight = inputImage.naturalHeight;

  const scaler = 1;
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

const drawPersonnalisation = (ctx: any, img: any, data: any, canvas: any) => {
  if (data.image) {
    const outputImage = crop(data.image, 1);
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
    utils.handleOrientation(ctx, img, data, canvas)
    data.imagePosX = imagePosX;
    data.imagePosY = imagePosY;

  } else {
    // Si aucune image uploadée n'est présente, juste dessiner l'image de masque
    utils.handleOrientation(ctx, img, data, canvas)

  }
}

// Add functions to handle dragging of the image
const dragImage = (canvas: any, ctx: any, data: any, img: any) => {
  let startX: number, startY: number;
  let draggingImage = false;

  const getMousePos = (e: any) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isImageHit = (x: number, y: number) => {
    const img = data.image;
    if (!img) return false;
    const { imagePosX, imagePosY } = data;
    return (
      x >= imagePosX &&
      x <= imagePosX + img.width &&
      y >= imagePosY &&
      y <= imagePosY + img.height
    );
  };

  const handleMouseDown = (e: any) => {
    const pos = getMousePos(e);
    if (isImageHit(pos.x, pos.y)) {
      draggingImage = true;
      startX = pos.x - data.imagePosX;
      startY = pos.y - data.imagePosY;
    }
  };

  const handleMouseMove = (e: any) => {
    if (!draggingImage) return;
    const pos = getMousePos(e);
    data.imagePosX = pos.x - startX;
    data.imagePosY = pos.y - startY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPersonnalisation(ctx, img, data, canvas);
  };

  const handleMouseUp = () => {
    draggingImage = false;
  };

  // Remove previous event listeners to avoid duplicates
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseup", handleMouseUp);

  // Add event listeners for mouse interactions
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
}

// Usage example: call dragImage after drawing the image
export default (ctx: any, img: any, data: any, canvas: any) => {
  drawPersonnalisation(ctx, img, data, canvas);
  dragImage(canvas, ctx, data, img);
}
