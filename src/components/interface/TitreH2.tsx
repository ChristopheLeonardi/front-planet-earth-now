interface DataTitre {
    titre: string;
    sousTitre: string;
}

const TitreH2 = ({titre, sousTitre}:DataTitre) => {
    return (
        <>
            <h2>{titre}</h2>
            <p>{sousTitre}</p>
        </>
    )   
}

export default TitreH2