import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import Partenaires from '../components/interface/Partenaires';
import ContactForm from '../components/interface/ContactForm';
import Entete from '../components/interface/Entete';
import "./content.css"
import "./about.css"
interface Content {
    titre: string;
    sousTitre: string;
    body: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    entete: any;
    partenariats: any;
    contact:any;
    contactMessage:any;
    ef1_link:any;
}


const BodyContainer = ({imageContent, textContent}:any) => {
    return (
    <div className='spe-accueil'>
        {/* <Entete content={{titre :"Planet Earth Now"}}/> */}
        { imageContent &&(
            <ImageComponent imageContent={imageContent}/>
        )}
        <RichText data={textContent}/>
    </div>
    )
}



const About = () => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        pageServices
            .getPageContent({"page": "about", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = {
                    ...res,
                    contactMessage: {
                        "error": res.contact.errorMessage,
                        "missing": res.contact.missingFieldMessage,
                        "success": res.contact.successMessage
                    }
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang]);
    
    return (
        <section className='page-content about'>
        { content && (
        <>
            {console.log(content)}
            <h2 className='subTitle-temp'>
                {/* TODO : MAKE IT RIGHT */}
                <span className='blue'>{content.sousTitre.split(' ')[0]} 
                </span>    
                {/* TODO : MAKE IT RIGHT */}
                <span className='blue'> {content.sousTitre.split(' ')[1]}
                </span>    
                <span className='green'> {content.sousTitre.split(' ')[2]}
                </span>    
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
                {/* <a className="primary-button spe-accueil"href='https://planetearthnow.org/custom-flag' target='_blank'>Personnaliser le drapeau</a> */}
            </div>
            {/*      */}
{/*             <p className="center">Des idées de collaboration ? Contactez-nous !</p>
 */}
            <ContactForm 
                titre={content.contact.titre} 
                message={content.contactMessage}
                sousTitre={content.contact.sousTitre} 
                fields={content.contact.formContent}/>
        </>
        )}
        </section>
    )
}

export default About