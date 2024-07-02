import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { LangProvider } from './context/LangContext'; 
import SiteSettings from './components/settings/SiteSettings';
import { SelectedProvider } from './context/SelectedContext';

import Accueil from './pages/Accueil';
import About from './pages/About';
import Event from './pages/Event';
import Vocation from './pages/Vocation'; 
import SingleAction from './pages/SingleAction';

interface PageComponentMap {
  [key: string]: (props: any) => JSX.Element;
  Accueil: (props: any) => JSX.Element;
  About: (props: any) => JSX.Element;
  Event: (props: any) => JSX.Element;
  Action: (props: any) => JSX.Element;
  Vocation: (props: any) => JSX.Element;
}

const pageComponent: PageComponentMap = {
  "Accueil": Accueil,
  "About": About,
  "Event": Event,
  "Action": Vocation,
  "Federer": Vocation, 
  "Vocation": Vocation,
  "SingleAction": SingleAction 
};

import "./App.css";

const AppContent = () => {
  const { config } = useConfig();

  return (
    <>
      <SiteSettings />
      <Header />
      <Routes>
        {
          config && config.pages.map((page: { path: string, template: string }) => { 
            const PageComponent = pageComponent[page.template];
            return (
              <Route 
                key={page.path} 
                path={page.path} 
                element={<PageComponent type={page.path.replace('/','')} />} 
              />
            );
          })
        }
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
