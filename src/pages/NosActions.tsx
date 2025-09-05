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
import EnteteAccueil from '../components/EnteteAccueil';
import CTA from '../components/interface/CTA';
import SetMetaSEO from '../components/navigation/SetMetaSEO';

interface Content {
    

    ImageEntete:any;
    citation:any;
    diaporama:any;
    content: any;
    vignettesSection:any;
    actions:any;
    partenariats: any;
    titre: string;
    sousTitre: string;
    Body_section: any;
    body: any;
    body_2: any;
    titre_icons_group: any;
    background_color: string;
    module_picto_collaborateur: string;
    CTA: any;
    background_color_principal:string;
    titre_section_actions:string;
    Partenaires:any;
    End_section:any;
    bouton_see_more:any;
    entete_image:any;
    entete_color:any;
    entete_background_color:any;
    text_position:any;    
    SEO:any;

}


const NosActions = ({previewData=false}:any) => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        if (previewData){
            setContent(previewData)
            return
        } else {
        pageServices
            .getPageContent({"page": "nos-actions", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }
                objRes.actions.data.map( (action:any) => { action.attributes["bouton_see_more"] = res.bouton_see_more}),
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
        }
    }, [lang]);
    
    return (<>
        {content && content.SEO && (<SetMetaSEO params={{title:content.SEO.metaTitle, description:content.SEO.metaDescription}}/>)}

        { content && (
        <section>
            <article className='page-content entete' >
                <EnteteAccueil 
                    heading={{titre: content.titre, sousTitre: content.sousTitre}} 
                    image={content.entete_image}
                    params={content.text_position}
                    design={{color: content.entete_color, background_color:content.entete_background_color}}
                    /* CTA={content.CTA_entete } */
                />
            </article>
            <section className='page-content'style={{ backgroundColor: content.background_color_principal  ? content.background_color_principal : "#ffffff" }}>
                <article>
                    <RichText ck5_data={content.body_2}/>
                </article>
                <TitreH2 titre={content.titre_section_actions} sousTitre={content.sousTitre}/>
                <section className='vignette-container'>
                {content.actions && 
                    content.actions.data?.length > 0 && 
                    content.actions.data.map((entry: any) => (
                        <Vignette key={entry.id} entry={entry} cta={content.CTA}/>
                    ))
                }
                </section>
            </section>

            
           
            {content.CTA && (
                <CTA data={content.CTA}/>
            )}


        </section>

        )}
</>)
}

export default NosActions