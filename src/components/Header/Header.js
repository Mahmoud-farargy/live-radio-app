import React from "react";
import "./Header.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdArrowDropleftCircle, IoMdArrowDroprightCircle  } from "react-icons/io";
import { Link, useHistory } from "react-router-dom";
const Header = () => {
    const history = useHistory();
    const navigate = (direction) => {
        history.go(direction);
    };
    return (
        <header id="header">
            <div className="header--left--side flex-row">
                <label className="menu--btn flex-column" htmlFor="nav-toggler">
                    <GiHamburgerMenu />
                </label> 
                <span className="logo--txt">
                    <Link to="/">SoundEx</Link>
                </span>
                <div className="navigation--container flex-row">
                    <span onClick={() => navigate(-1)}><IoMdArrowDropleftCircle /></span>
                    <span onClick={() => navigate(1)}><IoMdArrowDroprightCircle/></span>
                </div>
            </div>
        </header>
    )
};

export default React.memo(Header);