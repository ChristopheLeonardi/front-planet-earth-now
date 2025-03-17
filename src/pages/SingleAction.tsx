import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import EnteteAccueil from '../components/EnteteAccueil';
import Diaporama from '../components/interface/Diaporama';
import utils from '../services/utils';
import "./content.css"
import "./Accueil.css"
import "./singleAction.css"

interface Content {
    

    titre:string;
    sousTitre:string;
    entete_image:any;
    citation:any;
    diaporama:any;
    content: any;
    vignettesSection:any;
    actionsVignettes:any;
    partenariats: any;
    background_color_principal:string;
    modules_media:Array<any>;
    CTA:any;

}
interface SingleActionProps {
    id: number;
  }


const ModulesImages = ({elt}:any) => {

    const isSingle = elt.media.data.length === 1 
    const isImage = elt.media.data[0].attributes.mime !== "" 
                    && !/^video\//.test(elt.media.data[0].attributes.mime)

    return (<>
        <article className='media-module page-content' style={{ backgroundColor: elt.background_color  ? elt.background_color : "#f4f4f4" }}>
            <RichText data={elt.body}/>
            {isSingle && isImage && (<ImageComponent imageContent={elt.media.data[0].attributes}/>)}
            {!isSingle && isImage && (<Diaporama images={elt.media.data} />)}
            {isSingle && !isImage && (
                <video                     
                controls 
                muted 
                autoPlay 
                loop 
                playsInline>
                    <source 
                        src={utils.setUrl(elt.media.data[0].attributes.url)} 
                        type={elt.media.data[0].attributes.mime} 
                    />
                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                </video>)}

        </article>
        
    </>)
}
const AvisExpert = ({avis}:any) => {
    console.log(avis)
    const backgroundColor = avis.background_color || 'var(--blue-pen)'
    return (
        <div className='single-avis'>
            <div className='texte'  style={{ backgroundColor: backgroundColor}}>
                <cite>{avis.citation}</cite>
                <div className='signature'>
                    <ImageComponent imageContent={avis.photo.data.attributes}/>

                    <div>
                        <p className='nom'>{avis.nom}</p> 
                        <p className='source'>{avis.source}</p> 
                    </div>
                </div>
            </div>


        </div>
    )
}
const SingleAction = ({id}:SingleActionProps) => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        pageServices
            .getPageContent({"page": "actions/" + id, "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang]);
    
    return (<>
        { content && (
            
        <section style={{ backgroundColor: content.background_color_principal  ? content.background_color_principal : "#f4f4f4" }}>
            
            <>{console.log(content)}</>
            <article className='page-content entete' >
            <EnteteAccueil heading={{titre:content.titre, sousTitre:content.sousTitre}} image={content.entete_image}/>
            </article>
            {content.modules_media && content.modules_media.map((elt:any, index:number) => {
                return (<>
                    <ModulesImages key={index} elt={elt}/>
                    {elt.Avis_expert && (
                        <article className='avis-container'>
                            {elt.Avis_expert.map((avis:any) => {
                                return <AvisExpert avis={avis}/>
                            })}
                        </article>
                    )}
                </>)
            })}   
            {content.CTA && (
                <div className='cta center'>
                <a 
                    className="primary-button"
                    href={content.CTA.link} 
                    target={content.CTA.Ouvrir_dans_une_nouvelle_fenetre ? "_blank" : ""}
                    title={content.CTA.attribut_title}
                >{content.CTA.texte}</a>
                </div>
            )}         
        </section>
        )}
    </>)
}

export default SingleAction