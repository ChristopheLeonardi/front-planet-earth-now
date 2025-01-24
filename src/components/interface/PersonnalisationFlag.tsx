import React, { useState, useEffect } from 'react';
import TitreH2 from './TitreH2';
import ImageComponent from './ImageComponent';
import Canvas from './Canvas';
import { RadioField, InputField, ImageField, UserConsent, Button } from './PersonalisationFormItem';
import TextSizeSelector from './canvasUtils/TextSizeSelector';
import { TextTailleGeneral, ZoomImage, ChangeFont } from './PersonalisationFormItem';
import { deselectAll } from './canvasUtils/DragText';
import { useSelected } from '../../context/SelectedContext';
import Utils from './canvasUtils/Utils';
import "./flagPersonnalisation.css";
import "./forms.css"
import pageServices from "../../services/pages"

const FlagPersonnalisation = ({ data, flagUseConsent }: any) => {
  const {textsSaved, canvas, ctx, img, setSelected} = useSelected()

  const [formData, setFormData] = useState({
    type: 'slogan',
    format: 'paysage',
    sloganInput: '',
    image: null as HTMLImageElement | null,
    imageInitSize: null as HTMLImageElement | null,
    perso: false,
    consent: false,
    taille: '10', // Exemple de type string pour la taille, ajustez selon vos besoins
    fontFamily: 'Open Sans',
    imagePosX: 0,
    imagePosY: 0,
    tailleImage: 1,
    size: {width:0, height:0, canvas: {width:0, height:0}},
    flagUseConsent: false, 
    typeId: "type",
    orientationId: "format",
    radioPlaneteId: "radioPlanete",
    SloganCanvasTitle: data.SloganCanvasTitle,
    PersoCanvasTitle: data.PersoCanvasTitle,
    SloganCanvasSubtitle: data.SloganCanvasSubtitle,
    PersoCanvasSubtitle: data.PersoCanvasSubtitle

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
              // Calculer les nouvelles dimensions pour l'image
              const maxWidth = window.innerWidth / 2;
              const maxHeight = window.innerHeight / 2;
            
              let newWidth = img.width;
              let newHeight = img.height;
            
              // Vérifier si l'image dépasse la largeur ou la hauteur maximale
              if (img.width > maxWidth) {
                newWidth = maxWidth;
                newHeight = (img.height * maxWidth) / img.width;
              }
            
              if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = (img.width * maxHeight) / img.height;
              }
            
              // Créer un canvas temporaire pour redimensionner l'image
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
            
              canvas.width = newWidth;
              canvas.height = newHeight;
              
              // Dessiner l'image redimensionnée dans le canvas
              ctx?.drawImage(img, 0, 0, newWidth, newHeight);
            
              // Extraire l'image redimensionnée du canvas
              const resizedImgSrc = canvas.toDataURL();
            
              // Créer une nouvelle image à partir de la source redimensionnée
              const resizedImg = new Image();
              resizedImg.src = resizedImgSrc;
              resizedImg.width = newWidth;
              resizedImg.height = newHeight;
            
              resizedImg.onload = () => {
            
                setFormData((prevData) => ({
                  ...prevData,
                  image: resizedImg,
                  imageInitSize: img // Conserver la taille originale si nécessaire
                }));
              };
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

  const downloadCanvas = (formData:any) => {
    var link = document.createElement('a');
    link.download = 'earth-flag-one.png';
    const exportCanvas = (formData.type === "logoIncrustation" && formData.image && formData.imageInitSize) ?
      Utils.expandPersoCanvasSize(formData) : 
      Utils.expandSloganCanvas(formData, textsSaved)

      if (!exportCanvas) { return }
      link.href = exportCanvas.toDataURL()
      link.click();
      return exportCanvas.toDataURL()

  }

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    const updateText = textsSaved.map(text => ({ ...text, is_selected: false }));
    setSelected((prevState) => ({
      ...prevState,
      textsSaved: updateText
    }));
    if (formData.type === "slogan") { deselectAll(textsSaved, canvas, ctx, img)} 
    const consent = document.getElementById("cgv") as HTMLInputElement | null
    if (consent){
      if (!consent.checked) {
        setMessage("Erreur, vous devez accepter les conditions d'utilisation")
        setTimeout(() => { setMessage("") }, 3000)
        return;
      }

      const exportCanvas = downloadCanvas(formData)
      const flagUseConsent = document.getElementById("flagUseConsent") as HTMLInputElement | null
      if (flagUseConsent){
        if (!flagUseConsent.checked) { return }
        
        pageServices.saveFlagOnServer(exportCanvas)
      }
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

  useEffect( () => {
    var input = document.getElementById("sloganInput") as HTMLInputElement
    if (!input) { return }

    const currentMaxLength = input.getAttribute("maxlength")
    var maxLength = formData.format === "portrait" ? 39 : 61
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

  const [title, setTitle] = useState(data.Heading.titre)
  useEffect(() => {
    setTitle(data.Heading.titre)
  }, [data])

  const [taille, setTaille] = useState(1);

  const [titleCanvas, setTitleCanvas] = useState({legend: data.SloganCanvasTitle, modeEmploi: data.SloganCanvasSubtitle})
  useEffect(() => {
    const legend = formData.type === "slogan" ? data.SloganCanvasTitle : data.PersoCanvasTitle
    const modeEmploi = formData.type === "slogan" ? data.SloganCanvasSubtitle : data.PersoCanvasSubtitle
    setTitleCanvas({"legend" : legend, "modeEmploi": modeEmploi})
  }, [formData, data ])

  return (
    <>
      {data && (
        <>
          <TitreH2 titre={title} sousTitre={data.Heading.sousTitre} />
          <div className='perso-container'>
            <form>
              <div className='col-2'>
                <div>
                  <RadioField   lang={data.lang} formData={formData} order="1" label={data.orientationTitre} options={data.orientationOption} handleChange={handleChange} id={formData.orientationId}/>
                  <RadioField   lang={data.lang} formData={formData} order="2" label={data.typeLabel} options={data.typeOption} handleChange={handleChange} id={formData.typeId}/>
                </div>
              </div>

              <div className='canvas-container'>
              {formData.type === "logoIncrustation" && (
                <ImageField legend={data.imageUploadTitle} order={3} label={data.uploadLabel} subLabel={data.uploadTexte} data={formData} handleChange={handleChange} />
              )}
              {formData.type === "slogan" && (
                <InputField order={3} label={data.sloganTitre} option={data.sloganInput} handleChange={handleChange}/>
              )}
            
                
            </div>

            </form>
            {imagesLoaded && <Canvas data={formData} dataTitle={titleCanvas} taille={taille} setTaille={setTaille} formData={formData} />}
            {formData.type === "logoIncrustation" && (
                <div className='radio-spe'>
                    <RadioField  
                      formData={formData}
                      order={""} 
                      label={data.TextChoixDuFond} 
                      options={data.radioPlanetelabels} 
                      handleChange={handleChange} 
                      id={formData.radioPlaneteId}/>
                </div>
              )}  
            {formData.type === "slogan" && formData.sloganInput !="" &&(
              <div className='position-ref'>
              <div className='slogan-controls'>
              <ChangeFont handleChange={handleChange}/>

              <div className='col-2'>
                <TextTailleGeneral handleChange={handleChange}/>
                <TextSizeSelector/>
              </div>
              </div>
              </div>
            )}
            {formData.type === "logoIncrustation" && formData.image &&(
              <ZoomImage handleChange={handleChange} taille={taille} setTaille={setTaille} /> 
            )}


          </div>
          <UserConsent data={data} option={data.CGV} handleChange={handleChange} />
          <UserConsent data={data} option={flagUseConsent} handleChange={handleChange} />
          <p>{message}</p>
          <Button data={data.submitButton} onClick={handleOnSubmit} buttonClass="primary-button" />
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
