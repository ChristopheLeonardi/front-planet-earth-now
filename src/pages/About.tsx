import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import Image from '../components/interface/Image';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import Partenaires from '../components/interface/Partenaires';
import ContactForm from '../components/interface/ContactForm';
import Entete from '../components/interface/Entete';
import "./content.css"

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
    contactMessage:any
}


const BodyContainer = ({imageContent, textContent}:any) => {
    return (
    <div className='body-container col-2'>
        <Image imageContent={imageContent}/>
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
        <section className='page-content'>
        { content && (
        <>
            <Entete content={content}/>
            <BodyContainer imageContent={content.entete.data.attributes} textContent={content.body}/>
            <Partenaires partenariatData={content.partenariats} />
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