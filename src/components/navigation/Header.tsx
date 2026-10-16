import { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom"; 
import { useConfig } from '../../context/ConfigContext';
import { useLang } from '../../context/LangContext';
import utils from '../../services/utils';
import "./Header.css"


const Header = () => {
    const { config } = useConfig();
    const lang = useLang();

    const [isOpen, setIsOpen] = useState(false);    
    const toggleMenu = () => { setIsOpen(!isOpen) };
    const isCurrent = ({ isActive }: { isActive: boolean }) => isActive ? "active" : "";

    const[logoLang, setLogoLang] = useState("logo_header_fr")

    useEffect(() => {
        setLogoLang("logo_header_" + lang[0])
    }, [lang])

    return (
        <>

            <header style={{ backgroundColor: config?.navigation_color }}>
                {config && (
                    <>
                        <NavLink to='/'>
                            <img className="logo" 
                                srcSet={`
                                    ${(config as Record<string, any>)[logoLang].attributes.formats.large ? utils.setUrl((config as Record<string, any>)[logoLang].attributes.formats.large.url) + " 1000w" : ""}, 
                                    ${(config as Record<string, any>)[logoLang].attributes.formats.medium ? utils.setUrl((config as Record<string, any>)[logoLang].attributes.formats.medium.url) + " 750w" : ""}, 
                                    ${(config as Record<string, any>)[logoLang].attributes.formats.small ? utils.setUrl((config as Record<string, any>)[logoLang].attributes.formats.small.url) + " 500w" : ""} ,
                                    ${(config as Record<string, any>)[logoLang].attributes.formats.thumbnail ? utils.setUrl((config as Record<string, any>)[logoLang].attributes.formats.thumbnail.url) + " 156w" : ""} `
                                } 
                                 src={utils.setUrl((config as Record<string, any>)[logoLang].attributes.formats.thumbnail.url)} 
                                 alt='Logo de Planet Earth Now'
                                {...{ fetchpriority: "high" }}
                                decoding="async"
                            />
                        </NavLink>
                        <nav>

                            <button className={`burger ${isOpen ? 'toggle' : ''}`} onClick={toggleMenu} name='menu'>
                                <div className="line1"></div>
                                <div className="line2"></div>
                                <div className="line3"></div>
                                <span className='overlay'></span>
                            </button>

                            <ul className={`nav-links ${isOpen ? 'toggle' : ''} `} >
                            {config.pages.map(page => { 
                                if (page.is_displayed === "false") { return null }
                                return (
                                    <li key={page.name_fr}>
                                        <NavLink to={page.path} className={isCurrent} onClick={() => setIsOpen(!isOpen)} target={page.new_tab && page.new_tab === "true" ? "_blank" : undefined}>
                                            {page[`name_${lang[0]}`]}
                                        </NavLink>
                                    </li>
                                )
                            })}
                            </ul>
                        </nav>
                    </>

                )}
            </header>
        </>

    );
}

export default Header;