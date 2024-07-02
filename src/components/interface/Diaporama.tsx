import ImageGallery from "react-image-gallery";
import utils from "../../services/utils";
import './Diaporama.css'

const Diaporama = (images:any) => {
    const imagesDiapo = images.images.map((image:any)=> {
        return {
            original: utils.setUrl(image.attributes.url),
            thumbnail: utils.setUrl(image.attributes.formats.thumbnail.url)
        }
    })    
    return (
        <ImageGallery             
            items={imagesDiapo}
            showThumbnails={false}
            showBullets={true}
            infinite={true}
            showNav={true}
            slideToIndex={0}
        />
    )
}

export default Diaporama