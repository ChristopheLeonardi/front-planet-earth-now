import ImageComponent from './ImageComponent'
import TitreH2 from './TitreH2'
const Partenaires = ({partenariatData}:any) => {
    console.log(partenariatData)
    return (
        <div className='partenariats'>

            <TitreH2 titre={partenariatData.heading.titre} sousTitre={partenariatData.heading.sousTitre} />

            <div className='partenaires-container'>
                {partenariatData.imageAndLink.map((partenaire:any) => {
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