import pageServices from "../../../services/pages"

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

const getBackgroundImageId = (data:any) => {
  var idImg = "baseEfo"

  if ( data.radioplanete === "avecFond" 
    || data.type === "slogan"){
      idImg += 'Slogan'
  }
  else{
    idImg += 'Perso'
  }

  idImg +=  data.format === 'paysage' ? '' : 'Vertical'   

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

  const crop = (inputImage: any, scalerValue: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (!scalerValue || scalerValue <= 0) { scalerValue = 1 }
  
      const minSizeValue = window.innerWidth / 3;
      const inputWidth = inputImage.naturalWidth;
      const inputHeight = inputImage.naturalHeight;
  
      const outputHeight = inputWidth <= inputHeight ? minSizeValue : minSizeValue * inputHeight / inputWidth;
      const outputWidth = inputWidth <= inputHeight ? minSizeValue * inputWidth / inputHeight : minSizeValue;
  
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = Math.max(outputWidth * scalerValue, 1);  // Assurez-vous que la largeur n'est jamais inférieure à 1
      outputCanvas.height = Math.max(outputHeight * scalerValue, 1);  // Assurez-vous que la hauteur n'est jamais inférieure à 1
  
      const ctx = outputCanvas.getContext('2d');
      if (!ctx) return reject(new Error("Canvas context could not be created."));
  
      ctx.drawImage(inputImage, 0, 0, outputCanvas.width, outputCanvas.height);
  
      const outputImage = new Image();
      outputImage.crossOrigin = "anonymous";
      outputImage.src = outputCanvas.toDataURL();
      outputImage.width = outputCanvas.width
      outputImage.height = outputCanvas.height
      outputImage.onload = () => resolve(outputImage);
      outputImage.onerror = reject; // Rejette si une erreur se produit lors du chargement de l'image
    });
  };

  const calculateSize = (formData:any) => {
    const longEdge = 1718
    const shortEdge = 1168

    const fullCanvasSize =  formData.format === "paysage" ? 
      { width: longEdge, height: shortEdge } :
      { width: shortEdge, height: longEdge }

    const smallCanvasSize  = formData.size.canvas;

    const exportImageSize = {
      width: formData.size.width * fullCanvasSize.width / smallCanvasSize.width,
      height: formData.size.height * fullCanvasSize.height / smallCanvasSize.height
    }

    const exportRatioX = fullCanvasSize.width / smallCanvasSize.width
    const exportRatioY = fullCanvasSize.height / smallCanvasSize.height

    return {fullCanvasSize, smallCanvasSize, exportImageSize, exportRatioX, exportRatioY}
  }
  
  const getImg = (formData:any) => {
    const idImg = getBackgroundImageId(formData)
    const img = document.getElementById(idImg) as HTMLImageElement | null;
    if (!img) {
      console.error(`Image element with ID '${idImg}' not found.`);
      return;
    }
    img.crossOrigin = 'anonymous';
    return img
  }
  const expandPersoCanvasSize = (formData:any) => {

      const {fullCanvasSize,smallCanvasSize, exportImageSize} = calculateSize(formData)
      const exportPosition = {
        posX: formData.imagePosX * fullCanvasSize.width / smallCanvasSize.width,
        posY: formData.imagePosY * fullCanvasSize.height / smallCanvasSize.height
      }
      const img = getImg(formData)
      if (!img) { return }

      const exportCanvas = document.createElement("canvas")
      exportCanvas.width = fullCanvasSize.width
      exportCanvas.height = fullCanvasSize.height

      const ctx = exportCanvas.getContext("2d");
      if (ctx) {
        // Dessin de l'image sur le canevas avec les coordonnées et dimensions mises à l'échelle
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        console.log(formData)
        if (!formData.radioplanete || formData.radioPlanete === "sansFond"){
          ctx.drawImage(formData.imageInitSize, exportPosition.posX, exportPosition.posY, exportImageSize.width, exportImageSize.height);
          ctx.drawImage(img, 0, 0, fullCanvasSize.width, fullCanvasSize.height);
        }
        else {
          ctx.drawImage(img, 0, 0, fullCanvasSize.width, fullCanvasSize.height);
          ctx.drawImage(formData.imageInitSize, exportPosition.posX, exportPosition.posY, exportImageSize.width, exportImageSize.height);
        }
      }
      return exportCanvas
  }
  const expandSloganCanvas = (formData:any, textsSaved:any) => {

    const {fullCanvasSize, exportRatioX, exportRatioY} = calculateSize(formData)
    
    const img = getImg(formData)
    if (!img) { return }

    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = fullCanvasSize.width
    exportCanvas.height = fullCanvasSize.height

    const ctx = exportCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, fullCanvasSize.width, fullCanvasSize.height);


      textsSaved.map((line:any) => {

        const x = (line.x + line.lineWidth / 2) * exportRatioX
        const y = line.y * exportRatioY + line.height * exportRatioY

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 4;
        ctx.font = `${line.size * exportRatioX}px ${line.fontFamily}`;

        ctx.fillText(line.text, x, y);
        ctx.strokeText(line.text, x, y);
        ctx.fillText(line.text, x, y);

      })

    }
    return exportCanvas
  }

  
export default { resetCanvas, loadFont, crop, getBackgroundImageId, expandPersoCanvasSize, expandSloganCanvas }