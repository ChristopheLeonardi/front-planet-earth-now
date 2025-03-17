import Entete from "./interface/Entete";
import utils from "../services/utils";

interface EnteteAccueilProps {
  heading?: any;  
  image?: { data?: { attributes?: { url?: string } } };  
  params?: string; 
  CTA?:any
}
const EnteteAccueil = ({ heading, image, params="", CTA=false }: EnteteAccueilProps) => {
  const backgroundImageUrl = image?.data?.attributes?.url 
      ? `url(${utils.setUrl(image.data.attributes.url)})`
      : "none"; 
  return (
      <section className={params} style={{ 
          backgroundImage: backgroundImageUrl, 
          backgroundRepeat: "no-repeat", 
          backgroundPosition: "center", 
          backgroundSize: "cover" 
      }}>
      <Entete content={heading} CTA={CTA}/>
      <div className='overlay'></div>
      </section>
  );
};

export default EnteteAccueil