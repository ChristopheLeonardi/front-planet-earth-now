import { createContext, useState, useContext, ReactNode } from 'react';


const LangContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>] | undefined>(undefined);

const LangProvider = ({ children }: { children: ReactNode }) => {
    const userLang = navigator.language || "en-US";

    const matchedLang = userLang.match(/^[^-]+/);
    const initialLang = matchedLang ? matchedLang[0] : 'en';
    const [lang, setLang] = useState<string>(initialLang);
    return (
        <LangContext.Provider value={[lang, setLang]}>
            {children}
        </LangContext.Provider>
    );
};

const useLang = () => {
    const context = useContext(LangContext);
    if (context === undefined) {
        throw new Error('useLang must be used within a LangProvider');
    }
    return context;
}

export { LangProvider, useLang, LangContext};
