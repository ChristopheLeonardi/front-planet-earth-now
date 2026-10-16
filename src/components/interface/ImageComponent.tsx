import utils from '../../services/utils'

export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large';

type Props = {
    imageContent: any;
    id?: string | null;
    sizes?: ImageSize[];
};

// Ordre d'affichage + largeur associée (en px) pour chaque format Strapi
const FORMAT_WIDTHS: Record<ImageSize, number> = {
    large: 1000,
    medium: 750,
    small: 500,
    thumbnail: 156,
};

const ImageComponent: React.FC<Props> = ({ imageContent, id, sizes }) => {
    const imgId = id ? id : "";

    if (!imageContent) return null;

    // Sans option : tous les formats. Avec option : uniquement ceux cités.
    const allowedSizes = (Object.keys(FORMAT_WIDTHS) as ImageSize[]).filter(
        (size) => !sizes || sizes.length === 0 || sizes.includes(size)
    );

    const srcSet = imageContent.formats
        ? allowedSizes
            .filter((size) => imageContent.formats[size])
            .map(
                (size) =>
                    `${utils.setUrl(imageContent.formats[size].url)} ${FORMAT_WIDTHS[size]}w`
            )
            .join(', ')
        : '';

    // Si aucun format ne correspond, on retombe sur l'image d'origine
    const fallbackSrc = utils.setUrl(imageContent.url);

    return (
        <img
            id={imgId}
            srcSet={srcSet || undefined}
            src={fallbackSrc}
            alt={imageContent.alternativeText || ''}
        />
    );
};

export default ImageComponent;