import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import utils from '../services/utils';
import { useLang } from '../context/LangContext';
import FlagPersonnalisation from '../components/interface/PersonnalisationFlag'; 
import EnteteAction from '../components/EnteteAction';
import "./content.css"

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
    template: string;
    PersonnalisationForm: any;
    flagUseConsent: any;
    SloganCanvasTitle: any;
    PersoCanvasTitle: any;
    SloganCanvasSubtitle: any;
    PersoCanvasSubtitle: any;
}

interface Action {
    id: number;
    attributes: Content;
}

const Drapeau = (type:any ) => {
  console.log(type)
    const lang = useLang();
    const [action, setAction] = useState<Action  | null>(null);
    const [id, setId] = useState<number | null>(null)


    useEffect(() => {
        const params = utils.getUrlParams(['id']);
        const initialId = params.id ? parseInt(params.id, 10) : null;
        setId(initialId);
        if(window.location.pathname === "/custom-flag"){
          setId(2)
        }
      }, []);
    
      useEffect(() => {
        if (id !== null && lang.length > 0) {
          pageServices
            .getLocaleId(id, lang[0])
            .then((resId: any) => {
              setId(resId);
            })
            .catch((error) => {
              console.error('Error fetching locale ID:', error);
            });
        }
      }, [id, lang]);
    
      useEffect(() => {
        if (id !== null) {
          pageServices
            .getActionById(id)
            .then((res: any) => {
              setAction(res);
            })
            .catch((error) => {
              console.error('Error fetching actions:', error);
            });
        }
      }, [id]);
    

    return (
        <section className='page-content'>
            {action && (
                <>
                {action.attributes.template === "ef1" && (
                    <>
                        <FlagPersonnalisation data={action.attributes.PersonnalisationForm} flagUseConsent={action.attributes.flagUseConsent}/>
                    </>
                )}
                {action.attributes.template === "simple" && (
                      <EnteteAction content={action.attributes}/>
                )}
                </>
            )}
        </section>
    )
}

export default Drapeau