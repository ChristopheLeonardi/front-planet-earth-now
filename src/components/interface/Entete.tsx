const Entete = ({ content, CTA }: { content: any; CTA?: any }) => {  
    return (
        <div className='title-container'>
            <h1>{content.titre}</h1>
            <p>{content.sousTitre}</p>
            {CTA && CTA.link && (
                <div className='cta'>
                    <a 
                        className="primary-button"
                        href={CTA.link} 
                        target={CTA.Ouvrir_dans_une_nouvelle_fenetre ? "_blank" : ""}
                        title={CTA.attribut_title}
                    >
                        {CTA.texte}
                    </a>
                </div>
            )}
        </div>
    );
};  

export default Entete