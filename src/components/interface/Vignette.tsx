import "./vignette.css"
import utils from "../../services/utils"
import { Link } from 'react-router-dom';

import ImageComponent, { type ImageSize } from "./ImageComponent";

type VignetteProps = {
    entry: any;
    cta?:
        | {
              background_color?: string;
              font_color?: string;
              hover_background_color?: string;
              hover_font_color?: string;
          }
        | false;
    sizes?: ImageSize[];
};

const Vignette = ({ entry, cta, sizes }: VignetteProps) => {
    if (!entry) return null;

    const id = entry.id;
    const data = entry.attributes ?? entry;
    const bouton = data.bouton_see_more;
    const ctaStyle = cta || {};

    const imageContent =
        data.vignette_image?.data?.attributes ??
        data.entete_image?.data?.attributes ??
        null;

    const autoLink = !entry.attributes;
    const linkUrl = autoLink
        ? data.lien
        : utils.seFrontUrl(
              "/nos-actions/" + (data.slug ?? "").replace(/-(en|es)$/, "")
          );

    const description = data.sousTitre || data.description || "";
    const sousTitre =
        description.length > 100
            ? `${description.substring(0, 100)}...`
            : description;

    if (!imageContent) return null;

    return (
        <article className={`vignette ${entry.vocation ? "img-picto" : ""}`}>
            {id && (
                <Link
                    to={
                        entry.attributes?.remplacement_lien_auto || linkUrl
                    }
                    target={
                        entry.attributes?.remplacement_lien_auto
                            ? "_blank"
                            : undefined
                    }
                >
                    <div className="textes">
                        <div>
                            <h3>{data.titre}</h3>
                            <p className="description">{sousTitre}</p>
                        </div>

                        {bouton && (
                            <p
                                className="primary-button"
                                style={{
                                    backgroundColor:
                                        ctaStyle.background_color || "#009C1A",
                                    borderColor:
                                        ctaStyle.background_color || "#009C1A",
                                    color: ctaStyle.font_color || "#ffffff",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        ctaStyle.hover_background_color ||
                                        "#007A16";
                                    e.currentTarget.style.borderColor =
                                        ctaStyle.hover_background_color ||
                                        "#007A16";
                                    e.currentTarget.style.color =
                                        ctaStyle.hover_font_color || "#ffffff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        ctaStyle.background_color || "#009C1A";
                                    e.currentTarget.style.borderColor =
                                        ctaStyle.background_color || "#009C1A";
                                    e.currentTarget.style.color =
                                        ctaStyle.font_color || "#ffffff";
                                }}
                            >
                                {bouton.buttonLabel}
                            </p>
                        )}
                    </div>

                    <ImageComponent imageContent={imageContent} sizes={sizes} />
                </Link>
            )}
        </article>
    );
};

export default Vignette