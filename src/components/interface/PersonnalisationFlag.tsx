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
    taille: '10', // Exemple de type string pour la taille, ajustez selon vos besoins
    fontFamily: 'Open Sans',
  });
  const [message, setMessage] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string }
  ) => {
    if ('target' in e) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const { name, value, type } = target;
  
      if (type === 'file') {
        const inputTarget = target as HTMLInputElement;
        const files = inputTarget.files;
        if (files && files[0]) {
          const file = files[0];
          const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if(file.size > 1100000){
            setMessage("L'image ne doit pas dépasser 1Mo");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            return;
          }
          if (!validImageTypes.includes(file.type)) {
            setMessage("Erreur, seul les fichiers d'image (JPEG, PNG, GIF) sont acceptés.");
            setTimeout(() => {
              setMessage("");
            }, 3000);
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
        }
      }
      // Set Data form radio
      else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } 
    // Set Data Form values 
    else {
      setFormData((prevData) => ({
        ...prevData,
        [e.name]: e.value,
      }));
    }
  };
  
 /*  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLTextAreaElement>> | { name: string; value: string }
  ) => {
    if ('target' in e) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const { name, value, type } = target;
  
      if (type === 'file') {
        const inputTarget = target as HTMLInputElement;
        const files = inputTarget.files;
        if (files && files[0]) {
          const file = files[0];
          const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if(file.size > 1100000){
            setMessage("L'image ne doit pas dépasser 1Mo");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            return
          }
          if (!validImageTypes.includes(file.type)) {
            setMessage("Erreur, seul les fichiers d'image (JPEG, PNG, GIF) sont acceptés.");
            setTimeout(() => {
              setMessage("");
            }, 3000);
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
        }
      }
      // Set Data form radio
      else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } 
    // Set Data Form values 
    else {
      setFormData((prevData) => ({
        ...prevData,
        [e.name]: e.value,
      }));
    }
  };
 */
  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    const consent = document.getElementById("cgv") as HTMLInputElement | null
    if (consent){
      if (!consent.checked) {
        setMessage("Erreur, vous devez accepter les conditions d'utilisation")
        setTimeout(() => { setMessage("") }, 3000)
        return;
      }
      downloadCanvas()
    }
  };
  
  const downloadCanvas = () => {
    var link = document.createElement('a');
    link.download = 'earth-flag-one.png';
    const canvas = document.getElementById('flag-personnalisation') as HTMLCanvasElement
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

  useEffect( () => {
    var input = document.getElementById("sloganInput") as HTMLInputElement
    if (!input) { return }

    const currentMaxLength = input.getAttribute("maxlength")
    var maxLength = formData.orientation === "portrait" ? 39 : 61
    if (currentMaxLength != maxLength.toString()){
      setFormData((prevData) => ({
        ...prevData,
        sloganInput: formData.sloganInput.substring(0, maxLength)
      }));
      formData.sloganInput.substring(0, maxLength)
      input.value = formData.sloganInput.substring(0, maxLength)
    }
    input.setAttribute("maxlength", maxLength.toString())

  }, [formData])

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
                <>
                <InputField label={data.sloganTitre} option={data.sloganInput} handleChange={handleChange} />
                </>
              )}
              
              {formData.typedepersonnalisation === "logoIncrustation" && (
                <ImageField label={data.uploadLabel} subLabel={data.uploadTexte} data={formData} handleChange={handleChange} />
              )}

              <UserConsent data={data} handleChange={handleChange} />
              <Button data={data.submitButton} onClick={handleOnSubmit} buttonClass="primary-button" />
              {/* <Button data={data.createVerso} buttonClass="secondary-button"  onClick={handleOnAddVerso}/> */}
              <p>{message}</p>
            </form>
            {imagesLoaded && <Canvas data={formData}/>}
          </div>
          <div className="baseImage">
            <ImageComponent imageContent={data.baseEfoSlogan.data.attributes} id="baseEfoSlogan"/>
            <ImageComponent imageContent={data.baseEfoPerso.data.attributes} id="baseEfoPerso" />
            <ImageComponent imageContent={data.baseEfoSloganVertical.data.attributes} id="baseEfoSloganVertical" />
            <ImageComponent imageContent={data.baseEfoPersoVertical.data.attributes} id="baseEfoPersoVertical" />
          </div>
        </>
      )}
    </>
  );
};

export default FlagPersonnalisation;
