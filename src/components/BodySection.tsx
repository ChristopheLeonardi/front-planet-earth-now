//import TitreH2 from "./interface/TitreH2";
import RichText from "./interface/RichText";
import ImageComponent from "./interface/ImageComponent";
import { useEffect } from "react";
import ArrowIcon from "./ArrowIcon";
import "./bodysection.css"


const ModuleImageTexte = ({ data, type, paragraph_color }: { data: any; type: string; paragraph_color:string; }) => {
  if (!type) return null; // Correction de la condition
  const typeClass = type.toLowerCase();

  return (
    <section className={`module-image-texte ${typeClass}`}>
      {data &&
        data.map((elt: any) => (
          <div key={elt.id}>
            {elt.image?.data && (
              <ImageComponent imageContent={elt.image.data.attributes} />
            )}
            {elt.titre && (<p className="titre" style={{color: paragraph_color || "#000"}}>{elt.titre}</p>)}
            {elt.sousTitre && (<p className="sousTitre" style={{color: paragraph_color || "#000"}}>{elt.sousTitre}</p>)}
            {elt.auteur_citation && (<p className="auteur" style={{color: paragraph_color || "#000"}}>{elt.auteur_citation}</p>)}
          </div>
        ))}
    </section>
  );
};

const handleSummaryClick = (e:any) => {
  let details = document.querySelectorAll("details")
  if (e.target.hasAttribute("open")){
    e.target.toggleAttribute("open")
  } else{
    Array.from(details).map(elt => { elt.removeAttribute("open")})
    e.target.setAttribute("open", "open")
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }


}

const BodySection = ({ data }: { data: any }) => {
  //const isOpen = index === 0 ? true : false
  useEffect(() => {
    document.documentElement.style.setProperty("--rich-text-color", data.paragraph_color);
  }, [])

  return (
    <details
      className="page-content"
      style={{ backgroundColor: data.background_color || "#ffffff" }}
      open={false}
    >
      <summary onClick={(e) => handleSummaryClick(e)}>
      <ArrowIcon color={data.heading_color || "var(--green-pen)"}/>
        {data.titre && <h2 style={{ color: data.heading_color || "var(--green-pen)" }}>{data.titre}</h2>}</summary>
      <article>        
        {data.Body_section_2 && (
          <div style={{color: data.paragraph_color || "#000"}}>
          <RichText ck5_data={data.Body_section_2} />
          </div>)}
        {data.type?.length > 0 && (
        <>
          {data.titre_icons_group && <h3 className="module-image-texte-title">{data.titre_icons_group}</h3>}

          <ModuleImageTexte data={data.module_picto_collaborateur} type={data.type} paragraph_color={data.paragraph_color}/>
        </>
        )}
      </article>
    </details>
  );
};

export default BodySection;
