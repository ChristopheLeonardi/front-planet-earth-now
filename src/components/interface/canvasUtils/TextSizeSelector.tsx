import { useEffect, useState } from 'react';
import utils from './Utils';
import { useSelected } from './../../../context/SelectedContext';

const TextSizeSelector = () => {
  const { textsSaved, selectedText, ctx, canvas, canvasRef, data, img, setSelected } = useSelected();
  
  const getCanvas = document.getElementById("flag-personnalisation")
  if (!getCanvas) { return }
  const canvasSize = getCanvas.getBoundingClientRect()
  const minSize = canvasSize.height * 0.05
  const maxSize = canvasSize.height * 0.90
  const initSize = canvasSize.height * 0.20
  const [tailleSelect, setTailleSelect] = useState(initSize);

  const initSizeValue = () => {
    let selected = textsSaved.filter(t => { return t.is_selected === true })[0]
    let size = selected.size
    return size
  }

  useEffect(() => {
    if(selectedText >= 0 ){
      setTailleSelect(initSizeValue())  
    }    
  }, [selectedText])

  const handleChangeTailleSelect = (value: number) => {

    setTailleSelect(value);

    // Create a new array with the updated text size
    const updatedTexts = textsSaved.map((text) => {
      if (!ctx) {return text}
      if (text.is_selected) {
        return {
          ...text,
          x: text.x ,
          size: value,
          height:value,
        };
      }
      return text;
    }); 

    // Update the context state with the updated texts
    setSelected((prevState) => ({
      ...prevState,
      textsSaved: updatedTexts,
    }));

    redrawCanvas(); // Redraw the canvas
  };

  const redrawCanvas = () => {
    utils.resetCanvas(canvasRef);
    if(!ctx || !img || !canvas) { return }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Redraw all texts
    if (!ctx) { return }
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    textsSaved.forEach((t: any) => {
      ctx.font = `${t.size.toString()}px ${data.fontFamily}`;
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
    });
  };

  return (
    <fieldset>
      <legend>Taille Selection</legend>
      <input
        type="range"
        id="taille"
        name="taille"
        min={minSize}
        max={maxSize}
        value={tailleSelect}
        onChange={(e) => handleChangeTailleSelect(Number(e.target.value))}
      />
    </fieldset> 
  );
};

export default TextSizeSelector;
