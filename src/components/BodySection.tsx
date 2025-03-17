import TitreH2 from "./interface/TitreH2";
import RichText from "./interface/RichText";
import ImageComponent from "./interface/ImageComponent";

import "./bodysection.css"

const ModuleImageTexte = ({ data, type }: { data: any; type: string }) => {
  if (!type) return null; // Correction de la condition
  const typeClass = type.toLowerCase();

  return (
    <section className={`module-image-texte ${typeClass}`}>
      {data &&
        data.map((elt: any, index: number) => (
          <div key={index}>
            {elt.image?.data && (
              <ImageComponent imageContent={elt.image.data.attributes} />
            )}
            {elt.titre && (<p className="titre">{elt.titre}</p>)}
            {elt.sousTitre && (<p className="sousTitre">{elt.sousTitre}</p>)}
            {elt.auteur_citation && (<p className="auteur">{elt.auteur_citation}</p>)}
          </div>
        ))}
    </section>
  );
};

const BodySection = ({ data }: { data: any }) => {
  return (
    <section
      className="page-content"
      style={{ backgroundColor: data.background_color || "#f4f4f4" }}
    >
      <article>
        {data.titre && <h2>{data.titre}</h2>}
        {data.Body_section && <RichText data={data.Body_section} />}
        {data.type?.length > 0 && (
        <>
          {data.titre_icons_group && <h3 className="module-image-texte-title">{data.titre_icons_group}</h3>}
          <ModuleImageTexte data={data.module_picto_collaborateur} type={data.type} />
        </>
        )}
      </article>
    </section>
  );
};

export default BodySection;
