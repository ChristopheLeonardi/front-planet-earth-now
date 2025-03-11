import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { LangProvider } from './context/LangContext'; 
import SiteSettings from './components/settings/SiteSettings';
import { SelectedProvider } from './context/SelectedContext';

import Accueil from './pages/Accueil';
import About from './pages/About';
import Vocation from './pages/Vocation'; 
import SingleAction from './pages/SingleAction';

// Désactivation page Agenda
//import Event from './pages/Agenda/Event';


interface PageComponentMap {
  [key: string]: (props: any) => JSX.Element;
  Accueil: (props: any) => JSX.Element;
  About: (props: any) => JSX.Element;
  // Désactivation page Agenda
  //Event: (props: any) => JSX.Element;
  Action: (props: any) => JSX.Element;
  Vocation: (props: any) => JSX.Element;
}

const pageComponent: PageComponentMap = {
  "Accueil": Accueil,
  "About": About,
  "Action": Vocation,
  "Federer": Vocation, 
  "Vocation": Vocation,
  "SingleAction": SingleAction 
  // Désactivation page Agenda
  //"Event": Event,
};

import "./App.css";
const Bandeau = () => {
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsCentered(true);
      } else {
        setIsCentered(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
      <div>
          <p
        className={`bandeau-vertical ${isCentered ? 'centered' : ''}`}
        style={isCentered ? { textAlign: 'center' } : {}}
      ><span className='green'>Planet</span> <span className='blue'>Earth</span> <span className='green'>Now</span></p>
      </div>
  )
}
const AppContent = () => {
  const { config } = useConfig();

  return (
    <>
      {/* <Bandeau/> */}
      <SiteSettings />
      <Header />
      <Routes>
        <>{config && console.log(config)}</>
        {
          config && config.pages.map((page: { path: string, template: string }) => { 
            const PageComponent = pageComponent[page.template];
            console.log(pageComponent)
            console.log(page)
            return (
              <Route 
                key={page.path} 
                path={page.path} 
                element={<PageComponent type={page.path.replace('/','')} />} 
              />
            );
          })
        }
        <Route path="/custom-flag" element={<SingleAction />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <LangProvider>
      <ConfigProvider>
        <SelectedProvider>
          <Router>
            <AppContent />
          </Router>
        </SelectedProvider>
      </ConfigProvider>
    </LangProvider>
  );
};

export default App;
