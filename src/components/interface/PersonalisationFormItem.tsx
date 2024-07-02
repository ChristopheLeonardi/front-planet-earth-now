import React, { useState, useEffect, Component } from 'react';
import FontPicker from 'font-picker-react';
import { useSelected } from '../../context/SelectedContext';
import TextSizeSelector from './canvasUtils/TextSizeSelector';

interface FontComponentState {
  activeFontFamily: string;
}
const fontFamilies = [
  "Playfair", "Merriweather", "Alegreya", "Roboto", "Oswald", "Bebas Neue",
  "Anton", "Acme", "Courgette", "Montserrat"
]

export default class FontComponent extends Component<{}, FontComponentState> {
    constructor(props:any) {
        super(props);
        this.state = {
            activeFontFamily: "Open Sans",
        };
    }
    render() {
        return (
            <div>
                <FontPicker
                    apiKey="AIzaSyD2t9Jryr9LXXguyTG9SVS2W_gW8hIOCc0"
                    activeFontFamily={this.state.activeFontFamily}
                    families={fontFamilies}
                    
                    onChange={(nextFont) =>
                        this.setState({
                            activeFontFamily: nextFont.family,
                        })
                    }
                />
                <p className="apply-font">The font will be applied to this text.</p>
            </div>
        );
    }
}
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

export const UserConsent = ({ data, handleChange }: any) => {
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

/* 
export const ImageField = ({ label, subLabel, data, handleChange }: any) => {
  const [inputClass, setInputClass] = useState("")
  const [taille, setTaille] = useState(1);

  const handleChangeTaille = (e:any) => {
    // Map over textsSaved and update each text object's size property
    const value = Number(e.target.value)
    setTaille(value)
    handleChange(e)
  };
  useEffect(() => {
    if (data.image){
      setInputClass("image-loaded")
    }
  }, [data])
  return (
    <>
      <fieldset className="upload-file">
        {data.image && (
          <div className="image-preview">
            <img src={data.image.src} alt="Uploaded Preview" />
          </div>
        )}
        <label htmlFor="image" className={inputClass}><p>{label}</p><p>{subLabel}</p></label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="inputfile"
        />
      </fieldset>
      <fieldset>
        <legend>Zoom de l'image</legend>
        <input
          type="number"
          id="tailleImage"
          name="tailleImage"
          step={0.1}
          min={0.1}
          max={2}
          value={taille}
          onChange={(e) => handleChangeTaille(e)}
        />
      </fieldset>
    </>
  );
}; */

interface ImageFieldProps {
  label: string;
  subLabel: string;
  data: any;
  handleChange: (e: any) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({ label, subLabel, data, handleChange }) => {
  const [inputClass, setInputClass] = useState("");
  const [taille, setTaille] = useState(1);

  const handleChangeTaille = (e: any) => {
    const value = Number(e.target.value);
    setTaille(value);
    handleChange(e);
  };

  const incrementTaille = () => {
    const newTaille = Math.min(taille + 0.1, 2);
    setTaille(newTaille);
    handleChange({ target: { name: 'tailleImage', value: newTaille.toFixed(1) } });
  };

  const decrementTaille = () => {
    const newTaille = Math.max(taille - 0.1, 0.1);
    setTaille(newTaille);
    handleChange({ target: { name: 'tailleImage', value: newTaille.toFixed(1) } });
  };

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
          <p>{subLabel}</p>
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
      <fieldset className="zoom-control">
        <legend>Zoom de l'image</legend>
        <div>
          <button className="increment" type="button" onClick={decrementTaille} disabled={taille === 0.1 ? true : false}>+</button>
          <button className="decrement" type="button" onClick={incrementTaille}  disabled={taille === 2 ? true : false}>-</button>
          <input
            type="number"
            id="tailleImage"
            name="tailleImage"
            step={0.1}
            min={0.1}
            max={2}
            value={taille}
            onChange={handleChangeTaille}
          />
        </div>
      </fieldset>
    </>
  );
};
interface Option {
  idAndName: string;
  label: string;
}

interface InputFieldProps {
  label: string;
  option: Option;
  handleChange: (event: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, option, handleChange }) => {
  const [activeFontFamily, setActiveFontFamily] = useState('Open Sans');
  const [taille, setTaille] = useState(10);
  const {textsSaved, setSelected } = useSelected()
  const handleChangeTaille = (value:number) => {
    // Map over textsSaved and update each text object's size property
    const updatedTexts = textsSaved.map((text) => ({
      ...text,
      size: value * 10,
    }));
    console.log(updatedTexts)
    // Update the context state with the updated texts
    setSelected((prevState) => ({
      ...prevState,
      textsSaved: updatedTexts,
    }));
    setTaille(value)
  }
  useEffect(() => {
    handleChange({ name: 'fontFamily', value: activeFontFamily });
  }, [activeFontFamily]);

  useEffect(() => {
    handleChange({ name: 'taille', value: taille.toString() });
  }, [taille]);


  return (
    <div className='slogan-options'>
      <fieldset>
        <legend>{label}</legend>
        <textarea
          id={option.idAndName}
          name={option.idAndName}
          placeholder="Entrez votre texte (touche entrée pour le saut de ligne)"
          onChange={handleChange}
        ></textarea>
      </fieldset>
      <div className="options">
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
        <fieldset>
          <legend>Taille Générale</legend>
          <input
            type="range"
            id="taille"
            name="taille"
            value={taille}
            onChange={(e) => handleChangeTaille(Number(e.target.value))}
          />
        </fieldset>
        <TextSizeSelector/>

      </div>
    </div>
  );
};

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

