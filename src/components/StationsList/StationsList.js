import React, { Fragment, lazy, memo, useContext, useMemo, useState, Suspense } from "react";
import Auxiliary from "../HOC/Auxiliary";
import StationsListItem from "./StationsListItem.js/StationsListItem";
import styled from "styled-components";
import { connect } from "react-redux";
import EmptyResults from "../UI/EmptyResults";
import PropTypes from "prop-types";
import * as consts from "../../utilities/consts";
import { BsShareFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { AudioContext } from "../PlayerContext/PlayerContext";

const  ShareList = lazy(() => import("../Modal/ShareList/ShareList"));

const OuterContainer = styled.div`
        #stationsSectionHeader{
            margin: 0.1rem 0 0.8rem 0;
            width: 100%;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            .list--name{
                margin:0;
            }
            svg{
                color: var(--text-black);
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
        ul#stationsList{
            width: 100%;
            list-style: none;
            padding:0;
            background-color: var(--ultra-white);
            display: block;
            padding: 1.3rem 1rem;
            margin-top: 1.3rem;
            border-radius: var(--radius);
            overflow: hidden;
        }
        .list--loading{
            @keyframes spin {
                to {
                    transform: rotateZ(360deg);
                }
            }
            height: calc(100vh - var(--height-header) - ${({$playerState}) => $playerState.isPlayerFullMode && $playerState.isPlayerOpen ? "var(--player-height-size)": "0px"});
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

const StationsList = ({ list = [], loading = false, isPlayerFullMode = true, isPlayerOpen = false, title = "", areSavedStations = false }) => {
    const [ isSocialModalOpen, setSocialModalOpening ] = useState(false);
    const { t } = useTranslation();
    const { toggleStationPlaying, toggleStationLiking } = useContext( AudioContext );

    const itemMap = useMemo(() => new Map(list.map(i => [i.id, i])),[list]);

    const onListClick = (event) => {
    const element = event.target.closest("[data-item-id]");
    if(!element) return;
    const elementId = element.dataset.itemId
    if(!elementId) return;
    const item = itemMap.get(elementId);
    if(!item) return;

    const actionType = event.target.closest("[data-action]")?.dataset.action;

    switch(actionType){
      case "toggleLiking": 
        const isLiked = !!+element.dataset.liked;
        toggleStationLiking({item, isLiked});

      break;
      case "togglePlaying":
        toggleStationPlaying({list, itemId: elementId});

      break;
      default: {
        return {}
      }
    }
  }

    return (
        <Auxiliary>
            <Suspense fallback={<div>Loading...</div>}>
                {isSocialModalOpen && <ShareList listName={title} setSocialModalOpening={setSocialModalOpening} isSocialModalOpen={isSocialModalOpen} shareUrl={window.location.href}/>}
            </Suspense>

            <OuterContainer $playerState={{isPlayerFullMode, isPlayerOpen}} className="stationsList--outer--container">
                {
                    !loading ?
                    <Fragment>
                        <div id="stationsSectionHeader" className="flex-row">
                          {list?.length > 0 && title ? <h4 className="list--name">{title}</h4> : <span />}  
                            {(!areSavedStations && list?.length > 0) && <button onClick={() => setSocialModalOpening(true)} title="Share this list" className="social__share__btn">
                                <BsShareFill />
                            </button>}
                        </div>
                        <ul id="stationsList" onClick={onListClick}>
                            {
                                list && list.length > 0 ? list.map((item, index) => {
                                    return item && (
                                        <StationsListItem item={item} key={item.stationuuid} index={index} wholeList={list} areSavedStations={false}/>
                                    )
                                })
                                :
                                <EmptyResults msg={t("no_match_msg")} />
                            }  
                        </ul>


                    </Fragment>
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
    isPlayerFullMode: PropTypes.bool.isRequired,
    isPlayerOpen:  PropTypes.bool.isRequired,
    title:  PropTypes.string.isRequired,
    areSavedStations: PropTypes.bool.isRequired,
}
const mapStateToProps = state => {
    return {
        isPlayerFullMode: state[consts.MAIN].isPlayerFullMode,
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
    }
}

export default connect(mapStateToProps)(memo(StationsList));