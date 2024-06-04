import { NavLink } from "react-router-dom"; 
import { useConfig } from '../../context/ConfigContext';
import "./Footer.css"
const Footer = () => {

    const { config } = useConfig();

    const isCurrent = ({ isActive }: { isActive: boolean }) => isActive ? "active" : "";

    return (
        <footer>
            {config && (
                <>
                    <NavLink to='/'>
                        <img className="logo" src={config.logo} alt='Logo de Planet Earth Now'/>
                    </NavLink>
                    <nav>
                        <ul className="nav-links">
                        {config.pages.map(page => { return (
                            <li key={page.name_fr}>
                                <NavLink to={page.path} className={isCurrent}>{page.name_fr}</NavLink>
                            </li>
                        )})}
                        </ul>
                    </nav>
                </>
            )}
        </footer>
    )
}

export default Footer