import { useEffect, useState } from "react"
import ImageComponent from "./ImageComponent"
import "./vignette.css"
import utils from "../../services/utils"

const Vignette = ({ entry, domaine }: { entry: any; domaine: boolean }) => {
    const id = entry.id
    const data = entry.attributes ? entry.attributes : entry
    const imageContent = data.entete ? data.entete.data.attributes : data.image.data.attributes

    // Utilisation de la forme des données pour définir si un lien doit être calculé ou non
    const autoLink = entry.attributes ? false : true
    const linkUrl = autoLink ? data.lien : utils.seFrontUrl("/single-action?id=" + id)

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
            </div>
            {domaine ? (
                <p className="domaine">{
                    data.domaine.map((domaine:string, index:number) => {
                        var sep = data.domaine.length != index + 1 ? " | " : ""
                        return domaine + sep
                    })}
                </p>
            ) : (
                null
            )}
            
            <ImageComponent imageContent={imageContent}/>
        </a>
            )}

        </article>
    )
}

export default Vignette