import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPreviewData, getPreviewDataAction } from "../api/getPreviewData";

import Accueil from './Accueil';
import About from './About';
import NosActions from './NosActions';
import Contact from './Contact';
import SingleAction from './SingleAction';
import MentionsLegales from './MentionsLegales';

export default function PreviewPage() {
  const [params] = useSearchParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewData = async () => {
      const type = params.get("type");
      const entryId = params.get("entryId");
      if (!type || !entryId) {
        setLoading(false);
        return;
      }

      try {
        if (entryId){
          const response = await getPreviewDataAction("actions", entryId);
          console.log("Réponse API:", response);
          setData(response.data.attributes);
        } else {
          const response = await getPreviewData(type);
          console.log("Réponse API:", response);
          setData(response.data.attributes);
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement de la prévisualisation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [params]);

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Aucune donnée trouvée.</p>;

  return (
    <>
      {data.slug === "accueil" && (<Accueil previewData={data}/>)}
      {data.slug === "about" && (<About previewData={data}/>)}
      {data.slug === "contact" && (<Contact previewData={data}/>)}
      {data.slug === "nos-actions" && (<NosActions previewData={data}/>)}
      {data.slug === "mentions-legales" && (<MentionsLegales previewData={data}/>)}
      {data.slug != "" && (<SingleAction previewData={data}/>)}

    </>
  );
}
