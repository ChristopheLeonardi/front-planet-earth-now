import { useEffect, useState } from "react"
import ImageComponent from "./ImageComponent"
import "./vignette.css"
import utils from "../../services/utils"

const Vignette = ({ entry }: { entry: any; }) => {
    console.log(entry.slug)
    const id = entry.id
    const data = entry.attributes ? entry.attributes : entry
    console.log(data)
    const imageContent = data.entete_image ? data.entete_image.data.attributes : data.image.data.attributes

    // Utilisation de la forme des données pour définir si un lien doit être calculé ou non
    const autoLink = entry.attributes ? false : true
    const linkUrl = autoLink ? data.lien : utils.seFrontUrl("/nos-actions/" + data.slug)

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
            <a href={linkUrl} title="go to action"> 
            <div className="textes">
                <h3>{data.titre}</h3>
                <p className="description">{sousTitre}</p>
                {data.bouton_see_more && (<p className="primary-button">{data.bouton_see_more.buttonLabel}</p>)}
            </div>
            
            
            <ImageComponent imageContent={imageContent}/>
        </a>
            )}

        </article>
    )
}

export default Vignette