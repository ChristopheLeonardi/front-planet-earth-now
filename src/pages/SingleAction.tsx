import {useState, useEffect} from 'react';
import pageServices from '../services/pages'
import utils from '../services/utils';
import { useLang } from '../context/LangContext';
import FlagPersonnalisation from '../components/interface/PersonnalisationFlag'; 
import Diaporama from '../components/interface/Diaporama';
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
}

interface Action {
    id: number;
    attributes: Content;
}

const SingleAction = (type:string ) => {
    const lang = useLang();
    const [action, setAction] = useState<Action  | null>(null);
    const [id, setId] = useState<number | null>(null)


    useEffect(() => {
        const params = utils.getUrlParams(['id']);
        const initialId = params.id ? parseInt(params.id, 10) : null;
        setId(initialId);
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
                { action.attributes.template === "ef1" && (
                    <>
                      {console.log(action)}
                        <FlagPersonnalisation data={action.attributes.PersonnalisationForm}/>
                        {/* <Diaporama images={action.attributes.diaporama.data}/> */}
                    </>
                )}
                { action.attributes.template === "simple" && (
                    <>
                      <Diaporama images={action.attributes.diaporama.data}/>
                    </>
                )}

                </>
            )}
        </section>
    )
}

export default SingleAction