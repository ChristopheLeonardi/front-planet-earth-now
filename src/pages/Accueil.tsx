import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import "./content.css"
import "./Accueil.css"
import EnteteAccueil from '../components/EnteteAccueil';
import CTA from '../components/interface/CTA';
interface Content {

    entete_image:any;
    citation:any;
    diaporama:any;
    content: any;
    content_2: any;
    vignettesSection:any;
    actionsVignettes:any;
    partenariats: any;
    CTA_entete : any;
    CTA_bas_de_page : any;
    titre:string;
    sousTitre:string;
    background_color:string;
    text_position:string;
    Bandeau_Texte_Photo:any;
    entete_color:any;
    entete_background_color:any;

}


const BandeauTextePhoto = ({entry}:any) => {
    return (
        <article className='page-content'  style={{ backgroundColor: entry.background_color  ? entry.background_color : "#ffffff" }}>
        <article className={`bandeau-texte-photo ${entry.Position}`}>
            <div className='textes'>
                <h2 style={{ color: entry.title_color  ? entry.title_color : "#1a1a1a" }}>{entry.titre}</h2>
                <p style={{ color: entry.paragraph_color  ? entry.paragraph_color : "#1a1a1a" }}
                >{entry.texte}</p>
                {entry.CTA && entry.CTA.link && (
                <CTA data={entry.CTA}/>
            )} 
            </div>
            <ImageComponent imageContent={entry.image.data.attributes}/>
        </article>
        </article>
    )
}
const Accueil = ({previewData=false}:any) => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        if (previewData){
            setContent(previewData)
            return
        } else {
            pageServices
            .getPageContent({"page": "accueil", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
        }
    }, [lang]);
    
    return (
        <section>
        { content && (
        <>
            <article className='page-content entete' >
                <EnteteAccueil 
                    heading={{titre: content.titre, sousTitre: content.sousTitre}} 
                    image={content.entete_image}
                    params={content.text_position}
                    CTA={content.CTA_entete }
                    design={{color: content.entete_color, background_color:content.entete_background_color}}
                />
            </article>
            <article className='page-content'>
                <RichText ck5_data={content.content_2}/>
            </article>
            {content.Bandeau_Texte_Photo && content.Bandeau_Texte_Photo.map( (bandeau: any, index: number) => {
                return (<BandeauTextePhoto key={index} entry={bandeau}/>)
            })}
            
            

           {content.CTA_bas_de_page && (
                <CTA data={content.CTA_bas_de_page}/>
            )}      
        </>
        )}
        </section>
    )
}

export default Accueil