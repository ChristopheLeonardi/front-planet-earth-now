import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import "./content.css"
import "./Accueil.css"
import EnteteAccueil from '../components/EnteteAccueil';

interface Content {

    entete_image:any;
    citation:any;
    diaporama:any;
    content: any;
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

}


const BandeauTextePhoto = ({entry}:any) => {
    return (
        <article className='page-content'  style={{ backgroundColor: entry.background_color  ? entry.background_color : "#f4f4f4" }}>
        <article className={`bandeau-texte-photo ${entry.Position}`}>
            <div className='textes'>
                <h2>{entry.titre}</h2>
                <p>{entry.texte}</p>
                {entry.CTA && entry.CTA.link && (
                <div className='cta center'>
                <a 
                    className="primary-button"
                    href={entry.CTA.link} 
                    target={entry.CTA.Ouvrir_dans_une_nouvelle_fenetre ? "_blank" : ""}
                    title={entry.CTA.attribut_title}
                >{entry.CTA.texte}</a>
                </div>
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
                />
            </article>
            <article className='page-content'>
                <RichText data={content.content}/>
            </article>
            {content.Bandeau_Texte_Photo && content.Bandeau_Texte_Photo.map( (bandeau: any, index: number) => {
                return (<BandeauTextePhoto key={index} entry={bandeau}/>)
            })}
            
            

           {content.CTA_bas_de_page && (
                <section className='cta center'>
                <a 
                    className="primary-button"
                    href={content.CTA_bas_de_page.link} 
                    target={content.CTA_bas_de_page.Ouvrir_dans_une_nouvelle_fenetre ? "_blank" : ""}
                    title={content.CTA_bas_de_page.attribut_title}
                >{content.CTA_bas_de_page.texte}</a>
                </section>
            )}      
        </>
        )}
        </section>
    )
}

export default Accueil