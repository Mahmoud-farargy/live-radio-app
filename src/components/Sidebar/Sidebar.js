import React, { Fragment, useState, useEffect, lazy, Suspense, useCallback } from "react";
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { IoMdRadio, IoIosTime, IoMdInformationCircle, IoMdBookmark } from "react-icons/io";
import { MdPodcasts } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { CgMenuGridO } from "react-icons/cg";
import { RiSearchEyeLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsKeyboard } from "react-icons/bs";
import { serialize } from "../../utilities/tools";
import appConfig from "../../info/app-config.json";
import PropTypes from "prop-types";
import { retry } from "../../utilities/RetryImport";
import * as consts from "../../utilities/consts";
import styled from "styled-components";
import GlobalLoading from "../Loading/Global";
import { useTranslation } from "react-i18next";

const AdvancedSearch = lazy(() => retry(() => import("../AdvancedSearch/AdvancedSearch")));
const Settings = lazy(() => retry(() => import("../Settings/Settings")));
const Hotkeys = lazy(() => retry(() => import("../Hotkeys/Hotkeys")));

const DIV = styled.div`
    height: calc(100vh - var(--height-header) - ${(props) => props.playerState.isPlayerFullMode && props.playerState.isPlayerOpen ? "var(--player-height-size)" : "0px"});
    overflow-y:auto;
    .copyright__sidebar{
        margin: ${(props) => props.playerState.isPlayerFullMode && props.playerState.isPlayerOpen ? "0.8rem auto 3rem auto" : "0.8rem auto 0rem auto"};
    }
`;
const Sidebar = ({ isPlayerFullMode, isPlayerOpen, closeSidebarOnMobile, isMenuExpanded }) => {
    const { t } = useTranslation();
    // states
    const history = useHistory();
    const [searchVal, setSearchVal] = useState("");
    const menuList = Object.freeze([
        {id: "oif98eubf", title: t("menuList.main.title"), icon: <CgMenuGridO/>, description: ""},
        {id: "w0fun0ufg", title: t("menuList.advanced_search.title"), icon: <RiSearchEyeLine/>, description: t("menuList.advanced_search.description")},
        {id: "foiw9fy9w", title: t("menuList.settings.title"), icon: <FiSettings/>, description: `${t("menuList.settings.description.pt1")}${appConfig.title}${t("menuList.settings.description.pt2")}`},
        {id: "wouobwfgg", title: t("menuList.hotkeys.title"), icon: <BsKeyboard/>, description: t("menuList.hotkeys.description")}
    ]);
    const [activeListItem, setActiveListItem] = useState({
        id: "oif98eubf", title: t("menuList.main.title"), icon: <CgMenuGridO/>
    });
    // end states
    const clearSearch = () => {
        setSearchVal("");
    };
    const onSubmission = (d) => {
        d.preventDefault();
        history.push(`${consts.SEARCH}?${serialize({ name: searchVal })}`);
        clearSearch();
        closeSidebarOnMobile();
    }
    const detectClicking = (x) => {
        const tagName = x.target.tagName;
        if(tagName === "A" || tagName === "PATH" || tagName === "SPAN" || tagName === "SVG" || tagName === "LI"){
            closeSidebarOnMobile();
        }
    }
    const handleMenuItemClicking = (item) => {
        setActiveListItem(item);
    } 
    const switchToMainSlide = useCallback(() => {
        setActiveListItem({id: "oif98eubf", title: t("menuList.main.title"), icon: <CgMenuGridO/>, description: ""});
    },[]);
    useEffect(() => {
        if(isMenuExpanded){
            switchToMainSlide();
        }
    }, [isMenuExpanded, switchToMainSlide]);


    return (
        <Fragment>
            <aside id="sidebar">
                <DIV playerState={{ isPlayerFullMode, isPlayerOpen }} className="sidebar-container flex-column">
                    <div className="sidebar--inner">
                        <div className="search">
                            <form className="search-bar flex-row" onSubmit={(d) => onSubmission(d)}>
                                <input className="search--input primary__input" type="text" name="search" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder={`${t("inputPlaceholders.searchBar")}..`} spellCheck="yes" />
                                <span className="search--toolkit flex-row">
                                    {searchVal !== "" && <span className="search__clear" onClick={() => clearSearch()}><MdClose /></span>}
                                    <button className="search--btn" type="submit"><BiSearch className="search--icon" /></button>
                                </span>
                            </form>
                            <div id="menuSection" className="flex-row">
                                <ul className="menu--section--inner flex-row">
                                    {
                                        menuList && menuList.length > 0 
                                        && menuList.map(menuItem => {
                                            return (
                                                <li onClick={() => handleMenuItemClicking(menuItem)} key={menuItem.id} className={`${activeListItem.id === menuItem.id ? "active--menu--item" : ""} menu__section__item`} data-title={menuItem.title}>{menuItem.icon}</li>
                                            )
                                        })
                                    }  
                                </ul>

                            </div>
                           
                        </div>
                        <div className="current--active--menu">
                            <h5 className='current--active--menu--title'>{activeListItem?.title}</h5>
                            <small className='current--active--menu--title'>{activeListItem?.description}</small>
                            <div className="current--active--menu--inner">
                                {
                                    activeListItem.id === consts.menuIds.main ?
                                    // main menu
                                    <ul onClick={(e) => detectClicking(e)}>
                                        <li><NavLink exact activeClassName="active--nav--link" to="/" >
                                            <IoMdRadio className="nav-item-icon" />
                                            <span className="nav-item-name">{t("menu.radio")}</span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink activeClassName="active--nav--link" to="/category?tag=podcast" >
                                            <MdPodcasts className="nav-item-icon" />
                                            <span className="nav-item-name">{t("menu.podcasts")}</span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink activeClassName="active--nav--link" to="/list/favorites" >
                                            <IoMdBookmark className="nav-item-icon" />
                                            <span className="nav-item-name">{t("menu.saved")}</span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink activeClassName="active--nav--link" to="/list/history" >
                                            <IoIosTime className="nav-item-icon" />
                                            <span className="nav-item-name">{t("menu.recently_played")}</span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink activeClassName="active--nav--link" to="/about" >
                                            <IoMdInformationCircle className="nav-item-icon" />
                                            <span className="nav-item-name">{t("menu.about")}</span>
                                        </NavLink>
                                        </li>
                                    </ul> 
                                    :
                                    activeListItem.id === consts.menuIds.advanced_search ?
                                    // advanced search
                                    <Suspense fallback={<GlobalLoading />}>
                                          <AdvancedSearch closeSidebarOnMobile={closeSidebarOnMobile}/>
                                    </Suspense>
                                    :
                                    activeListItem.id === consts.menuIds.hotkeys?
                                    // hotkeys
                                    <Hotkeys />
                                    :
                                    activeListItem.id === consts.menuIds.settings ?
                                    // settings
                                    <Suspense fallback={<GlobalLoading />}>
                                        <Settings switchToMainSlide={switchToMainSlide}/>
                                    </Suspense>
                                    : null
                                }   
                            </div>   

                        </div>

                    </div>
                    <span className="copyright__sidebar">&copy; 2021 Mahmoud Farargy</span>
                </DIV>
            </aside>
        </Fragment>
    )
};
Sidebar.propTypes = {
    isPlayerFullMode: PropTypes.bool.isRequired,
    isPlayerOpen: PropTypes.bool.isRequired,
    closeSidebarOnMobile: PropTypes.func.isRequired,
    isMenuExpanded: PropTypes.bool.isRequired
}
const mapStateToProps = state => {
    return {
        isPlayerFullMode: state[consts.MAIN].isPlayerFullMode,
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
    }
}

export default connect(mapStateToProps)(Sidebar);