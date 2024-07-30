import ImageGallery from "react-image-gallery";
import utils from "../../services/utils";
import './Diaporama.css'

const Diaporama = ({images}:any) => {
    if (!images) { return }
    const imagesDiapo = images.map((image:any)=> {
        return {
            original: utils.setUrl(image.attributes.url),
            thumbnail: utils.setUrl(image.attributes.formats.thumbnail.url)
        }
    })    
    return (
        <>
            { images && (
                <ImageGallery             
                    items={imagesDiapo}
                    showThumbnails={false}
                    showBullets={true}
                    infinite={true}
                    showNav={true}
                />
            )}
        </>
    )
}

export default Diaporama