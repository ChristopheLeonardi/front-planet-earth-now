import utils from '../../services/utils'

const Image = ({imageContent}:any) => {

    return (
        <>
        { imageContent.formats ? (
            <img 
            srcSet={`
                ${imageContent.formats.large ? utils.setUrl(imageContent.formats.large.url) + " 1000w" : ""}, 
                ${imageContent.formats.medium ? utils.setUrl(imageContent.formats.medium.url) + " 750w" : ""}, 
                ${imageContent.formats.small ? utils.setUrl(imageContent.formats.small.url) + " 500w" : ""} ,
                ${imageContent.formats.thumbnail ? utils.setUrl(imageContent.formats.thumbnail.url) + " 156w" : ""} `
            } 
            alt={imageContent.alternativeText}/>
        ) : (
            <img 
                srcSet={utils.setUrl(imageContent.url)} 
            alt={imageContent.alternativeText}/>
        )}
        </>

    )
}

export default Image