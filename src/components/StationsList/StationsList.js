import React, { memo, useState } from "react";
import Auxiliary from "../HOC/Auxiliary";
import StationsListItem from "./StationsListItem.js/StationsListItem";
import styled from "styled-components";
import { connect } from "react-redux";
import EmptyResults from "../Generic/EmptyResults";
import PropTypes from "prop-types";
import * as consts from "../../utilities/consts";
import { BsShareFill } from "react-icons/bs";
import ShareList from "../Modal/ShareList/ShareList";
import { useTranslation } from "react-i18next";


const OuterContainer = styled.div`
        ul#stationsList{
            width: 100%;
            list-style: none;
            padding:0;
            background-color: var(--ultra-white);
            display: block;
            padding: 1.3rem 1rem;
            margin-top: 1.3rem;
            border-radius: 0.5rem;
            overflow: hidden;
            .stations--list--header{
                margin: 0.1rem 0 0.8rem 0;
                width: 100%;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                .list--name{
                    margin:0;
                }
                button.social__share__btn{
                    display: grid;
                    place-content:center;
                    border:none;
                    background: transparent;
                    padding: 0.4rem 0.5rem;
                    cursor: pointer;
                    border-radius: 5px;
                    &:hover{
                        background-color: var(--light-primary-clr);
                    }
                }
            }
        }
        .list--loading{
            @keyframes spin {
                to {
                    transform: rotateZ(360deg);
                }
            }
            height: calc(100vh - var(--height-header) - ${(props) => props.playerState.isPlayerFullMode && props.playerState.isPlayerOpen ? "var(--player-height-size)": "0px"});
            width: 100%;
            justify-content: center;
            align-items:center;
            span {
            display: block;
            margin: 0 auto;
            width:60px;
            height: 60px;
            border: 4px solid transparent;
            border-top-color: var(--primary-clr);
            border-radius: 50%;
            animation: spin ease 1000ms infinite;
            -webkit-animation: spin ease 1000ms infinite;
            }
        }
`;

const StationsList = ({ list, loading, isPlayerFullMode, isPlayerOpen, title, areSavedStations }) => {
    const [ isSocialModalOpen, setSocialModalOpenning ] = useState(false);
    const { t } = useTranslation();
    return (
        <Auxiliary>
            {isSocialModalOpen && <ShareList listName={title} setSocialModalOpenning={setSocialModalOpenning} isSocialModalOpen={isSocialModalOpen} listLink={window.location.href}/>}
            <OuterContainer playerState={{isPlayerFullMode, isPlayerOpen}} className="stationsList--outer--container">
                {
                    !loading ?
                    <ul id="stationsList">
                        <div className="stations--list--header flex-row">
                          {list?.length > 0 &&<h4 className="list--name">{title}</h4>}  
                            {(!areSavedStations && list?.length > 0) && <button onClick={() => setSocialModalOpenning(true)} title="Share this list" className="social__share__btn">
                                <BsShareFill />
                            </button>}
                        </div>
                        
                        {
                            list && list.length > 0 ? list.map((item, idx) => {
                                return item && (
                                    <StationsListItem item={item} key={item.id || idx} index={idx} wholeList={list}/>
                                )
                            })
                            :
                            <EmptyResults msg={t("no_match_msg")} />
                        }
                    </ul>
                    :
                    <div className="list--loading flex-column">
                        <span></span>
                    </div>
                }  
            </OuterContainer>
        </Auxiliary>
    )
};
StationsList.propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    isPlayerFullMode: PropTypes.bool.isRequired,
    isPlayerOpen:  PropTypes.bool.isRequired,
    title:  PropTypes.string.isRequired,
    areSavedStations: PropTypes.bool.isRequired,
}
StationsList.defaultProps ={
    list: [],
    loading: false,
    title: "",
    isPlayerFullMode: true,
    areSavedStations: false
}
const mapStateToProps = state => {
    return {
        isPlayerFullMode: state[consts.MAIN].isPlayerFullMode,
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
    }
}
export default connect(mapStateToProps)(memo(StationsList));