import {useState, useEffect} from 'react';
import googleSheetServices from '../services/googleSheet'
import EnteteAction from '../components/EnteteAction';
import { useLang } from '../context/LangContext';
import pageServices from '../services/pages'
import TableEvent from '../components/TableEvent';

import "./event.css"
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
        googleSheetServices
            .fetchCSVData(sheetId)
            .then((res:any) => { 
                setSheetData(res) })
            .catch((error) => { console.error('Error fetching config:', error) });
    }, [])
    return (
        <section className='page-content'>
            {content && (
                <>
                    <EnteteAction content={content}/>
                    <TableEvent content={sheetData}/>
                </>
            )}

        </section>
    )
}

export default Event