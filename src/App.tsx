import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import { ConfigProvider, useConfig } from './context/ConfigContext';

import Accueil from './pages/Accueil';
import About from './pages/About';
import Event from './pages/Event';

import Action from './pages/Action';
import Vocation from './pages/Vocation';

interface PageComponentMap {
  [key: string]: () => JSX.Element;
  Accueil: () => JSX.Element;
  About: () => JSX.Element;
  Event: () => JSX.Element;
  Action: () => JSX.Element;
  Vocation: () => JSX.Element;
}

const pageComponent: PageComponentMap = {
  "Accueil": Accueil,
  "About": About,
  "Event": Event,
  "Action": Action,
  "Vocation": Vocation
}

import "./App.css";


const AppContent = () => {
  const { config } = useConfig();

  return (
    <>
      <Header />
      <Routes>
        {
          config && config.pages.map(page => {
            const PageComponent = pageComponent[page.template];
            return (
              <Route key={page.path} path={page.path} element={<PageComponent/>}/>
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
    <ConfigProvider>
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
};

export default App;
