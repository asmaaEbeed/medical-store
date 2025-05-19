import "./App.css";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { LanguageProvider } from "./contexts/LanguageContext";
import i18n from "./i18n/config";
import { ThemeProvider } from './shop/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { routers } from "./routers.jsx";
import { UserContextProvider } from "./shop/UserContext.jsx";
import GlobalLoader from "./Components/Loader/GlobalLoader.jsx";
import { ToastContainer } from "react-toastify";

const clientId = "666027340866-2iol5b22vihir8ns46peuufjkssfufmc.apps.googleusercontent.com";

function App() {

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'default';
    const navPosition = localStorage.getItem('navPosition') || 'relative';
    
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-nav-position', navPosition);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <GlobalLoader isVisible={isLoading} />;
  }
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserContextProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <LanguageProvider>
              <ToastContainer />
              <RouterProvider router={routers} />
            </LanguageProvider>
          </I18nextProvider>
        </ThemeProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
