import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import pageServices from '../services/pages';

interface Page {
    name_fr: string;
    path: string;
    name_en: string;
    name_es: string;
    template: string;
  }

interface Config {
    logo: string;
    pictoeducation: string; 
    pictofederation: string; 
    pictoaction: string;
    pages: Page[];
}

interface ConfigContextType {
    config: Config | null;
}
/* TODO : Create contexte and use context for lang init browser */
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const ConfigProvider = ({ children }: { children: ReactNode }) => {

    var userLang = navigator.language; 
    console.log(userLang)
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
    }, []);

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
