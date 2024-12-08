import React, { useEffect, useRef, useCallback, useState, memo} from 'react';
import Screens from "./components/Screens/Screens";
import Sidebar from "./components/Sidebar/Sidebar";
import Player from "./components/Player/Player";
import { connect } from "react-redux";
import { locStorage } from "./utilities/tools";
import * as actionTypes from "./store/actions/actions";
import * as Consts from "./utilities/consts";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import { useTranslation } from 'react-i18next';
import LostConnectivity from "./components/Modal/LostConnection/LostConnection";
import { useLocation } from "react-router-dom";
import { googleAnalyticsKey } from "./info/secretInfo";
import { portfolioURL, ipapiURL } from "./info/app-config.json";
import Api from "./services/api";

function App({ updateStoreWithLocalStorage, currentTheme, changeTheme, changeVisitorLocation ,localMemory }) {
  const currlocation = useLocation();
  // refs
  const _isMounted = useRef(true);
  const navToggler = useRef(null);
  // states
  const [isMenuExpanded, setMenuExpansion]= useState(false);
  const [isConnected, setConnectivity] = useState(navigator.onLine);
  const [isLoading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  // effects
  useEffect(() => {
     // xxx Google analytics xxx
    const trackingId = googleAnalyticsKey;
    if (!trackingId) {
      console.warn('Google Analytics tracking ID is not defined.');
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', trackingId);
    };
    // xxx Google analytics end xxx

    Api()
    .get(ipapiURL).then((res) => {
      if(_isMounted.current){
          const data = res.data;
          if(data && data.country_code){
            const { country_code = "", city = "", ip = "" } = data;
            (country_code && typeof country_code === "string") && changeVisitorLocation({
              ip: ip,
              city: city,
              country: country_code
            });
          } 
      }
    });
    window.addEventListener("load", () => setLoading(false));
    window.addEventListener('offline', ()=> setConnectivity(false));
    window.addEventListener('online', () => setConnectivity(true));
    changeTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    const handleThemeChanging = (e) => {
        changeTheme(e.matches ? "dark" : "light");
    }
    window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener("change", handleThemeChanging);
    const newLocStorage = locStorage({ type: "get" });
  
    if (newLocStorage && Object.keys(newLocStorage).length > 0) { 
      updateStoreWithLocalStorage({ type: "update", storage: newLocStorage});
    }
    let consoleStyles= [ 
      "font-size: 12px", 
      "font-family: monospace", 
      "background: white", 
      "display: inline-block", 
      "color: black", 
      "padding: 8px 19px", 
      "border: 1px dashed;" 
  ].join(";") 
    console.log(`%c Hi 👋 ! Glad you made it down here. Welcome to a console.log() adventure.`, consoleStyles);
    console.log(`%c If you like Soundex, I suggest you see more projects on my portfolio: ${portfolioURL}. Kiss from me 😘`, 'background: #ee11cc; color: #eee; font-size: 15px');
    return () => {
      window.addEventListener("load", () => {});
      window.removeEventListener('offline', () => {});
      window.removeEventListener('online', () => {});
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener("change", handleThemeChanging);
    };
  }, []);

  useEffect(() => {
    const changeBodyClass = newClass => document.body.setAttribute("class", newClass);
    currentTheme === "dark" ? changeBodyClass("darkTheme") : changeBodyClass("");
  }, [currentTheme]);

  useEffect(() => {
    const settings = localMemory?.settings;
    if(settings){
      settings.choosenLangauge && i18n.changeLanguage(settings.choosenLangauge);
    }
  }, [localMemory]);
  const closeSidebarOnMobile = useCallback(() => {
    if(_isMounted?.current && navToggler.current && ((window.innerWidth || document.documentElement.clientWidth) <= 670)){
      navToggler.current.checked = false;
      document.body.style.overflow = "visible";
    }
  },[]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left:0,
      behavior: "auto"
    })
  },[currlocation]);
  // functions
  const onNavTogglerChange = (e) => {
    const isChecked = e.target.checked;
    if((window.innerWidth || document.documentElement.clientWidth) <= 670){
      if(isChecked){
         document.body.style.overflow = "hidden"; 
      }else{
        document.body.style.overflow = "visible";
      }
    }
    setMenuExpansion(isChecked);
  }
  // jsx
  return (
    <div id="app">
      {/* modals */}
      <ToastContainer />
      {!isConnected && <LostConnectivity />}
      {/* app */}
      <input ref={navToggler} type="checkbox" onChange={(e) => onNavTogglerChange(e)} id="nav-toggler" />
      <>
        <Sidebar closeSidebarOnMobile={closeSidebarOnMobile} isMenuExpanded={isMenuExpanded}/>
        <Screens closeSidebarOnMobile={closeSidebarOnMobile} isAppLoading={isLoading}/>
      </>
      <Player />
    </div>
  );
}

App.propTypes = {
  updateStoreWithLocalStorage: PropTypes.func.isRequired,
  currentTheme: PropTypes.string.isRequired,
  changeTheme: PropTypes.func.isRequired,
  localMemory: PropTypes.object.isRequired,
  changeVisitorLocation: PropTypes.func.isRequired
}
const mapStateToProps = state => {
  return {
    currentTheme: state[Consts.MAIN].currentTheme,
    localMemory: state[Consts.MAIN].localStorageCopy || {}
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateStoreWithLocalStorage: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    changeTheme: (val) => dispatch({ type: actionTypes.CHANGE_CURRENT_THEME, currTheme: val }),
    changeVisitorLocation: (visitorInfo) => dispatch({ type: actionTypes.CHANGE_VISITOR_LOCATION, visitorInfo})
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(App));
