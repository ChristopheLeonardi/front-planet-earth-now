const Entete = ({content}:any) => {
    return (
    <div className='title-container'>
        <h1>{content.titre}</h1>
        <p>{content.sousTitre}</p>
    </div>
    )
} 

export default Entete