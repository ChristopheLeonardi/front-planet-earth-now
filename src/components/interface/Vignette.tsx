import { useEffect, useState } from "react"
import Image from "./Image"
import "./vignette.css"

const Vignette = ({data}:any, domaine:boolean) => {
    const [sousTitre, setSousTitre] = useState("")
    useEffect(() => {
        var sub = data.sousTitre
       if (data.sousTitre.length > 100 ){ sub = `${sub.substring(0, 100)}...` }
       setSousTitre(sub)
    }, [])
    return(
        <article className="vignette">
            <a href="#" title="go to action">
                <div className="textes">
                    <h3>{data.titre}</h3>
                    <p className="description">{sousTitre}</p>
                </div>
                {domaine ? (
                    <p className="domaine">{data.domaine.map((domaine:string) => {return domaine + " "})}</p>
                ) : (
                    null
                )}
                <Image imageContent={data.entete.data.attributes}/>
            </a>
        </article>
    )
}

export default Vignette