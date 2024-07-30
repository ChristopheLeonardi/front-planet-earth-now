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
import "./content.css"
import "./Accueil.css"

interface Content {
    /* titre: string;
    sousTitre: string;
    
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    entete: any;
    
    contact:any;
    contactMessage:any; */

    Heading:any;
    ImageEntete:any;
    citation:any;
    diaporama:any;
    content: any;
    vignettesSection:any;
    actionsVignettes:any;
    partenariats: any;

}

const EnteteAccueil = ({heading, image}:any) => {
    return (
        <section className='entete'>
            <Entete content={heading}/>
            <ImageComponent imageContent={image.data.attributes}/>
        </section>
    )
}

const BodyContainer = ({textContent}:any) => {
    return (
    <div className='body-container col-2'>
        <RichText data={textContent}/>
    </div>
    )
}

const VignettesSection = ({content}:any) => {
    return (
        <section className='vignette-section'>
            <TitreH2 titre={content.titre.titre} sousTitre={content.titre.sousTitre}/>
            <div className="vignette-container">
            {content.vignettes.map((vignette:any, index:number) => {
                return (
                    <Vignette key={index} entry={vignette} domaine={false}/>
                )
            })}
            </div>
        </section>
    )
}

const VignettesAction = ({content}:any) => {
    return (
        <section>
            <TitreH2 titre={ content.titre.titre} sousTitre={ content.titre.sousTitre}/>
            <div className='vignette-container'>
                {content.single_actions.data.map((entry:any, index:number) => {
                    console.log(entry)
                    return ( <Vignette key={index} entry={entry} domaine={false}/> )
                })}
            </div>
        </section>
    )
}
const Accueil = () => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        pageServices
            .getPageContent({"page": "accueil", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = { 
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang]);
    
    return (
        <section className='page-content accueil'>
        { content && (
        <>
            <EnteteAccueil heading={content.Heading} image={content.ImageEntete}/>

            {content.citation && (<Citation content={content.citation}/>)}

            {content.diaporama && (<Diaporama images={content.diaporama.data}/>)}

            <BodyContainer textContent={content.content}/>

            {content.vignettesSection && 
                content.vignettesSection.map((section:any, index:number) => {
                    return ( <VignettesSection key={index} content={section}/> )
                })
            }
            
            {content.actionsVignettes && 
                content.actionsVignettes.single_actions.data.length > 0 && (
                    <VignettesAction content={content.actionsVignettes}/>
            )}
            
            <Partenaires partenariatData={content.partenariats} />
        </>
        )}
        </section>
    )
}

export default Accueil