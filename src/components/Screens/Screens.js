import React, { Fragment } from "react";
import AppRoutes from "../../router/routes";
import Header from "../Header/Header";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as consts from "../../utilities/consts";
import GlobalLoading from "../../components/Loading/Global";

const Main = styled.main`
        position: relative;
        margin-left: var(--default-layout-size);
        background-color: var(--seconday-clr);
        min-height: 100vh;
        transition:  0.3s linear;
        transition-property: margin-left, background-color;
        header#header{
            z-index: var(--z-header);
            background-color: var(--ultra-white);
            transition: background-color 0.3s linear;
            position: sticky;
            top:0;
        }
        .modal--backdrop{
            z-index: var(--z-backdrop);
            display:none;
        }
        padding-bottom:${({$playerState}) => $playerState.isPlayerFullMode && $playerState.isPlayerOpen ? "calc(var(--player-height-size) + 30px)" : "30px"};
`;
const Screens = ({isPlayerFullMode, isPlayerOpen, closeSidebarOnMobile, isAppLoading}) => {
    return (
        <Fragment>
            <Main $playerState={{isPlayerFullMode, isPlayerOpen}} id="screens">
                
                <div className="modal--backdrop" onClick={() => closeSidebarOnMobile()}></div>
                <Header />
                {
                    isAppLoading ?
                        <GlobalLoading />
                    :
                        <AppRoutes />
                }
                
            </Main>
        </Fragment>
    )
};
Screens.propTypes = {
    isPlayerFullMode: PropTypes.bool.isRequired,
    isPlayerOpen: PropTypes.bool.isRequired,
    closeSidebarOnMobile: PropTypes.func.isRequired
}
const mapStateToProps = state => {
    return {
        isPlayerFullMode: state[consts.MAIN].isPlayerFullMode,
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
    }
}
export default connect(mapStateToProps)(Screens);