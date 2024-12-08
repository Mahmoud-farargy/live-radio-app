import React, { Fragment, useRef, useEffect, useState, memo, useContext } from "react";
import "./StationsListItem.scss";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as actionTypes from "../../../store/actions/actions";
import { connect } from "react-redux";
import * as consts from "../../../utilities/consts";
import StationInfoModal from "../../Modal/StationInfo/StationInfo";
import StationOptions from "../../StationOptions/StationOptions";
import { AudioContext } from "../../PlayerContext/PlayerContext";
import { BsPlayFill, BsFillPauseFill} from "react-icons/bs";
import Loader from "react-loader-spinner";

const StationsListItem = ({ item, index, updateFavs, changeCurrentPlaylist, wholeList, currentStationId, isAudioPlaying, isAudioBuffering, storageCopy }) => {
    const imgRef = useRef(null);
    const stationLocation = `${(item.state && item.country) ? item.state + ", " : item.state}${item.country}`;
    const [isPlaying, setPlaying] = useState(false);
    const [isLiked, setLikingState] = useState(false);
    const [isRecentlyPlayed, setRecentlyPlayed] = useState(false);
    const [isHoveredOn, setHovering] = useState(false);
    const [openInfoModal, setInfoModal] = useState(false);
    const { playAudio, pauseAudio } = useContext( AudioContext );

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
        if(isLiked){
            updateFavs({ type: "delete", itemId: item.stationuuid, destination: "favorites" });   
        }else{
            updateFavs({ type: "add", item, destination: "favorites" });   
        }
    }
    const removeFromHistory = () => {
        updateFavs({ type: "delete", itemId: item.stationuuid, destination: "history" }); 
    }
    const handleStationPlaying = () => {
            if(isPlaying && isAudioPlaying){
                !isAudioBuffering && pauseAudio();
            }else{
                changeCurrentPlaylist({list: wholeList, currentStationId: item.stationuuid});
                playAudio();
            }
    }
    return (
        <Fragment>
            {/* modal(s) */}
            {openInfoModal && <StationInfoModal isModalOpen={openInfoModal} setModalOpenning={setInfoModal} itemObject={item}  handleStationPlaying={handleStationPlaying} isAudioPlaying={isAudioPlaying} isPlaying={isPlaying}  />}

            <li id="stationsListItem" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className={`${isPlaying ? "active--station" : ""}`}>
                <div className="stationsList--item--inner flex-row">
                    <div className="stationsList--item--left" onClick={() => handleStationPlaying()}>
                        <span className="station--number" >{ isHoveredOn ?  ((isPlaying && isAudioPlaying && !isAudioBuffering)  ? <BsFillPauseFill className="stations__item__media__btn"/> : <BsPlayFill className="stations__item__media__btn"/>) : (isPlaying && isAudioPlaying && !isAudioBuffering) ?
                        <Loader
                            type="Audio"
                            arialLabel="loading-indicator"
                            color="var(--ultra-white)"
                            height={15}
                            width={15} /> :`${index + 1}` }</span>
                        <span className="image--container">
                            <img
                                src={defaultImg}
                                alt={item.name || "station"}
                                ref={imgRef}
                                loading="lazy"
                            />  
                        </span>

                        <div className="stationsList--item--info">
                            <h5 title={item.name} className="station--name ellipsis-x1">{item.name}</h5>
                            <span title={stationLocation} className="station--location ellipsis-x1">{stationLocation}</span>
                        </div>
                    </div>
                    <div className="stationsList--item--actions">
                        <span onClick={() => onLikingUnlikingStation()} className="stationsList--item--like">
                            {
                                isLiked ?
                                    <AiFillHeart className="unlike favIcon" /> :
                                    <AiOutlineHeart className="like favIcon" />
                            }

                        </span>
                        <span className="options__btn">
                            <StationOptions
                                isRecentlyPlayed={isRecentlyPlayed}
                                isLiked={isLiked}
                                setInfoModal={setInfoModal}
                                item={item}
                                onLikingUnlikingStation={onLikingUnlikingStation}
                                removeFromHistory={removeFromHistory}
                                btnIcon={<BsThreeDotsVertical />}
                            />   
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
        storageCopy: state[consts.MAIN].localStorageCopy,
        isAudioPlaying: state[consts.MAIN].isAudioPlaying || false,
        isAudioBuffering: state[consts.MAIN].currentBufferingAudio?.state || false
    }
}
const mapDispatchToProps = dispatch => {
    return {
        changeCurrentPlaylist: (payload) => dispatch({ type: actionTypes.CHANGE_CURRENT_PLAYLIST, payload }),
        updateFavs: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(StationsListItem));