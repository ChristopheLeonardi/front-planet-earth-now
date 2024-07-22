import React, { useState, useEffect } from 'react';
import FontPicker from 'font-picker-react';
import { useSelected } from '../../context/SelectedContext';

const fontFamilies = [
  "Playfair", "Merriweather", "Alegreya", "Roboto", "Oswald", "Bebas Neue",
  "Anton", "Acme", "Courgette", "Montserrat"
]

export const Button = ({ data, onClick, buttonClass }: any) => {
  return (
    <button
      type="button"
      className={buttonClass}
      id={data.buttonTitle}
      onClick={onClick}
    >
      {data.buttonLabel}
    </button>
  );
};

export const UserConsent = ({ data }: any) => {
  const option = data.CGV
  return (
    <fieldset className="user-consent">
      <input
        type="checkbox"
        id={option.idAndName}
        name="consent"
        value="consent"
       
      />
      <label htmlFor={option.idAndName}>{option.label}<a className="link" href={data.lienCGV} target="_blank">{data.titreLienCGV}</a></label>
    </fieldset>
  );
};

interface ImageFieldProps {
  label: string;
  subLabel: string;
  data: any;
  handleChange: (e: any) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({ label, subLabel, data, handleChange }) => {
  const [inputClass, setInputClass] = useState("");
  useEffect(() => {
    if (data.image) {
      setInputClass("image-loaded");
    }
  }, [data]);

  return (
    <>
      <fieldset className="upload-file">
        {data.image && (
          <div className="image-preview">
            <img src={data.image.src} alt="Uploaded Preview" />
          </div>
        )}
        <label htmlFor="image" className={inputClass}>
          <p>{label}</p>
          <p className='subLabel'>{subLabel}</p>
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="inputfile"
        />
      </fieldset>
    </>
  );
};

export const ZoomImage = ({handleChange}:any) => {
  const [taille, setTaille] = useState(1);

  const handleChangeTaille = (e: any) => {
    const value = Number(e.target.value);
    setTaille(value);
    handleChange(e);
  };

  const incrementTaille = () => {
    const newTaille = Math.min(taille + 0.05, 2);
    setTaille(newTaille);
    handleChange({ target: { name: 'tailleImage', value: newTaille.toFixed(1) } });
  };

  const decrementTaille = () => {
    const newTaille = Math.max(taille - 0.05, 0.1);
    setTaille(newTaille);
    handleChange({ target: { name: 'tailleImage', value: newTaille.toFixed(1) } });
  };
  return (
    <fieldset className="zoom-control">
    <legend>Zoom de l'image</legend>
    <div>
      <button className="increment" type="button" onClick={incrementTaille}  disabled={taille === 2 ? true : false}>+</button>
      <button className="decrement" type="button" onClick={decrementTaille} disabled={taille === 0.1 ? true : false}>-</button>
      <input
        type="number"
        id="tailleImage"
        name="tailleImage"
        step={0.05}
        min={0.1}
        max={2}
        value={taille}
        onChange={handleChangeTaille}
      />
    </div>
  </fieldset>
  )
}

interface InputFieldProps {
  label: string;
  option: { idAndName: string };
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, option, handleChange }) => {
  return (
    <div className='slogan-options'>
      <fieldset>
        <legend>{label}</legend>
        <textarea
          id={option.idAndName}
          name={option.idAndName}
          placeholder="Touche entrée pour le saut de ligne"
          onChange={handleChange}
        ></textarea>
      </fieldset>
    </div>
  );
};

export const ChangeFont = ({handleChange}:any) => {
  const [activeFontFamily, setActiveFontFamily] = useState('Open Sans');

  useEffect(() => {
    handleChange({ name: 'fontFamily', value: activeFontFamily });
  }, [activeFontFamily]);
  return (
    <fieldset>
    <legend>Police</legend>
    <FontPicker
      apiKey="AIzaSyD2t9Jryr9LXXguyTG9SVS2W_gW8hIOCc0"
      activeFontFamily={activeFontFamily}
      onChange={(nextFont) => setActiveFontFamily(nextFont.family)}
      families={fontFamilies}
      variants={["regular", "700"]}
      limit={20}
    />
  </fieldset>
  )
}
export const TextTailleGeneral = ({handleChange}:any) => {

  const [taille, setTaille] = useState(10);
  const {textsSaved, setSelected } = useSelected();

  const handleChangeTaille = (value: number) => {
    // Map over textsSaved and update each text object's size property
    const updatedTexts = textsSaved.map((text) => ({
      ...text,
      size: value * 10,
    }));
    console.log(updatedTexts);
    // Update the context state with the updated texts
    setSelected((prevState) => ({
      ...prevState,
      textsSaved: updatedTexts,
    }));
    setTaille(value);
  };

  useEffect(() => {
    handleChange({ name: 'taille', value: taille.toString() });
  }, [taille]);

  return (
    <fieldset>
    <legend>Taille Générale</legend>
    <input
      type="range"
      id="taille"
      name="taille"
      value={taille}
      min={8}
      max={64}
      onChange={(e) => handleChangeTaille(Number(e.target.value))}
    />
  </fieldset>
  )
}

interface ToggleProps {
  label: string;
  options: { idAndName: string; label: string }[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, options, handleChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0].idAndName);

  useEffect(() => {
    const initialOption = options.find(option => option.idAndName === 'slogan' || option.idAndName === 'paysage');
    if (initialOption) {
      setSelectedOption(initialOption.idAndName);
    }
  }, [options]);

  const toggleState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    handleChange(event);
  };

  return (
    <fieldset className="switch-field">
      <legend>{label}</legend>
      {options.map(option => (
        <div key={option.idAndName} className='switch'>
          <input
            type="radio"
            id={option.idAndName}
            name={label.replace(/\s/gm, '').toLowerCase()}
            value={option.idAndName}
            onChange={toggleState}
            checked={selectedOption === option.idAndName}
          />
          <label htmlFor={option.idAndName}>{option.label}</label>
        </div>
      ))}
    </fieldset>
  );
};


export const RadioField = ({ label, options, handleChange }: any) => {
    const checkRadioElement = (id:string) => {
        const radioElement = document.getElementById(id) as HTMLInputElement | null;
        if (radioElement) {
          radioElement.checked = true;
        }
    }
    useEffect(() => {
        checkRadioElement('slogan')
        checkRadioElement('paysage')
    }, [])
    return (
      <Toggle label={label} options={options} handleChange={handleChange} />
    );
  };

