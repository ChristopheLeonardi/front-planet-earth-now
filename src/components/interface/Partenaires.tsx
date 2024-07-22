import ImageComponent from './ImageComponent'
import TitreH2 from './TitreH2'
const Partenaires = ({partenariatData}:any) => {
    const imageAndLink = partenariatData.partenaires.data.map((item:any) => {return item.attributes.imageAndLink})
    return (
        <div className='partenariats'>

            <TitreH2 titre={partenariatData.heading.titre} sousTitre={partenariatData.heading.sousTitre} />

            <div className='partenaires-container'>
                {imageAndLink.map((partenaire:any) => {
                    const imageAttributes = partenaire.image.data.attributes
                    return(
                    <a 
                        key={imageAttributes.alternativeText} 
                        href={partenaire.Lien} 
                        target="_blank" title={`Aller sur le site de ${imageAttributes.alternativeText}`}
                    >
                        <ImageComponent imageContent={imageAttributes}/>
                    </a>)
                })}
            </div>
        </div>
    )
}

export default Partenaires