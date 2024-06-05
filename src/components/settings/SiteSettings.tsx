import { useContext } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { LangContext } from '../../context/LangContex';

import "./SiteSettings.css"

const SiteSettings = () => {
    const { config } = useConfig();
    const langContext = useContext(LangContext);  
    if (!langContext) {
        throw new Error('SiteSettings must be used within a LangProvider');
    }
    const [lang, setLang] = langContext;
    const handleClickLang = (code:string) => { setLang(code) }
    return(
        <section className='site-settings'>
            {config && ( <p className='lang-selection-label'>{config.traduction.langSelect[lang]} : </p> )}
            {config && config.langues.map(langValue => {
                const langArray = langValue.split(" | ")
                return (
                    <button 
                        className={`lang-selector ${langArray[1] === lang ? 'selected' : ''}`}
                        key={langArray[1]} 
                        onClick={() => {handleClickLang(langArray[1])}}>
                        {langArray[0]}
                    </button>
                )
            })
            } 
        </section>
    )
}

export default SiteSettings