import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPreviewData } from "../api/getPreviewData";

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
        const response = await getPreviewData(type, entryId);
        setData(response.data.attributes);
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
    <div>
      <h1>Prévisualisation</h1>
      <h2>{data.title}</h2>
      <p>{data.content}</p>

      <hr />
      <h3>Données brutes :</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
