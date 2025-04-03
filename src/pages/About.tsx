import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import ImageComponent from '../components/interface/ImageComponent';
import { useLang } from '../context/LangContext';
import RichText from '../components/interface/RichText';
import TitreH2 from '../components/interface/TitreH2';
import BodySection from '../components/BodySection';
import Partenaires from '../components/interface/Partenaires';
import Entete from '../components/interface/Entete';
import EnteteAccueil from '../components/EnteteAccueil';
import CTA from '../components/interface/CTA';
import "./content.css"
import "./about.css"
import React from 'react';

interface Content {
    titre: string;
    sousTitre: string;
    Body_section: any;
    body: any;
    _icons_group: any;
    background_color: string;
    module_picto_collaborateur: string;
    partenariats: any;
    CTA: any;
    background_color_principal:string;
    Partenaires:any;
    End_section:any;
    entete_image:any;
    entete_color:any;
    entete_background_color:any;
    text_position:any;
    body_2:any;
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
    useEffect(() => {
        setTimeout(() => {
            let details = document.querySelectorAll("details");
            if (details.length > 0) {
                details[0].setAttribute("open", "open");
            }
        }, 100);
    }, []);
    
    
    return (<>
            { content && (
            <section>
                <article className='page-content entete' >
                    <EnteteAccueil 
                        heading={{titre: content.titre, sousTitre: content.sousTitre}} 
                        image={content.entete_image}
                        params={content.text_position}
                        design={{color: content.entete_color, background_color:content.entete_background_color}}
                        
                    />
                </article>
                {content.body[0].children[0].text != "" && (
                <section className='page-content'style={{ backgroundColor: content.background_color_principal  ? content.background_color_principal : "#ffffff" }}>
                    <article>
                        <RichText ck5_data={content.body_2}/>
                    </article>
                </section>
                )}


                {content.Body_section.length > 0 && content.Body_section.map((element:any, index:number) => {
                    return (<>
                        <BodySection key={element.id} data={element} index={index}/>
                    </>)
                })}
                
                <Partenaires partenariatData={content.Partenaires} />
                {content.End_section && (
                    <section className='page-content'style={{ backgroundColor: content.background_color  ? content.background_color : "#ffffff" }}>
                        <article>
                            {content.End_section.titre && (
                            <div>
                                <h2 style={{ color: content.End_section.title_color  ? content.End_section.title_color : "#1a1a1a"}}
                                    >{content.End_section.titre}</h2>
                            </div>
                            )}
                            {content.End_section.sousTitre && (
                            <div>
                                <h2 style={{ color: content.End_section.title_color  ? content.End_section.title_color : "#1a1a1a"}}
                                    >{content.End_section.sousTitre}</h2>
                            </div>
                            )}
                            {content.End_section.Body_section_2 && (<>
                            
                            <RichText ck5_data={content.End_section.Body_section_2} />
                            </>)}


                        </article>
                    </section>
                )}
                {content.CTA && (
                    <CTA data={content.CTA}/>
                )}


            </section>

            )}
    </>)
}

export default About