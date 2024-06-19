import { useEffect, useState } from "react"
import ImageComponent from "./ImageComponent"
import "./vignette.css"
import utils from "../../services/utils"

const Vignette = ({entry}:any, domaine:boolean) => {
    const id = entry.id
    const data = entry.attributes
    const [sousTitre, setSousTitre] = useState("")
    useEffect(() => {
        var sub = data.sousTitre
       if (data.sousTitre.length > 100 ){ sub = `${sub.substring(0, 100)}...` }
       setSousTitre(sub)
    }, [])
    return(
        <article className="vignette">
            {id && (
            <a href={utils.seFrontUrl("/single-action?id=" + id)} title="go to action"> 
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
            <ImageComponent imageContent={data.entete.data.attributes}/>
        </a>
            )}

        </article>
    )
}

export default Vignette