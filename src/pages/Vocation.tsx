import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import { useLang } from '../context/LangContext';
import Image from '../components/interface/Image';
import Entete from '../components/interface/Entete';
import RichText from '../components/interface/RichText';
import Slideshow from '../components/interface/Slideshow';
import Vignette from '../components/interface/Vignette';
import TitreH2 from '../components/interface/TitreH2';

import './content.css'

interface Content {
    titre: string;
    sousTitre: string;
    body: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    entete: any;
    partenariats: any;
    contact:any;
    contactMessage:any;
    icone: any;
    presentation:any;
    diaporama: any;
    lesActions: any;
}

const Vocation = ({type}:any) => {
    const lang = useLang();
    const [content, setContent] = useState<Content | null>(null);
    useEffect(() => {
        pageServices
            .getPageContent({"page": type, "lang": lang[0]})
            .then((res: Content) => { 
                const objRes = {
                    ...res,
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang, type]);

    const [action, setAction] = useState<any[] | null>(null);
    useEffect(() => {
        pageServices
            .getActionByDomaine({"domaine": type, "lang":lang[0]})
            .then((res: any) => {
                setAction(res)
            })
            .catch((error) => { console.error('Error fetching actions:', error)})
    }, [lang, type])

    return (
        <section className='page-content'>
            { content && (
                <>
                    <section className='header-with-icon'>
                        <Image imageContent={content.icone.data.attributes}/>
                        <Entete content={content}/>
                    </section>
                    <div className='body-container col-1'>
                        <Image imageContent={content.entete.data.attributes}/>
                        <RichText data={content.presentation}/>
                    </div>
                    <Slideshow data={content.diaporama.data}/>
                    <div className='action-container'>
                    { action && (
                        <>
                            <TitreH2 titre={content.lesActions.titre} sousTitre={content.lesActions.sousTitre}/>
                            <div className='vignette-container'>
                                {action.map((entry, index) => {
                                    return ( <Vignette key={index} data={entry.attributes} domaine={false}/> )
                                })}
                            </div>
                        </>
                    )}
                    </div>
                </>
            )}

        </section>
    )
}

export default Vocation