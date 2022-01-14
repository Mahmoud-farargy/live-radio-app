import React, { useRef, useEffect, useState, useContext } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import "./SlidableListItem.scss";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import { connect } from "react-redux";
import * as actionTypes from "../../../store/actions/actions";
import PropTypes from "prop-types";
import { trimText } from "../../../utilities/tools";
import { VscEllipsis } from "react-icons/vsc";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsPlayFill, BsFillPauseFill} from "react-icons/bs";
import * as consts from "../../../utilities/consts";
import StationOptions from "../../StationOptions/StationOptions";
import StationInfoModal from "../../Modal/StationInfo/StationInfo";
import { AudioContext } from "../../PlayerContext/PlayerContext";
import Loader from "react-loader-spinner";

const SlidableListItem = ({ item, changeCurrentPlaylist, updateFavs,wholeList, storageCopy, currentStationId, isAudioPlaying, isAudioBuffering }) => {
    const imgRef = useRef(null);
    const stationLocation = `${(item.state && item.country) ? item.state+", ": item.state}${item.country}`;
    const [isLiked, setLikingState] = useState(false);
    const [isBuffering, setBuffering] = useState(true);
    const [isPlaying, setPlaying] = useState(false);
    const [isRecentlyPlayed, setRecentlyPlayed] = useState(false);
    const [openInfoModal, setInfoModal] = useState(false);
    const { playAudio, pauseAudio } = useContext( AudioContext );
    useEffect(() => {
        if(imgRef && imgRef.current){
            imgRef.current.addEventListener("error", () => {
                onImageLoadingFailure();
            })
        }
        return () =>{
            imgRef.current = false;
        }
    },[]);
    const onImageLoadingFailure = () =>{
        if(imgRef.current){
            imgRef.current.src = defaultImg;
        }
    }

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
    useEffect(() => {
        !isAudioBuffering && setBuffering(false);
    },[isAudioBuffering]);
    const onLikingUnlikingStation = () => {
        if(isLiked){
            updateFavs({ type: "delete", itemId: item.stationuuid, destination: "favorites" });   
        }else{
            updateFavs({ type: "add", item, destination: "favorites" });   
        }
    } 
    const handleStationPlaying = () => {
            if(isPlaying && isAudioPlaying){
                !isAudioBuffering && pauseAudio();
            }else{           
                changeCurrentPlaylist({list: wholeList, currentStationId: item.stationuuid});
                playAudio();  
            }
    }
    const removeFromHistory = () => {
        updateFavs({ type: "delete", itemId: item.stationuuid, destination: "history" }); 
    }
    return(
        <Auxiliary>
            {openInfoModal && <StationInfoModal isModalOpen={openInfoModal} setModalOpenning={setInfoModal} itemObject={item} handleStationPlaying={handleStationPlaying} isAudioPlaying={isAudioPlaying} isPlaying={isPlaying} />}
            <li id="slidableListItem">
                <div className="picture--container"> 
                    <div className="slidable--item--layout">
                        <div className="slidable--item--layout--inner">   
                        <span className="slidable__item__options__btn option__btn">
                            <StationOptions
                                isRecentlyPlayed={isRecentlyPlayed}
                                isLiked={isLiked}
                                setInfoModal={setInfoModal}
                                item={item}
                                onLikingUnlikingStation={onLikingUnlikingStation}
                                removeFromHistory={removeFromHistory}
                                btnIcon={<VscEllipsis/>}
                            /> 
                        </span>
                            <span onClick={() => onLikingUnlikingStation()}>
                                {isLiked ? <AiFillHeart className="slidable__item__fav__btn option__btn unlike"/> : <AiOutlineHeart className="slidable__item__fav__btn option__btn"/> }
                            </span>
                            <span onClick={() => handleStationPlaying()}>
                                 {(isPlaying && isAudioPlaying && !isAudioBuffering) ? <BsFillPauseFill className="slidable__item__media__btn option__btn"/> : <BsPlayFill className="slidable__item__media__btn option__btn"/>}   
                            </span>
                        </div>
                    </div>
                    <img
                        src={item.favicon}
                        alt={item.name || "station"}
                        ref={imgRef}
                        loading="lazy"
                    />
                    { (isPlaying && isAudioPlaying && !isAudioBuffering) ?
                        <div className="music--anim--container">
                            <Loader
                            type="Audio"
                            arialLabel="loading-indicator"
                            color="var(--primary-clr)"
                            height={60}
                            width={60} />  
                        </div>
                        :
                        (isPlaying && isBuffering) &&
                            <div className="music--anim--container">
                                <Loader
                                type="Rings"
                                arialLabel="loading-indicator"
                                color="var(--primary-clr)"
                                height={60}
                                width={60} />  
                            </div>
                    }
                </div>
                <div className="slidablelist--station--info">
                    <h5 className="station--name" title={item.name}>{trimText(item.name, 23)}</h5> 
                    <span className="station--location" title={stationLocation}>{trimText(stationLocation,23)}</span>   
                </div>
            </li>
        </Auxiliary>
    )
};
SlidableListItem.propTypes = {
    item: PropTypes.object.isRequired,
    wholeList: PropTypes.array.isRequired,
    changeCurrentPlaylist: PropTypes.func.isRequired,
    updateFavs: PropTypes.func.isRequired,
    isAudioPlaying: PropTypes.bool.isRequired,
    isAudioBuffering: PropTypes.bool.isRequired,
    storageCopy: PropTypes.object.isRequired
}
SlidableListItem.defaultProps = {
    item: {},
    wholeList: [],
}
const mapStateToProps = state => {
    return {
        currentStationId: state[consts.MAIN].currentStationId || "",
        storageCopy: state[consts.MAIN].localStorageCopy || {},
        isAudioPlaying: state[consts.MAIN].isAudioPlaying || false,
        isAudioBuffering: state[consts.MAIN].isAudioBuffering || false
    }
}
const mapDispatchToProps = dispatch => {
    return {
        changeCurrentPlaylist: (payload) => dispatch({type: actionTypes.CHANGE_CURRENT_PLAYLIST, payload}),
        updateFavs: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SlidableListItem);