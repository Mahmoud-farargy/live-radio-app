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

function App({ updateStoreWithLocalStorage, currentTheme, changeTheme, localMemory }) {
  const _isMounted = useRef(true);
  const navToggler = useRef(null);
  const [isMenuExpanded, setMenuExpansion]= useState(false);
  const [isConnected, setConnectivity] = useState(navigator.onLine);
  const { i18n } = useTranslation();
  useEffect(() => {
    window.addEventListener('offline', ()=> setConnectivity(false));
    window.addEventListener('online', () => setConnectivity(true));
    changeTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    // window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener("change", e => {
    //   changeTheme(e.matches ? "dark" : "light");
    // });
    const newLocStorage = locStorage({ type: "get" });
  
    if (newLocStorage && Object.keys(newLocStorage).length > 0) { 
      console.log(newLocStorage);
      updateStoreWithLocalStorage({ type: "update", storage: newLocStorage});
    }
    return () => {
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
  
  const onNavTogglerChange = (e) => {
    const isChecked = e.target.checked;
    console.log(isChecked);
    if((window.innerWidth || document.documentElement.clientWidth) <= 670){
      if(isChecked){
         document.body.style.overflow = "hidden"; 
      }else{
        document.body.style.overflow = "visible";
      }
    }
    setMenuExpansion(isChecked);
  }
  return (
    <div id="app">
      {/* modals */}
      <ToastContainer />
      {!isConnected && <LostConnectivity />}
      {/* app */}
      <input ref={navToggler} type="checkbox" onChange={(e) => onNavTogglerChange(e)} id="nav-toggler" />
      <>
        <Sidebar closeSidebarOnMobile={closeSidebarOnMobile} isMenuExpanded={isMenuExpanded}/>
        <Screens closeSidebarOnMobile={closeSidebarOnMobile}/>
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
