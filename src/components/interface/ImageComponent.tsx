import utils from '../../services/utils'

type Props = {
    imageContent: any; 
    id?: string | null; 
};

const ImageComponent: React.FC<Props> = ({ imageContent, id }) => {
    const imgId = id ? id : "" 
    return (
        <>
        { imageContent.formats ? (
            <img 
            id={imgId}
            srcSet={`
                ${imageContent.formats.large ? utils.setUrl(imageContent.formats.large.url) + " 1000w" : ""}, 
                ${imageContent.formats.medium ? utils.setUrl(imageContent.formats.medium.url) + " 750w" : ""}, 
                ${imageContent.formats.small ? utils.setUrl(imageContent.formats.small.url) + " 500w" : ""} ,
                ${imageContent.formats.thumbnail ? utils.setUrl(imageContent.formats.thumbnail.url) + " 156w" : ""} `
            } 
            alt={imageContent.alternativeText}/>
        ) : (
            <>
            <img 
                id={imgId}
                srcSet={utils.setUrl(imageContent.url)} 
                alt={imageContent.alternativeText}/>
            </>
        )}
        </>

    )
}

export default ImageComponent