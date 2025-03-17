import {useState, useEffect} from 'react';
import { useLang } from '../context/LangContext';
import pageServices from '../services/pages'
import ContactForm from '../components/interface/ContactForm';
import RichText from '../components/interface/RichText';
import TitreH2 from '../components/interface/TitreH2';
import "./content.css"
import "./Accueil.css"
import "./contact.css"


interface Content {
    Contact_form: any;
    Texte:any;
    titre:string;

}


const Contact = () => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        pageServices
            .getPageContent({"page": "contact", "lang": lang[0]})
            .then((res: Content) => { 
                console.log(res)
                const objRes = { 
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang]);
    
    return (
        <section className='page-content-container'>
            <section className='page-content'>
            { content && (
            <>
            {console.log(content)}
            <TitreH2 titre={content.titre} sousTitre=""/>
            <RichText data={content.Texte}/>
            <ContactForm 
                titre={content.Contact_form.heading.titre} 
                message={{
                "error": content.Contact_form.errorMessage,
                "success": content.Contact_form.successMessage,
                "missing": content.Contact_form.missingFieldMessage
                }}
                sousTitre={content.Contact_form.heading.sousTitre} 
                fields={content.Contact_form.formContent}
                object_option={content.Contact_form.object_option}
            />
            </>
            
            )}
            </section>
        </section>
    )
}

export default Contact