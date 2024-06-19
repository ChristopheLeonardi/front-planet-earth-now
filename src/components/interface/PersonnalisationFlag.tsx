import React, { useState, useEffect } from 'react';
import TitreH2 from './TitreH2';
import ImageComponent from './ImageComponent';
import Canvas from './Canvas';
import { RadioField, InputField, ImageField, UserConsent, Button } from './PersonalisationFormItem';

import "./flagPersonnalisation.css";
import "./forms.css"


const FlagPersonnalisation = ({ data }: any) => {
  const [formData, setFormData] = useState({
    typedepersonnalisation: 'slogan',
    orientation: 'paysage',
    sloganInput: '',
    image: null as HTMLImageElement | null,
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setFormData((prevData) => ({
            ...prevData,
            image: img,
          }));
        };
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleOnClick = (e: any) => {
    e.preventDefault();
    if (!formData.consent) {
/*       setMessage("error");
      console.log(message); */
      return;
    }
  };

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const images = document.querySelectorAll('.baseImage img');
    const loadImagePromises = Array.from(images).map((img) => {
      const imageElement = img as HTMLImageElement;
      return new Promise((resolve) => {
        if (imageElement.complete) {
          resolve(true);
        } else {
          imageElement.onload = () => resolve(true);
          imageElement.onerror = () => resolve(true);
        }
      });
    });

    Promise.all(loadImagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, [data]);

  return (
    <>
      {data && (
        <>
          <TitreH2 titre={data.Heading.titre} sousTitre={data.Heading.sousTitre} />
          <form>
            <RadioField label={data.typeLabel} options={data.typeOption} handleChange={handleChange} />
            <RadioField label={data.orientationTitre} options={data.orientationOption} handleChange={handleChange} />

            {formData.typedepersonnalisation === "slogan" && (
              <InputField label={data.sloganTitre} option={data.sloganInput} handleChange={handleChange} />
            )}

            {formData.typedepersonnalisation === "logoIncrustation" && (
              <ImageField label={data.uploadLabel} data={formData} handleChange={handleChange} />
            )}
            <UserConsent option={data.CGV} handleChange={handleChange} />
            <Button data={data.submitButton} onClick={handleOnClick} buttonClass="primary-button" />
            <Button data={data.createVerso} buttonClass="secondary-button" />
          </form>

          <div className="baseImage">
            {/* <ImageComponent imageContent={data.baseEfoSlogan.data.attributes} id="baseEfoSlogan" /> */}
            <img src="http://85.31.236.134:2222/uploads/large_efo_e808cba3e0.jpg"id="baseEfoSlogan" />
            <ImageComponent imageContent={data.baseEfoPerso.data.attributes} id="baseEfoPerso" />
          </div>

          {imagesLoaded && <Canvas data={formData} />}
        </>
      )}
    </>
  );
};

export default FlagPersonnalisation;
