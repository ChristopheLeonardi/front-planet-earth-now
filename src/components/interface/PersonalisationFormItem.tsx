import { useState, useEffect } from "react";

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

export const UserConsent = ({ option, handleChange }: any) => {
  return (
    <fieldset className="user-consent">
      <input
        type="checkbox"
        id={option.idAndName}
        name="consent"
        value="consent"
        onChange={handleChange}
      />
      <label htmlFor={option.idAndName}>{option.label}</label>
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

export const InputField = ({ label, option, handleChange }: any) => {
  return (
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

