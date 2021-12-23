import React, { useEffect, useRef, useCallback, useState} from 'react';
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

function App({ updateStoreWithLocalStorage, currentTheme, changeTheme, localMemory }) {
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
    window.addEventListener("load", () => setLoading(false));
    window.addEventListener('offline', ()=> setConnectivity(false));
    window.addEventListener('online', () => setConnectivity(true));
    changeTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    // window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener("change", e => {
    //   changeTheme(e.matches ? "dark" : "light");
    // });
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
    console.log('%c If you like Soundex, I suggest you see more projects on my portfolio: https://mahmoud-farargy.web.app. Kiss from me 😘', 'background: #ee11cc; color: #eee; font-size: 15px');
    return () => {
      window.addEventListener("load", () => {});
      window.removeEventListener('offline', () => {});
      window.removeEventListener('online', () => {});
    // window.matchMedia('(prefers-color-scheme: dark)').removeEventListener(() => {});
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
  localMemory: PropTypes.object.isRequired
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
    changeTheme: (val) => dispatch({ type: actionTypes.CHANGE_CURRENT_THEME, currTheme: val })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
