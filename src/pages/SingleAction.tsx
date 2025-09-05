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
import CTA from '../components/interface/CTA';
import SetMetaSEO from '../components/navigation/SetMetaSEO';

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
    SEO:any;
    localizations:any;

}
interface SingleActionProps {
    id?: number;
  }


const ModulesImages = ({elt}:any) => {
    const isSingle = elt.media.data.length === 1 
    const isImage = elt.media.data[0].attributes.mime !== "" 
                    && !/^video\//.test(elt.media.data[0].attributes.mime)

    return (<>
        <article className='media-module page-content' style={{ backgroundColor: elt.background_color  ? elt.background_color : "#ffffff" }}>
            {isSingle && isImage && (<figure>
                <ImageComponent imageContent={elt.media.data[0].attributes}/>
                <>{console.log(elt.media.data)}</>
                <figcaption>{elt.media.data[0].attributes.caption}</figcaption>
            </figure>)}
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
    const backgroundColor = avis.background_color || 'var(--blue-pen)'
    return (
        <div className='single-avis'>
            <div className='texte'  style={{ backgroundColor: backgroundColor}}>
                <cite>{avis.citation}</cite>
                <div className='signature'>
                    {avis.photo.data && (<ImageComponent imageContent={avis.photo.data.attributes}/>)}

                    <div>
                        <p className='nom'>{avis.nom}</p> 
                        <p className='source'>{avis.source}</p> 
                    </div>
                </div>
            </div>


        </div>
    )
}
const SingleAction = ({ id, previewData = false }: SingleActionProps & { previewData?: any }) => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    function cleanTrailingEmptyParagraphs(html:string) {
        // Supprime uniquement les balises <p>&nbsp;</p> à la fin du HTML, y compris les multiples répétitions
        return html.replace(/(?:<p>(&nbsp;|\s|&#160;)*<\/p>\s*)+$/g, '');
    }

    useEffect(() => {
        if (previewData){
            setContent(previewData)
            return
        } else {

        pageServices
            .getPageContent({"page": "actions/" + id, "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }

                if (lang[0] == "fr"){
                    setContent(objRes) 
                }   
                else{
                    var idLocale = objRes.localizations.data.filter((locale:any) => { return lang[0] === locale.attributes.locale})[0].id
                    pageServices
                        .getPageContent({"page": "actions/" + idLocale, "lang": lang[0]})
                        .then((res: Content) => { 
                            const objRes = { 
                                ...res
                            }
                            setContent(objRes) 
                        })
                        .catch((error) => { console.error('Error fetching config:', error) });

                            }
            })
            .catch((error) => { console.error('Error fetching config:', error) });
        }
    }, [lang]);
    
    return (<>
            {content && content.SEO && (<SetMetaSEO params={{title:content.SEO.metaTitle, description:content.SEO.metaDescription}}/>)}

        { content && (
        <section style={{ backgroundColor: content.background_color_principal  ? content.background_color_principal : "#ffffff" }}>
            
            <article className='page-content entete' >
            <EnteteAccueil heading={{titre:content.titre, sousTitre:content.sousTitre}} image={content.entete_image}/>
            </article>
            {content.modules_media && content.modules_media.map((elt:any, index:number) => {
                return (<div key={index}>
                    {elt.body && ( 
                        <article className='media-module page-content' style={{ backgroundColor: elt.background_color  ? elt.background_color : "#ffffff" }}>
                        <div style={{color: elt.paragraph_color || "#000"}}>
                            <RichText ck5_data={cleanTrailingEmptyParagraphs(elt.body_2)}/>
                        </div>
                        </article>)}
                    
                    {elt.media.data &&( <ModulesImages elt={elt}/>)}
                    {elt.Avis_expert && elt.Avis_expert.length != 0 && (
                        <article className='avis-container'>
                            {elt.Avis_expert.map((avis: any, avisIndex: number) => {
                                return <AvisExpert key={avisIndex} avis={avis} />
                            })}
                        </article>
                    )}
                </div>)
            })}   
            {content.CTA && (
                <CTA data={content.CTA}/>
            )}         
        </section>
        )}
    </>)
}

export default SingleAction