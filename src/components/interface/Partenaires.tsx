import ImageComponent from './ImageComponent'
import TitreH2 from './TitreH2'
import "../bodysection.css"
import ArrowIcon from '../ArrowIcon'
import React from 'react'

const Partenaires = ({partenariatData}:any) => {
    const imageAndLink = partenariatData.partenaires.data.map((item:any) => {return item.attributes.imageAndLink})
    return (
        <details className='page-content partenariats'>

            <summary>
                <ArrowIcon color={"var(--green-pen)"}/>
                <TitreH2 titre={partenariatData.heading.titre} sousTitre={partenariatData.heading.sousTitre} />
            </summary>
            <div className='partenaires-container'>
                {imageAndLink.map((partenaire:any, index:number) => {
                    const imageAttributes = partenaire.image.data.attributes
                    return(
                    <a 
                        key={index} 
                        href={partenaire.Lien} 
                        target="_blank" title={`Aller sur le site de ${imageAttributes.alternativeText}`}
                    >
                        <ImageComponent imageContent={imageAttributes}/>
                    </a>)
                })}
            </div>
        </details>
    )
}

export default Partenaires