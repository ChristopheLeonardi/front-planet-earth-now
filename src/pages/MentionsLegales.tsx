import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import Partenaires from '../components/interface/Partenaires';
import Entete from '../components/interface/Entete';
import Citation from '../components/interface/Citation';
import Diaporama from '../components/interface/Diaporama';
import TitreH2 from '../components/interface/TitreH2';
import Vignette from '../components/interface/Vignette';
import BodySection from '../components/BodySection';
import "./content.css"
import "./Accueil.css"
import SetMetaSEO from '../components/navigation/SetMetaSEO';

interface Content {
    
    Texte:any;
    SEO:any;

}


const MentionsLegales = ({previewData=false}:any) => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        if (previewData){
            setContent(previewData)
            return
        } else {
        pageServices
            .getPageContent({"page": "mention-legale", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
        }
    }, [lang]);
    
    return (<>
        {content && content.SEO && (<SetMetaSEO params={{title:content.SEO.metaTitle, description:content.SEO.metaDescription}}/>)}

        { content && (
            <section className='page-content'>
                    <RichText ck5_data={content.Texte}/>
            </section>
        )}
</>)
}

export default MentionsLegales