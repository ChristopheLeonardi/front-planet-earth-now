import utils from '../../services/utils'
import placeholder from '../../assets/img/placeholder.jpg';

export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large';

type Props = {
    imageContent?: any;
    id?: string | null;
    sizes?: ImageSize[];
};

const FORMAT_WIDTHS: Record<ImageSize, number> = {
    large: 1000,
    medium: 750,
    small: 500,
    thumbnail: 156,
};

const ImageComponent: React.FC<Props> = ({ imageContent, id, sizes }) => {
    const imgId = id ?? "";

    const allowedSizes = (Object.keys(FORMAT_WIDTHS) as ImageSize[]).filter(
        (size) => !sizes || sizes.length === 0 || sizes.includes(size)
    );

    let srcSet = '';
    let fallbackSrc: string = placeholder;

    if (imageContent) {
        srcSet = imageContent.formats
            ? allowedSizes
                .filter((size) => imageContent.formats[size])
                .map(
                    (size) =>
                        `${utils.setUrl(imageContent.formats[size].url)} ${FORMAT_WIDTHS[size]}w`
                )
                .join(', ')
            : '';

        fallbackSrc = utils.setUrl(imageContent.url);
    }

    return (
        <img
            id={imgId}
            srcSet={srcSet || undefined}
            src={fallbackSrc}
            alt={imageContent?.alternativeText || ''}
        />
    );
};

export default ImageComponent;