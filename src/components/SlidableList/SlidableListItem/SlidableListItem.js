import React, { useRef, useEffect, useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import "./SlidableListItem.scss";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import { connect } from "react-redux";
import * as actionTypes from "../../../store/actions/actions";
import PropTypes from "prop-types";
import { VscEllipsis } from "react-icons/vsc";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsPlayFill, BsFillPauseFill} from "react-icons/bs";
import * as consts from "../../../utilities/consts";
import StationOptions from "../../StationOptions/StationOptions";
import { BsSoundwave } from "react-icons/bs";
import { FaRegHourglassHalf } from "react-icons/fa6";


const StationInfoModal = lazy(() => import("../../Modal/StationInfo/StationInfo"));

const SlidableListItem = ({ item = {}, updateFavs, wholeList = [], favoritesList, historyList, currentStationId, isAudioPlaying, isAudioBuffering }) => {
    const imgRef = useRef(null);
    const stationLocation = `${(item.state && item.country) ? item.state+", ": item.state}${item.country}`;
    const [isLiked, setLikingState] = useState(false);
    const [isRecentlyPlayed, setRecentlyPlayed] = useState(false);
    const [openInfoModal, setInfoModal] = useState(false);

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
        setLikingState(favoritesList?.some(el => el.stationuuid === item.stationuuid));
        setRecentlyPlayed(historyList?.some(el => el.stationuuid === item.stationuuid));
    },[favoritesList, historyList, item.stationuuid]);

    const isPlaying = useMemo(() => (currentStationId === item.stationuuid), [currentStationId, item]);

    const removeFromHistory = useCallback(() => {
        updateFavs({ type: "delete", itemId: item.stationuuid, destination: "history" }); 
    }, [updateFavs, item.stationuuid]);
    return(
        <Auxiliary>
            <Suspense fullback={<div>Loading...</div>}>
                {openInfoModal && <StationInfoModal wholeList={wholeList} isModalOpen={openInfoModal} setModalOpening={setInfoModal} itemObject={item} isAudioPlaying={isAudioPlaying} isPlaying={isPlaying} />}
            </Suspense>
            <li className="slidableListItem" data-item-id={item.id} data-liked={+isLiked}>
                <div className="picture--container"> 
                    <div className="slidable--item--layout">
                        <div className="slidable--item--layout--inner">   
                        <span className="slidable__item__options__btn option__btn">
                            <StationOptions
                                isRecentlyPlayed={isRecentlyPlayed}
                                isLiked={isLiked}
                                setInfoModal={setInfoModal}
                                item={item}
                                removeFromHistory={removeFromHistory}
                                btnIcon={<VscEllipsis/>}
                            /> 
                        </span>
                            <button data-action="toggleLiking" className="transparent_btn">
                                {isLiked ? <AiFillHeart className="slidable__item__fav__btn option__btn unlike"/> : <AiOutlineHeart className="slidable__item__fav__btn option__btn"/> }
                            </button>
                            <button data-action="togglePlaying" aria-label={isPlaying ? "Pause" : "Play"} className="transparent_btn">
                                 {(isPlaying && isAudioPlaying && !isAudioBuffering) ? <BsFillPauseFill className="slidable__item__media__btn option__btn"/> : <BsPlayFill className="slidable__item__media__btn option__btn"/>}   
                            </button>
                        </div>
                    </div>
                    <img
                        src={defaultImg}
                        alt={item.name || "station"}
                        ref={imgRef}
                        loading="lazy"
                    />
                    { (isPlaying && isAudioPlaying && !isAudioBuffering) ?
                        <div className="music--anim--container">
                            <BsSoundwave 
                                aria-label="Playing"
                                color="var(--primary-clr)"
                                size={65}
                                style={{
                                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.9))",
                                }}
                            />
                        </div>
                        :
                        (isPlaying && isAudioBuffering) &&
                            <div className="music--anim--container">
                                <FaRegHourglassHalf
                                    aria-label="loading..."
                                    color="var(--primary-clr)"
                                    size={45}
                                    style={{
                                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.9))",
                                    }}
                                />
                            </div>
                    }
                </div>
                <div className="slidablelist--station--info">
                    <h5 className="station--name ellipsis-x1" title={item.name}>{item.name}</h5> 
                    <span className="station--location ellipsis-x1" title={stationLocation}>{stationLocation}</span>   
                </div>
            </li>
        </Auxiliary>
    )
};
SlidableListItem.propTypes = {
    wholeList: PropTypes.array.isRequired,
    updateFavs: PropTypes.func.isRequired,
    isAudioPlaying: PropTypes.bool.isRequired,
}
const mapStateToProps = state => {
    const mainState = state[consts.MAIN];
    return {
        currentStationId: mainState.currentStationId ?? "",
        isAudioPlaying: mainState.isAudioPlaying ?? false,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateFavs: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(SlidableListItem));