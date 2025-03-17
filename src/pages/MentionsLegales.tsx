/* import {useState, useEffect} from 'react';
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
import "./Accueil.css" */

/* interface Content {
    

    Heading:any;
    ImageEntete:any;
    citation:any;
    diaporama:any;
    content: any;
    vignettesSection:any;
    actionsVignettes:any;
    partenariats: any;

} */


    const NosActions = () => {

      /* const lang = useLang();
      const [content, setContent] = useState<Content | null>(null);
  
      useEffect(() => {
          pageServices
              .getPageContent({"page": "nos-actions", "lang": lang[0]})
              .then((res: Content) => { 
                  const objRes = { 
                      ...res
                  }
                  setContent(objRes) })
              .catch((error) => { console.error('Error fetching config:', error) });
      }, [lang]); */
      
      return (
          <section className='page-content accueil'>
          {/* { content && (
          <>
              nos actions
          </>
          )} */}
          </section>
      )
  }
  
  export default NosActions