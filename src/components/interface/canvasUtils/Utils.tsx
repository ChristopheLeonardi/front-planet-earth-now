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
const handleOrientation = (ctx:any, img:any, data:any, canvas:any) => {
  if(data.orientation === "portrait" && data.typedepersonnalisation === "logoIncrustation"){
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var angleInRadians = 90 * Math.PI/180
    var width = img.width;
    var height = img.height;

    ctx.translate(x, y);
    ctx.rotate(angleInRadians);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.rotate(-angleInRadians);
    ctx.translate(-x, -y);
  }
  else{
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
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


export default { resetCanvas, handleOrientation, loadFont }