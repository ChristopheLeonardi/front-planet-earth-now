import React, { useState, useEffect, Component } from 'react';
import FontPicker from 'font-picker-react';
import { useSelected } from '../../context/SelectedContext';

interface FontComponentState {
  activeFontFamily: string;
}
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


export const ImageField = ({ label, data, handleChange }: any) => {
  const [inputClass, setInputClass] = useState("")
  useEffect(() => {
    if (data.image){
      setInputClass("image-loaded")
    }
  }, [data])
  return (
    <fieldset className="upload-file">
      {data.image && (
        <div className="image-preview">
          <img src={data.image.src} alt="Uploaded Preview" />
        </div>
      )}
      <label htmlFor="image" className={inputClass}>{label}</label>
      <input
        type="file"
        id="image"
        name="image"
        onChange={handleChange}
        accept="image/*"
        className="inputfile"
      />
    </fieldset>
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
  console.log(textsSaved)
  const handleChangeTaille = (value:number) => {
    // Map over textsSaved and update each text object's size property
    const updatedTexts = textsSaved.map((text) => ({
      ...text,
      size: value * 10,
    }));

    // Update the context state with the updated texts
    setSelected({
      textsSaved: updatedTexts,
    });
    setTaille(value)
  }
  useEffect(() => {
    handleChange({ name: 'fontFamily', value: activeFontFamily });
  }, [activeFontFamily]);

  useEffect(() => {
    handleChange({ name: 'taille', value: taille.toString() });
  }, [taille]);


  return (
    <div>
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
            limit={20}
          />
        </fieldset>
        <fieldset>
          <legend>Taille Générale</legend>
          <input
            type="number"
            id="taille"
            name="taille"
            value={taille}
            onChange={(e) => handleChangeTaille(Number(e.target.value))}
          />
        </fieldset>

      </div>
    </div>
  );
};
/* 
export const InputField = ({ label, option, handleChange }: any) => {

  return (
    <div>
      <fieldset>
        <legend>{label}</legend>
        <input
          type="text"
          id={option.idAndName}
          name={option.idAndName}
          placeholder={option.label}
          onChange={handleChange}
          maxLength={80}
        />
      </fieldset>
      <div className="options">
      <fieldset>
        <legend>Police</legend>
        <div id="font-picker"></div>

      </fieldset>
      <fieldset>
        <legend>Taille</legend>
        <input
          type="number"
          id="taille"
          name="taille"
          value="16"
          onChange={handleChange}
        />
      </fieldset>
      <fieldset>
        <legend>Marge</legend>
        <input
          type="number"
          id="marge"
          name="marge"
          value="10"
          onChange={handleChange}
        />
      </fieldset>
      <FontComponent/>
      </div>
    </div>
  );
}; */

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
      <fieldset>
        <legend>{label}</legend>
        {options.map((option: { idAndName: any; label: any }) => {
          return (
            <div key={option.idAndName}>
              <input
                type="radio"
                id={option.idAndName}
                name={label.replace(/\s/gm, '').toLowerCase()}
                value={option.idAndName}
                onChange={handleChange}
             />
              <label htmlFor={option.idAndName}>{option.label}</label>
            </div>
          );
        })}
      </fieldset>
    );
  };

