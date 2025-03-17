import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import TitreH2 from '../components/interface/TitreH2';
import BodySection from '../components/BodySection';
import Partenaires from '../components/interface/Partenaires';
import Entete from '../components/interface/Entete';
import "./content.css"
import "./about.css"

interface Content {
    titre: string;
    sousTitre: string;
    Body_section: any;
    body: any;
    titre_icons_group: any;
    background_color: string;
    module_picto_collaborateur: string;
    partenariats: any;
    CTA: any;
    background_color_principal:string;
    Partenaires:any;
    End_section:any;
}


const About = ({previewData=false}:any) => {

    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);

    useEffect(() => {
        if (previewData){
            setContent(previewData)
            return
        } else {
        pageServices
            .getPageContent({"page": "about", "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = {
                    ...res
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
            }
    }, [lang]);
    
    return (<>
            { content && (
            <section>

                <section className='page-content'style={{ backgroundColor: content.background_color_principal  ? content.background_color_principal : "#f4f4f4" }}>
                    <article>
                        <TitreH2 titre={content.titre} sousTitre={content.sousTitre}/>
                        <RichText data={content.body}/>
                    </article>
                </section>

                {content.Body_section.length > 0 && content.Body_section.map((element:any, index:number) => {
                    return <BodySection key={index} data={element}/>
                })}
                
                <Partenaires partenariatData={content.Partenaires} />
                {content.End_section && (
                    <section className='page-content'style={{ backgroundColor: content.background_color  ? content.background_color : "#f4f4f4" }}>
                        <article>
                            {content.End_section.titre && (<TitreH2 titre={content.titre} sousTitre={content.sousTitre}/>)}
                            {content.End_section.Body_section && (<RichText data={content.End_section.Body_section}/>)}
                            
                        </article>
                    </section>
                )}
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

export default About