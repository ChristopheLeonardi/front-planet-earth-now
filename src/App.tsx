import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { ConfigProvider } from './context/ConfigContext';
import { LangProvider } from './context/LangContext'; 
import { SelectedProvider } from './context/SelectedContext';

import SiteSettings from './components/settings/SiteSettings';
import pageServices from './services/pages'
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import Accueil from './pages/Accueil';
import About from './pages/About';
import Drapeau from './pages/Drapeau';
import NosActions from './pages/NosActions';
import Contact from './pages/Contact';
import SingleAction from './pages/SingleAction';
import MentionsLegales from './pages/MentionsLegales';

import PreviewPage from "./pages/PreviewPage";

// Désactivation page Agenda
//import Event from './pages/Agenda/Event';
//<Route path="/evenements" element={<Event />} />

import "./App.css";


const AppContent = () => {

  const [singleActionsRoute, setSingleActionsRoute] = useState<any[]>([]);
  useEffect(() => {
        pageServices
            .getSingleActionsRoutes()
            .then((res) => { setSingleActionsRoute(res) })
            .catch((error) => { console.error('Error fetching config:', error) });
  }, []);
  return (
    <>
      <SiteSettings />
      <Header />
      <Routes>
        {
          singleActionsRoute.length > 0 && singleActionsRoute.map((page:any, index:number) => { 
            return (
              <Route 
                key={page.slug + index} 
                path={`nos-actions/${page.attributes.slug}`} 
                element={<SingleAction id={page.id}/>} 
              />
            );
          })
        }

        <Route path="/" element={<Accueil />} />
        <Route path="/qui-sommes-nous" element={<About />} />
        <Route path="/nos-actions" element={<NosActions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/custom-flag" element={<Drapeau />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        
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
