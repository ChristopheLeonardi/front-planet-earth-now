import ImageComponent from "./interface/ImageComponent"
import RichText from '../components/interface/RichText';
import Diaporama from '../components/interface/Diaporama';

import './EnteteAction.css'
const EnteteAction = ({content}:any) => {
  return (
    <section className="entete-action">
      {content && (
        <>
          <ImageComponent imageContent={content.entete.data.attributes}/>
          <div className='title-container'>
            <h1>{content.titre}</h1>
            {content.sousTitre && (<p className="abstract">{content.sousTitre}</p>)}
            {content.linkButton && (
              <a 
                href={content.linkButton.link} 
                title={content.linkButton.buttonLabel} 
                target="_blank"
                className="primary-button"
              >{content.linkButton.buttonTitle}</a>
            )}
            {content.diaporama && (<Diaporama images={content.diaporama.data}/>)}
            {content.presentation && (<RichText data={content.presentation}/>)}

          </div>          
        </>)}
    </section>
  )
}

export default EnteteAction