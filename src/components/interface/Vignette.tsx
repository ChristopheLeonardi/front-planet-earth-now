import { useEffect, useState } from "react"
import ImageComponent from "./ImageComponent"
import "./vignette.css"
import utils from "../../services/utils"
import { Link } from 'react-router-dom';

const Vignette = ({ entry, cta }: { entry: any; cta:any;}) => {
    const id = entry.id
    if (!entry) {return}

    const data = entry.attributes ? entry.attributes : entry
    if(data.vignette_image.data){
        var imageContent = data.vignette_image.data ? data.vignette_image.data.attributes : ""
    }
    else{
        var imageContent = data.entete_image.data ? data.entete_image.data.attributes : ""
    }
    

    // Utilisation de la forme des données pour définir si un lien doit être calculé ou non
    const autoLink = entry.attributes ? false : true
    const linkUrl = autoLink ? data.lien : utils.seFrontUrl("/nos-actions/" + data.slug.replace(/-(en|es)$/, ''))

    const [sousTitre, setSousTitre] = useState("")

    useEffect(() => {
        var sub = data.sousTitre || data.description
        if (!sub) { return }
        if (sub.length > 100 ){ sub = `${sub.substring(0, 100)}...` }
        setSousTitre(sub)
    }, [])

    return(
        <article className={`vignette ${entry.vocation ? "img-picto" : ""}`}>
            {id && (
            <Link 
                to={entry.attributes.remplacement_lien_auto ? entry.attributes.remplacement_lien_auto : linkUrl}
                target={entry.attributes.remplacement_lien_auto ? "_blank" : ""}
            >
                            <div className="textes">
                <div>
                    <h3>{data.titre}</h3>
                    <p className="description">{sousTitre}</p>
                </div>
                {data.bouton_see_more && (<p 
                    className="primary-button"
                    style={{
                        backgroundColor: cta.background_color || "#009C1A", // Couleur de fond par défaut
                        borderColor: cta.background_color,
                        color: cta.font_color || "#ffffff", // Couleur du texte par défaut
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = cta.hover_background_color || "#007A16";
                        e.currentTarget.style.borderColor = cta.hover_background_color || "#007A16";
                        e.currentTarget.style.color = cta.hover_font_color || "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = cta.background_color || "#009C1A";
                        e.currentTarget.style.borderColor = cta.background_color || "#009C1A";
                        e.currentTarget.style.color = cta.font_color || "#ffffff";
                      }}
                    >{data.bouton_see_more.buttonLabel}</p>)}
            </div>
            
            
            <ImageComponent imageContent={imageContent}/>
            </Link>

            
            )}

        </article>
    )
}

export default Vignette