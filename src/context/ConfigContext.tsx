import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import pageServices from '../services/pages';
import { LangProvider } from './LangContext';

interface Page {
    name_fr: string;
    path: string;
    name_en: string;
    name_es: string;
    template: string;
    [key: string]: string; 
}
interface Trad {
    fr: string;
    en: string;
    es: string;
    [key: string]: string; 
}
interface Traduction {
    langSelect: Trad
}

interface Config {
    logo_header_fr: string;
    logo_header_en: string;
    logo_footer_fr: string;
    logo_footer_en: string;
    profil_instagram: string;
    profil_linkedin: string;
    profil_youtube: string;
    pages: Page[];
    langues: Array<string>;
    traduction: Traduction;
    navigation_color: string;
    adresse: string;
    phone_number: string;
}

interface ConfigContextType {
    config: Config | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const ConfigProvider = ({ children }: { children: ReactNode }) => {

    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        pageServices
            .getConfig()
            .then((res: Config) => {
                setConfig(res);
            })
            .catch((error) => {
                console.error('Error fetching config:', error);
            });
    }, [LangProvider]);

    return (
        <ConfigContext.Provider value={{ config }}>
            {children}
        </ConfigContext.Provider>
    );
};

const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

export { ConfigProvider, useConfig };
