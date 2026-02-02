import React from "react";
import "./Header.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle  } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom";
import appConfig from "../../info/app-config";
const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const moveToPage = (direction) => {
        navigate(direction);
    };
    return (
        <header id="header">
            <div className="header--left--side flex-row">
                <label className="menu--btn flex-column" htmlFor="nav-toggler">
                    <GiHamburgerMenu />
                </label> 
                <span className="logo--txt">
                    <Link to="/" className="logo__text">{appConfig.title}</Link>
                </span>
                <div className="navigation--container flex-row">
                    <span onClick={() => moveToPage(-1)} className={`tooltip ${!location.key ? 'disabled' :''}`.trim()} data-title="Next"><IoMdArrowDropleftCircle /></span>
                    <span onClick={() => moveToPage(1)}  className="tooltip" data-title="Prev"><IoMdArrowDroprightCircle/></span>
                </div>
            </div>
        </header>
    )
};

export default React.memo(Header);