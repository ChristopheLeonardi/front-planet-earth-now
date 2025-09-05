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

export const UserConsent = ({ data, option }: any) => {
  console.log(data)
  return (
    <fieldset className="user-consent">
      <input
        type="checkbox"
        id={option.idAndName}
        name="consent"
        value="consent"
       
      />
      <label className="consent-label" htmlFor={option.idAndName}>{option.label}*</label>
    </fieldset>
  );
};

interface ImageFieldProps {
  label: string;
  subLabel: string;
  data: any;
  handleChange: (e: any) => void;
  order:any;
  legend:string;
}

export const ImageField: React.FC<ImageFieldProps> = ({ label, subLabel, data, handleChange, order, legend }) => {
  const [inputClass, setInputClass] = useState("");
  useEffect(() => {
    if (data.image) {
      setInputClass("image-loaded");
    }
  }, [data]);

  return (
    <div className='slogan-options'>
      <fieldset className="upload-file switch-field slogan">
      <legend className='number-title'>{order} <br/>{legend}</legend>

        {data.image && (
          <div className="image-preview">
            <img src={data.image.src} alt="Uploaded Preview" />
          </div>
        )}
        <label htmlFor="image" className={inputClass}>
          <span>{label}</span><br/>
          <span className='subLabel'>{subLabel}</span>
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
    </div>
  );
};

export const ZoomImage = ({handleChange, taille, setTaille }:any) => {

  const minZoom = 0.1
  const maxZoom = 6
  const increment = 0.05
  

  const handleChangeTaille = (e: any) => {
    let value = Number(e.target.value);
    value = Math.max(minZoom, Math.min(maxZoom, value));
    setTaille(value);
  };

  const incrementTaille = () => {
    const newTaille = Math.min(taille + increment, maxZoom);
    setTaille(newTaille);
  };

  const decrementTaille = () => {
    const newTaille = Math.max(taille - increment, minZoom);
    setTaille(newTaille);
  };
  useEffect(() => {
    handleChange({ target: { name: 'tailleImage', value: taille } });
  }, [taille])
  return (
    <fieldset className="zoom-control">
    <legend>Zoom</legend>
    <div>
      
        
      <button className="decrement" type="button" onClick={decrementTaille} disabled={taille === minZoom ? true : false}>-</button> 
     
      <input
        type="range"
        id="tailleImage"
        name="tailleImage"
        step={increment}
        min={minZoom}
        max={maxZoom}
        value={taille}
        onChange={handleChangeTaille}
      />
      <button className="increment" type="button" onClick={incrementTaille}  disabled={taille === maxZoom ? true : false}>+</button>
    </div>
  </fieldset>
  )
}

interface InputFieldProps {
  label: string;
  option: {
    placeholder: string | undefined; idAndName: string 
};
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }) => void;
  order:any;
}

export const InputField: React.FC<InputFieldProps> = ({ label, option, handleChange, order}) => {
  return (
    <div className='slogan-options'>
      <fieldset className='switch-field slogan'>
        <legend>{order} <br/>{label}</legend>
        <textarea
          id={option.idAndName}
          name={option.idAndName}
          placeholder={option.placeholder}
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

  const canvas = document.getElementById("flag-personnalisation")
  if (!canvas) { return }
  const canvasSize = canvas.getBoundingClientRect()
  const minSize = canvasSize.height * 0.05
  const maxSize = canvasSize.height * 0.90
  const initSize = canvasSize.height * 0.20

  const [taille, setTaille] = useState(initSize);
  const {textsSaved, setSelected } = useSelected();

  const handleChangeTaille = (value: number) => {
    // Map over textsSaved and update each text object's size property
    const updatedTexts = textsSaved.map((text) => ({
      ...text,
      size: value,
    }));
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
      min={minSize}
      max={maxSize}
      onChange={(e) => handleChangeTaille(Number(e.target.value))}
    />
  </fieldset>
  )
}

interface ToggleProps {
  label: string;
  options: { idAndName: string; label: string }[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order:any;
  id:string;
  lang:string;
}

const Toggle: React.FC<ToggleProps> = ({ label, options, handleChange, order, id, lang }) => {
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
      <legend>{order}<br/>{label}</legend>
      {options.map(option => (
        <div key={option.idAndName} className={`switch ${option.idAndName}`}>
          <input
            type="radio"
            id={option.idAndName}
            name={id.replace(/\s/gm, '').toLowerCase()}
            value={option.idAndName}
            onChange={toggleState}
            checked={selectedOption === option.idAndName}
          />
          <label htmlFor={option.idAndName} className={lang}>{option.label} </label>
        </div>
      ))}
    </fieldset>
  );
};


export const RadioField = ({ label, options, handleChange, order, formData, id, lang }: any) => {
    const checkRadioElement = (id:string) => {
        const radioElement = document.getElementById(id) as HTMLInputElement | null;

        
        if(radioElement){
         radioElement.checked = true;
         radioElement.click();
        }
    }
    useEffect(() => {
        checkRadioElement(formData.format)
        checkRadioElement(formData.type)
        checkRadioElement(formData.utilisationdudrapeauaveclaplanète)
    }, [])
    return (
        <Toggle order={order} label={label} options={options} handleChange={handleChange} id={id} lang={lang}/>
    );
  };

