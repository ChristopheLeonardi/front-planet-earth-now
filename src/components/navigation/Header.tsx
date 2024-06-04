import { useState } from 'react';
import { NavLink } from "react-router-dom"; 
import { useConfig } from '../../context/ConfigContext';

import "./Header.css"


const Header = () => {
    const { config } = useConfig();

    const [isOpen, setIsOpen] = useState(false);    
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const isCurrent = ({ isActive }: { isActive: boolean }) => isActive ? "active" : "";


    return (
        <header>
            {config && (
                <>
                    <NavLink to='/'>
                        <img className="logo" src={config.logo} alt='Logo de Planet Earth Now'/>
                    </NavLink>
                    <nav>

                        <button className={`burger ${isOpen ? 'toggle' : ''}`} onClick={toggleMenu} name='menu'>
                            <div className="line1"></div>
                            <div className="line2"></div>
                            <div className="line3"></div>
                        </button>

                        <ul className={`nav-links ${isOpen ? 'toggle' : ''} `}>
                        {config.pages.map(page => { return (
                            <li key={page.name_fr}>
                                <NavLink to={page.path} className={isCurrent}>{page.name_fr}</NavLink>
                            </li>
                        )})}
                        </ul>
                    </nav>
                </>

            )}
        </header>
    );
}

export default Header;