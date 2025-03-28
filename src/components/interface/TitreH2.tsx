import React from "react";
import { useState, useEffect } from "react";
interface DataTitre {
    titre: string;
    sousTitre: string;
    design?: any;
}

const TitreH2 = ({titre, sousTitre, design={color:"", background_color:""}}:DataTitre) => {
    const [formatTitre, setFormatTitre] = useState<string[]>([])
    useEffect(() => {
        if (titre) {
            const lines = titre.split('||') ? titre.split('||') : [titre] 
            setFormatTitre(lines)
        }

    },[titre])
    return (
        <>  
            {titre != "" && (<h2>{titre}</h2>)}
            {sousTitre != "" && (<p>{sousTitre}</p>)}
        </>
    )   
}
{/*             <div>
                {formatTitre.map((line, index) => {
                    return (<h2 key={index}>{line}<br/></h2>)
                })}
            </div> */}
export default TitreH2