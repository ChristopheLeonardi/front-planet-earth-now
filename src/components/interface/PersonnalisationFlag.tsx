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
    perso: false,
    consent: false,
  });
  const [message, setMessage] = useState("")


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      if (!validImageTypes.includes(file.type)) {
        setMessage("Erreur, seul les fichiers d'image (JPEG, PNG, GIF) sont acceptés.");
        setTimeout(() => { setMessage("") }, 3000);
        return;
      }
  
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
      setMessage("Erreur, vous devez accepter les conditions d'utilisation")
      setTimeout(() => { setMessage("") }, 3000)
      return;
    }
    downloadCanvas()
  };
  
  const downloadCanvas = () => {
    var link = document.createElement('a');
    link.download = 'earth-flag-one.png';
    const canvas = document.getElementById('flag-personnalisation')  as HTMLCanvasElement
    if(!canvas) { return }
    link.href = canvas.toDataURL()
    link.click();
  }

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
          <div className='perso-container'>
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
              <p>{message}</p>
            </form>
            {imagesLoaded && <Canvas data={formData}/>}
          </div>
          <div className="baseImage">
            <ImageComponent imageContent={data.baseEfoSlogan.data.attributes} id="baseEfoSlogan"/>
            <ImageComponent imageContent={data.baseEfoPerso.data.attributes} id="baseEfoPerso" />
          </div>
        </>
      )}
    </>
  );
};

export default FlagPersonnalisation;
