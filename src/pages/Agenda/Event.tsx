/* import {useState, useEffect} from 'react';
import googleSheetServices from '../../services/googleSheet'
import EnteteAction from '../../components/EnteteAction';
import { useLang } from '../../context/LangContext';
import pageServices from '../../services/pages'
import TableEvent from './TableEvent';

import "./event.css"
const filterEvent = (res:any) => {
    const dateNow = Date.now()
    const futureEvents = res.filter((event:any) => dateToTimestamp(event["Date début"]) >= dateNow)
    const filtered = futureEvents.filter((event:any) => event.Afficher === "oui");
    const chronoFiltered = filtered.sort((a:any,b:any) => { return dateToTimestamp(a["Date début"]) - dateToTimestamp(b["Date début"]); })
    return chronoFiltered
}

function dateToTimestamp(dateString:string) {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getTime();
}

const Event = () => {

    const lang = useLang();

    const [sheetData, setSheetData] = useState(null)
    const [content, setContent] = useState<any | null>(null);

    useEffect(() => {
        pageServices
            .getPageContent({"page": "agenda", "lang": lang[0]})
            .then((res: any) => { 
                const objRes = {
                    ...res,
                }
                setContent(objRes) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [lang]);

    useEffect(() => {
        const sheetId = '2PACX-1vSzOGPtK-2UxPAF2Y0rJk2k2L_oZOJaOiK42bKM3V6T4I0S88hr7X_Rw0LBcnlXHsiBdtw3-Al_3Kw9'
        //const sheetId = '2PACX-1vSzOGPtK-2UxPAF2Y0rJk2k2L_oZOJaOiK42bKM3V6T4I0S88hr7X_Rw0LBcnlXHsiBdtw3-Al_3Kw9'
        googleSheetServices
            .fetchCSVData(sheetId)
            .then((res:any) => { 
                const filtered = filterEvent(res)
                setSheetData(filtered) 
            })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [])

    return (
        <section className='page-content'>
            {content && sheetData &&(
                <>
                {console.log(sheetData)}
                    <EnteteAction content={content}/>
                    <TableEvent content={sheetData}/>
                </>
            )}

        </section>
    )
}

export default Event */

import { useState, useEffect } from 'react';
import googleSheetServices from '../../services/googleSheet';
import EnteteAction from '../../components/EnteteAction';
import { useLang } from '../../context/LangContext';
import pageServices from '../../services/pages';
import TableEvent from './TableEvent';
import "./event.css";

const filterEvent = (res) => {
  console.log("📥 Données brutes reçues:", res); // Log des données brutes

  if (!res || res.length === 0) {
    console.log("⚠️ Aucune donnée reçue ou tableau vide.");
    return [];
  }

  const dateNow = Date.now();
  const futureEvents = res.filter((event) => {
    try {
      const dateDebut = event["Date début"];
      if (!dateDebut) {
        console.warn("❌ Date début manquante pour un événement:", event);
        return false;
      }

      const [day, month, year] = dateDebut.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const timestamp = date.getTime();

      console.log(`📅 Date début: ${dateDebut} → Timestamp: ${timestamp} (dateNow: ${dateNow})`);
      return timestamp >= dateNow;
    } catch (error) {
      console.error("❌ Erreur lors du calcul de la date:", error, "pour l'événement:", event);
      return false;
    }
  });

  console.log("🔍 Événements futurs:", futureEvents);

  const filtered = futureEvents.filter((event) => {
    const shouldDisplay = event["PEN présent"] === "oui";
    console.log(`🔎 PEN présent: ${event["PEN présent"]} → ${shouldDisplay}`);
    return shouldDisplay;
  });

  console.log("🎯 Événements filtrés finaux:", filtered);

  const chronoFiltered = filtered.sort((a, b) => {
    const dateA = new Date(a["Date début"].split('/').reverse().join('-'));
    const dateB = new Date(b["Date début"].split('/').reverse().join('-'));
    return dateA - dateB;
  });

  return chronoFiltered;
};

const Event = () => {
  const lang = useLang();
  const [sheetData, setSheetData] = useState([]); // Initialisé à [] au lieu de null
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    pageServices
      .getPageContent({ page: "agenda", lang: lang[0] })
      .then((res) => {
        setContent(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Erreur lors de la récupération du contenu:', error);
        setError(error);
        setLoading(false);
      });
  }, [lang]);

  useEffect(() => {
    const sheetId = '2PACX-1vSzOGPtK-2UxPAF2Y0rJk2k2L_oZOJaOiK42bKM3V6T4I0S88hr7X_Rw0LBcnlXHsiBdtw3-Al_3Kw9';

    googleSheetServices
      .fetchCSVData(sheetId)
      .then((res) => {
        console.log("📥 Données brutes depuis Google Sheets:", res);
        const filtered = filterEvent(res);
        setSheetData(filtered);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Erreur lors de la récupération des données:', error);
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
      {console.log("📊 sheetData actuel:", sheetData)} {/* Log du state */}
      {content && sheetData.length > 0 ? (
        <>
          <EnteteAction content={content} />
          <TableEvent content={sheetData} />
        </>
      ) : (
        <div>Aucun événement trouvé.</div>
      )}
    </section>
  );
};

export default Event;