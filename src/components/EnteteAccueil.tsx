import { useState, useEffect } from "react";
import Entete from "./interface/Entete";
import utils from "../services/utils";

interface EnteteAccueilProps {
  heading?: any;  
  image?: { data?: { attributes?: { url?: string } } };  
  params?: string; 
  CTA?: boolean;
  design?: { color?: string; background_color?: string };
}

const EnteteAccueil = ({ 
  heading, 
  image, 
  params = "", 
  design = { color: "", background_color: "" }, 
  CTA = false 
}: EnteteAccueilProps) => {

  const backgroundImageUrl = image?.data?.attributes?.url 
    ? `url(${utils.setUrl(image.data.attributes.url)})`
    : "none";

  const [color, setColor] = useState("#fff");
  const [background, setBackground] = useState("#009C1A");

  useEffect(() => {
    if (design.color) setColor(design.color);
    if (design.background_color) setBackground(design.background_color);
  }, [design]); // Ajout de design comme dépendance

  return (
    <section 
      className={`entete-section-container ${params}`} 
      style={{ 
        backgroundImage: backgroundImageUrl, 
        backgroundRepeat: "no-repeat", 
        backgroundPosition: "center", 
        backgroundSize: "cover" 
      }}
    >
      {heading.titre && (
      <div className="entete-container" style={{ color, backgroundColor: background }}>
        <Entete content={heading} CTA={CTA} />
      </div>
      )}

      {/* <div className='overlay'></div> */}
    </section>
  );
};

export default EnteteAccueil;
