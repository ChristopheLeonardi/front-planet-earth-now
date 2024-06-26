import utils from './Utils'

interface Line {
  height: number;
  width: number;
  text: string;
  x: number;
  y: number;
  size: number;
  fontFamily: string;
}

const loadFont = async (data: any) => {
  var css = `@import url('https://fonts.googleapis.com/css?family=${data.fontFamily.replace(' ', '+')}&subset=latin,latin-ext');`
  var head = document.head || document.getElementsByTagName('head')[0]
  var style = document.getElementById("loadFont") || document.createElement('style')
  style.setAttribute("id", "loadFont")
  head.appendChild(style);

  style.appendChild(document.createTextNode(css));
  await document.fonts.load(`${parseInt(data.taille)}px ${data.fontFamily}`);
}

const drawSlogan = async (ctx: any, img: any, data: any, canvas: any) => {
  utils.handleOrientation(ctx, img, data, canvas)

  await loadFont(data)

  // fontstyle
  const fontSize = parseInt(data.taille) * 10
  const fontFamily = data.fontFamily

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center"

  // fontstroke
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4;

  const text = data.sloganInput
  const lines = text.split('\n')

  var canvasLines: Array<Line> = []

  const lineX = canvas.width / 2
  lines.forEach((line: string, index: number) => {
    var heightDivision = canvas.height / (lines.length + 1)
    var lineY = heightDivision * (index + 1);
    const lineWidth = ctx.measureText(line).width;

    // Store line Object
    const lineObj: Line = {
      text: line,
      x: lineX - lineWidth / 2,  // Centered position
      y: lineY - fontSize,
      height: fontSize,
      width: lineWidth,
      size:fontSize, 
      fontFamily: fontFamily
    };
    canvasLines.push(lineObj)

    // Draw lines with strokes
    ctx.fillText(line, lineX, lineY);
    ctx.strokeText(line, lineX, lineY);
    ctx.fillText(line, lineX, lineY);
  })
  return canvasLines
}

const dragText = (canvasLines: Array<Line>, canvas: any, ctx: any, fontSize: number, img: any, data: any, canvasRef: any) => {
  if (!canvasLines.length || !canvas) { return }

  // variables to save last mouse position
  var startX: any;
  var startY: any;

  // some text objects

  var texts = canvasLines;

  // this var will hold the index of the selected text
  var selectedText = -1;

  const textHittest = (x: any, y: any, textIndex: any) => {
    var text = texts[textIndex];
    return (
      x >= text.x && x <= text.x + text.width &&
      y >= text.y && y <= text.y + text.height
    );
  }

  function getMousePos(e: any) {
    // Coordonnées et dimensions actuelles du canvas
    var canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    var canvasOffset = canvas.getBoundingClientRect();
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    // Coordonnées du clic par rapport au canvas (ajustées pour le redimensionnement CSS)
    var canvasMouseX = e.clientX - canvasOffset.left;
    var canvasMouseY = e.clientY - canvasOffset.top;

    // Coordonnées réelles du canvas (après redimensionnement CSS)
    var realCanvasWidth = canvas.offsetWidth;
    var realCanvasHeight = canvas.offsetHeight;

    // Ajustement des coordonnées du clic en fonction de la différence de taille
    var scaleX = canvasWidth / realCanvasWidth;
    var scaleY = canvasHeight / realCanvasHeight;

    canvasMouseX *= scaleX;
    canvasMouseY *= scaleY;

    return { x: canvasMouseX, y: canvasMouseY };
  }

  function getTouchPos(e: any) {
    var touch = e.touches[0];
    return getMousePos({ clientX: touch.clientX, clientY: touch.clientY });
  }

  function handleMouseDown(e: any) {
    e.preventDefault();
    var pos = getMousePos(e);

    // Test si le clic est sur l'un des textes
    for (var i = 0; i < texts.length; i++) {
      if (textHittest(pos.x, pos.y, i)) {
        selectedText = i;
        startX = pos.x - texts[i].x;
        startY = pos.y - texts[i].y;
        /* window["selected"] = {
          texts:texts,
          selectedText: selectedText, 
          ctx:ctx, canvas:canvas, 
          img:img,
          canvasRef:canvasRef,
          data:data,
        } */
        break; // Sortir de la boucle dès qu'un texte est sélectionné
      }
    }
  }

  function handleTouchStart(e: any) {
    e.preventDefault();
    var pos = getTouchPos(e);

    // Test si le clic est sur l'un des textes
    for (var i = 0; i < texts.length; i++) {
      if (textHittest(pos.x, pos.y, i)) {
        selectedText = i;
        startX = pos.x - texts[i].x;
        startY = pos.y - texts[i].y;
        break; // Sortir de la boucle dès qu'un texte est sélectionné
      }
    }
  }

  function handleMouseUp(e: any) {
    e.preventDefault();
    selectedText = -1;
  }

  function handleTouchEnd(e: any) {
    e.preventDefault();
    selectedText = -1;
  }

  function handleMouseOut(e: any) {
    e.preventDefault();
    selectedText = -1;
  }

  function handleMouseMove(e: any) {
    if (selectedText < 0) {
      return;
    }
    e.preventDefault();
    var pos = getMousePos(e);

    var text = texts[selectedText];
    text.x = pos.x - startX;
    text.y = pos.y - startY;

    // clear the canvas and draw all texts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    utils.handleOrientation(ctx, img, data, canvas)

    // Redraw all texts
    ctx.font = `${fontSize}px ${data.fontFamily}`;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.textAlign = "center"

    texts.forEach((t:any) => {
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
    });
  }

  function handleTouchMove(e: any) {
    if (selectedText < 0) {
      return;
    }
    e.preventDefault();
    var pos = getTouchPos(e);

    var text = texts[selectedText];
    text.x = pos.x - startX;
    text.y = pos.y - startY;

    // clear the canvas and draw all texts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    utils.handleOrientation(ctx, img, data, canvas)

    // Redraw all texts
    ctx.font = `${fontSize}px ${data.fontFamily}`;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.textAlign = "center"

    texts.forEach((t:any) => {
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
    });
  }

  // Remove previous event listeners to avoid duplicates
  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mousemove", handleMouseMove);
  canvas.removeEventListener("mouseup", handleMouseUp);
  canvas.removeEventListener("mouseout", handleMouseOut);
  canvas.removeEventListener("touchstart", handleTouchStart);
  canvas.removeEventListener("touchmove", handleTouchMove);
  canvas.removeEventListener("touchend", handleTouchEnd);

  // Add event listeners for mouse interactions
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mouseout", handleMouseOut);

  // Add event listeners for touch interactions
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchend", handleTouchEnd);
}

export default { drawSlogan, dragText }
