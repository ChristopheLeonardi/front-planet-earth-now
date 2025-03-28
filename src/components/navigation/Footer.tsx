import { NavLink } from "react-router-dom"; 
import { useConfig } from '../../context/ConfigContext';
import { useLang } from '../../context/LangContext';
import { useState, useEffect } from "react";

import "./Footer.css"

const Rs_icone = ({type, url}: {type:string, url:string}) => {
    return(
        <a className={`rs ${type}`} href={url} title={`Aller sur le profil ${type}`}>
            <img src={`/${type}.svg`} alt=""/>
        </a>
    )
}

const Footer = () => {

    const { config } = useConfig();
    const lang = useLang();
    const isCurrent = ({ isActive }: { isActive: boolean }) => isActive ? "active" : "";

    const[logoLang, setLogoLang] = useState("logo_header_fr")

    useEffect(() => {
        setLogoLang("logo_footer_" + lang[0])
    }, [lang])

    return (
        <footer>
            {config && (
                <>
                    <NavLink className='footer-logo-link' to='/'>
                        <img className="logo" src={config[logoLang]} alt='Logo de Planet Earth Now'/>
                    </NavLink>
                    <nav>
                        <ul className="nav-links">
                        {config.pages.map(page => { 
                            if (page.is_displayed === "false") { return null }
                            return (
                            <li key={page.name_fr}>
                                <NavLink to={page.path} className={isCurrent}>{page[`name_${lang[0]}`]}</NavLink>
                            </li>
                        )})}
                        </ul>
                    </nav>
                    <div className="social">
                        {config.profil_linkedin && (<Rs_icone type="linkedin" url={config.profil_linkedin}/>)}
                        {config.profil_instagram && (<Rs_icone type="instagram" url={config.profil_instagram}/>)}
                    </div>
                    <div className="contact_infos">
                        <address>
                            {config.adresse}
                        </address>
                        <p>{config.phone_number}</p>
                    </div>
                </>
            )}
        </footer>
    )
}

export default Footer