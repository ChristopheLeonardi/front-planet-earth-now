import { NavLink } from "react-router-dom"; 
import { useConfig } from '../../context/ConfigContext';
import { useLang } from '../../context/LangContext';

import "./Footer.css"
const Footer = () => {

    const { config } = useConfig();
    const lang = useLang();
    const isCurrent = ({ isActive }: { isActive: boolean }) => isActive ? "active" : "";

    return (
        <footer style={{ backgroundColor: config?.navigation_color }}>
            {config && (
                <>
                    <NavLink className='footer-logo-link' to='/'>
                        <img className="logo" src={config.logo} alt='Logo de Planet Earth Now'/>
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