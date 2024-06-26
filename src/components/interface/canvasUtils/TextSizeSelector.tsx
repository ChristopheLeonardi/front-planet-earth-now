import React, { useState } from 'react';
import utils from './Utils';
import { useSelected } from './../../../context/SelectedContext';

const TextSizeSelector = () => {
  const { textsSaved, selectedText, ctx, canvas, canvasRef, data, img, setSelected } = useSelected();

  const [tailleSelect, setTailleSelect] = useState(10);

  const handleChangeTailleSelect = (value: number) => {
    setTailleSelect(value);

    console.log(textsSaved)
    // Create a new array with the updated text size
    const updatedTexts = textsSaved.map((text, index) => {
      if (text.is_selected) {
        return {
          ...text,
          size: value * 10
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
    utils.handleOrientation(ctx, img, data, canvas);

    // Redraw all texts
    if (!ctx) { return }
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    console.log(textsSaved)
    textsSaved.forEach((t: any) => {
      ctx.font = `${t.size.toString()}px ${data.fontFamily}`;
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.strokeText(t.text, t.x + t.width / 2, t.y + t.height);
      ctx.fillText(t.text, t.x + t.width / 2, t.y + t.height);
    });
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
