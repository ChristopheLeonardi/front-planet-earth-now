import { useState, useEffect } from 'react';
import googleSheetServices from '../../services/googleSheet';
import EnteteAction from '../../components/EnteteAction';
import { useLang } from '../../context/LangContext';
import pageServices from '../../services/pages';
import TableEvent from './TableEvent';
import "./event.css";

// Interface pour un événement
interface EventData {
  "PEN présent": string;
  "Date début": string;
  "Date fin": string;
  Ville: string;
  Région: string;
  Type: string;
  Titre: string;
  Lien: string;
  [key: string]: string; // Pour les autres propriétés dynamiques
}

const filterEvent = (res: EventData[]): EventData[] => {

  if (!res || res.length === 0) {
    console.log("⚠️ Aucune donnée reçue ou tableau vide.");
    return [];
  }

  const dateNow = Date.now();
  const futureEvents = res.filter((event: EventData) => {
    try {
      const dateDebut = event["Date début"];
      if (!dateDebut) {
        console.warn("❌ Date début manquante pour un événement:", event);
        return false;
      }

      const [day, month, year] = dateDebut.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const timestamp = date.getTime();

      return timestamp >= dateNow;
    } catch (error) {
      console.error("❌ Erreur lors du calcul de la date:", error, "pour l'événement:", event);
      return false;
    }
  });


  const filtered = futureEvents.filter((event: EventData) => {
    //const shouldDisplay = event["PEN présent"] === "oui";
    //return shouldDisplay;
    // Désactiver le filtrage pour le moment, mais garder le code pour référence future
    return true;
  });


  const chronoFiltered = [...filtered].sort((a: EventData, b: EventData) => {
    const dateA = new Date(a["Date début"].split('/').reverse().join('-'));
    const dateB = new Date(b["Date début"].split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  return chronoFiltered;
};

const Event = () => {
  const lang = useLang();
  const [sheetData, setSheetData] = useState<EventData[]>([]);
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    pageServices
      .getPageContent({ page: "agenda", lang: lang[0] })
      .then((res: Record<string, unknown>) => {
        setContent(res);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error('❌ Erreur lors de la récupération du contenu:', error);
        setError(error);
        setLoading(false);
      });
  }, [lang]);

  useEffect(() => {
    const sheetId = '2PACX-1vSzOGPtK-2UxPAF2Y0rJk2k2L_oZOJaOiK42bKM3V6T4I0S88hr7X_Rw0LBcnlXHsiBdtw3-Al_3Kw9';

    googleSheetServices
      .fetchCSVData(sheetId)
      .then((res:any) => {
        const filtered = filterEvent(res);
        setSheetData(filtered);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error.message}</div>;
  }

  return (
    <section className='page-content'>
      {content && sheetData.length > 0 && (
        <>
          <EnteteAction content={content} />
          <TableEvent content={sheetData} />
        </>
      )}
    </section>
  );
};

export default Event;