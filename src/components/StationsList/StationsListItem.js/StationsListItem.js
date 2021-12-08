import React, { Fragment, useRef, useEffect, useState, memo } from "react";
import "./StationsListItem.scss";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { trimText } from "../../../utilities/tools";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as actionTypes from "../../../store/actions/actions";
import { connect } from "react-redux";
import * as consts from "../../../utilities/consts";
import StationInfoModal from "../../Modal/StationInfo/StationInfo";

const StationsListItem = ({ item, index, updateFavs, changeCurrentPlaylist, wholeList, currentStationId, storageCopy }) => {
    const imgRef = useRef(null);
    const stationLocation = `${(item.state && item.country) ? item.state + ", " : item.state}${item.country}`;
    const [isPlaying, setPlaying] = useState(false);
    const [isLiked, setLikingState] = useState(false);
    const [isRecentlyPlayed, setRecentlyPlayed] = useState(false);
    const [openInfoModal, setInfoModal] = useState(false);

    useEffect(() => {
        if (imgRef && imgRef.current) {
            imgRef.current.addEventListener("error", () => {
                onImageLoadingFailure();
            });
        }
        return () => {
            imgRef.current = false;
        }
    }, []);
    useEffect(() => {
        if(storageCopy){
            storageCopy.favorites?.length > 0 && setLikingState(storageCopy.favorites.some(el => el.stationuuid === item.stationuuid));
            storageCopy.history?.length > 0 && setRecentlyPlayed(storageCopy.history.some(el => el.stationuuid === item.stationuuid)); 
        }
    },[storageCopy, item.stationuuid]);
    useEffect(() => {
        if (item.stationuuid) {
            const checkIfPlaying = currentStationId === item.stationuuid;
            setPlaying(checkIfPlaying);
        }
    }, [currentStationId, item]);

    const onImageLoadingFailure = () => {
        if (imgRef.current) {
            imgRef.current.src = defaultImg;
        }
    }

    const onLikingUnlikingStation = () => {
        console.log(item);
        if(isLiked){
            updateFavs({ type: "delete", itemId: item.stationuuid, destination: "favorites" });   
        }else{
            updateFavs({ type: "add", item, destination: "favorites" });   
        }
    }
    const removeFromHistory = () => {
        updateFavs({ type: "delete", itemId: item.stationuuid, destination: "history" }); 
    }
    const onOptionsChange = (e) => {
        const val = e.target.value;
        switch(val){
            case "more_info":
                console.log("met");
                setInfoModal(true);
            break;
            case "visit_homepage":
                if(item.homepage){
                    window.open(item.homepage,"_blank");
                }
            break;
            case "like_unlike":
                onLikingUnlikingStation();
            break;
            case "remove_from_history":
                removeFromHistory();
            break;
            default:
        }
    }
    return (
        <Fragment>
            {/* modal(s) */}
            {openInfoModal && <StationInfoModal isModalOpen={openInfoModal} setModalOpenning={setInfoModal} itemObject={item} />}

            <li id="stationsListItem" className={`${isPlaying ? "active--station" : ""}`}>
                <div className="stationsList--item--inner flex-row">
                    <div className="stationsList--item--left" onClick={() => !isPlaying && changeCurrentPlaylist({ list: wholeList, currentStationId: item.stationuuid })}>
                        <span className="station--number" data-attr={index + 1} data-playingstatus={isPlaying ? "■" : "▶"}></span>
                        <img
                            src={item.favicon}
                            alt={item.name || "station"}
                            ref={imgRef}
                            loading="lazy"
                        />
                        <div className="stationsList--item--info">
                            <h5 title={item.name} className="station--name">{trimText(item.name, 20)}</h5>
                            <span title={stationLocation} className="station--location">{trimText(stationLocation, 20)}</span>
                        </div>
                    </div>
                    <div className="stationsList--item--actions">
                        <span onClick={() => onLikingUnlikingStation()} className="stationsList--item--like">
                            {
                                isLiked ?
                                    <AiFillHeart className="unlike" /> :
                                    <AiOutlineHeart className="like" />
                            }

                        </span>
                        <span className="stationsList--item--select--container">
                            <select value={"hiddenoption"} onChange={(e) => onOptionsChange(e)}>
                                <optgroup label={`Options for "${item.name}"`}>
                                    <option value="hiddenoption" hidden="hidden" disabled="disabled">Please select..</option>
                                    <option value="more_info">More Info about {trimText(item.name, 17)}</option>
                                    {isRecentlyPlayed && <option value="remove_from_history">Remove from play history</option>}
                                    <option value="visit_homepage">Visit Homepage</option>
                                    <option value="like_unlike">{isLiked? "Unlike" : "Like"}</option>
                                </optgroup>
                                <option>Cancel</option>
                            </select>
                            <BsThreeDotsVertical />
                        </span>
                    </div>

                </div>
            </li>
        </Fragment>
    )
}
const mapStateToProps = state => {
    return {
        currentStationId: state[consts.MAIN].currentStationId || "",
        storageCopy: state[consts.MAIN].localStorageCopy
    }
}
const mapDispatchToProps = dispatch => {
    return {
        changeCurrentPlaylist: (payload) => dispatch({ type: actionTypes.CHANGE_CURRENT_PLAYLIST, payload }),
        updateFavs: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(StationsListItem));