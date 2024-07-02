import ImageComponent from "./interface/ImageComponent"
import Entete from "./interface/Entete"
import './EnteteAction.css'
const EnteteAction = (content:any) => {
  return (
    <section className="entete-action">
      {content.content && (
        <>
          <ImageComponent imageContent={content.content.entete.data.attributes}/>
          <Entete content = {content.content}/>
        </>)}
    </section>
  )
}

export default EnteteAction