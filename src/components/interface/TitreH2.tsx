import { useState, useEffect } from "react";
interface DataTitre {
    titre: string;
    sousTitre: string;
}

const TitreH2 = ({titre, sousTitre}:DataTitre) => {
    const [formatTitre, setFormatTitre] = useState<string[]>([])
    useEffect(() => {
        if (titre) {
            const lines = titre.split('||') ? titre.split('||') : [titre] 
            setFormatTitre(lines)
        }

    },[titre])
    return (
        <>  
        <div>
        {formatTitre.map((line, index) => {
            return (<h2 key={index}>{line}<br/></h2>)
        })}
        </div>
        {sousTitre != "" && (<p>{sousTitre}</p>)}
        </>
    )   
}

export default TitreH2