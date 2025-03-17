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

interface Content {
    

    ImageEntete:any;
    citation:any;
    diaporama:any;
    content: any;
    vignettesSection:any;
    actions:any;
    partenariats: any;
    title: string;
    sousTitre: string;
    Body_section: any;
    body: any;
    titre_icons_group: any;
    background_color: string;
    module_picto_collaborateur: string;
    CTA: any;
    background_color_principal:string;
    titre_section_actions:string;
    Partenaires:any;
    End_section:any;
    bouton_see_more:any;

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
        { content && (
        <section>

            <section className='page-content'style={{ backgroundColor: content.background_color_principal  ? content.background_color_principal : "#f4f4f4" }}>
                <article>
                    <TitreH2 titre={content.title} sousTitre={content.sousTitre}/>
                    <RichText data={content.body}/>
                </article>
                <TitreH2 titre={content.titre_section_actions} sousTitre={content.sousTitre}/>
                <section className='vignette-container'>
                {content.actions && 
                    content.actions.data?.length > 0 && 
                    content.actions.data.map((entry: any) => (
                        <Vignette key={entry.id} entry={entry} />
                    ))
                }
                </section>
            </section>

            
           
            {content.CTA && (
                <section className='cta center'>
                <a 
                    className="primary-button"
                    href={content.CTA.link} 
                    target={content.CTA.Ouvrir_dans_une_nouvelle_fenetre ? "_blank" : ""}
                    title={content.CTA.attribut_title}
                >{content.CTA.texte}</a>
                </section>
            )}


        </section>

        )}
</>)
}

export default NosActions