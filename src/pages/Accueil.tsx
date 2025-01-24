import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import "./content.css"
import "./Accueil.css"
import ContactForm from '../components/interface/ContactForm';
import "./content.css"
import "./about.css"


interface Content {
    Heading:any;
    ImageEntete:any;
    citation:any;
    diaporama:any;
    content: any;
    vignettesSection:any;
    actionsVignettes:any;
    partenariats: any;
    titre: string;
    sousTitre: string;
    body: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    entete: any;
    contact:any;
    contactMessage:any;
    ef1_link:any;
}


const BodyContainer = ({imageContent, textContent}:any) => {
    return (
    <div className='spe-accueil'>
        { imageContent &&(
            <ImageComponent imageContent={imageContent}/>
        )}
        <RichText data={textContent}/>
    </div>
    )
}




const Accueil = () => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        pageServices
            .getPageContent({"page": "about", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang]);
    
    const chooseColor = (index:number) => {
      return index <= 1 ? "blue" : "green"
    }

    return (
        <section className='page-content accueil'>
        { content && (<>

            <h2 className='subTitle-temp'>
                {content.sousTitre.split(' ').map((word, index) => {
                  return <span className={chooseColor(index)}>{word} </span>
                })}
   
            </h2>
            <BodyContainer textContent={content.body}/>
            <div className='button-2-col' id="bouton-flag">
                {content.ef1_link && (
                    <a 
                        className="primary-button spe-accueil"
                        href={content.ef1_link.link} 
                        target='_blank'
                        title={content.ef1_link.buttonTitle}
                    >{content.ef1_link.buttonLabel}</a>
                )}
            </div>
            {console.log(content)}
            {content.contact.heading[0] && <h3 className='h3-title'>{content.contact.heading[0].titre}</h3>}
            <ContactForm 
                titre={content.contact.titre} 
                message={content.contactMessage}
                sousTitre={content.contact.sousTitre} 
                fields={content.contact.formContent}/>
        </>)}
        </section>
    )
}

export default Accueil