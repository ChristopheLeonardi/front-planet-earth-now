import React, { useState } from 'react';
import utils from './Utils';
const redrawCanvas = (select:any) => {
  utils.resetCanvas(select.canvasRef)
  utils.handleOrientation(select.ctx, select.img, select.data, select.canvas)
  // Redraw all texts
  select.ctx.strokeStyle = '#1a1a1a';
  select.ctx.lineWidth = 4;
  select.ctx.fillStyle = "white";
  select.ctx.textAlign = "center"

  select.texts.forEach((t:any) => {
    select.ctx.font = `${t.size.toString()}px ${select.data.fontFamily}`;
    select.ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
    select.ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
    select.ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
  });

};

const TextSizeSelector = () => {
  const [tailleSelect, setTailleSelect] = useState(10);

  const handleChangeTailleSelect = (value: number) => {
    console.log(window.selected);
    setTailleSelect(value);
    if (window.selected && window.selected.selectedText) {
      window.selected.texts[window.selected.selectedText].size = value * 10
      redrawCanvas(window.selected); // Redessine le canevas
    }
  };

  return (
    <fieldset>
      <legend>Taille Texte Sélectionné</legend>
      <input
        type="number"
        id="taille"
        name="taille"
        value={tailleSelect}
        onChange={(e) => handleChangeTailleSelect(Number(e.target.value))}
      />
    </fieldset>
  );
};

export default TextSizeSelector;
