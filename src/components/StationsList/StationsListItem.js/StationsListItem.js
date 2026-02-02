import React, { Fragment, useRef, useEffect, useState, memo, lazy, Suspense } from "react";
import "./StationsListItem.scss";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UPDATE_MEMORY } from "../../../store/actions/actions";
import { MAIN } from "../../../utilities/consts";
import { connect } from "react-redux";
import StationOptions from "../../StationOptions/StationOptions";
import { BsPlayFill, BsFillPauseFill, BsSoundwave} from "react-icons/bs";

const StationInfoModal = lazy(() => import("../../Modal/StationInfo/StationInfo"));

const StationsListItem = ({ item, index, updateFavs, wholeList, currentStationId, isAudioPlaying, isAudioBuffering, storageCopy }) => {
    const imgRef = useRef(null);
    const stationLocation = `${(item.state && item.country) ? item.state + ", " : item.state}${item.country}`;
    const [isPlaying, setPlaying] = useState(false);
    const [isLiked, setLikingState] = useState(false);
    const [isRecentlyPlayed, setRecentlyPlayed] = useState(false);
    const [isHoveredOn, setHovering] = useState(false);
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
            setLikingState(storageCopy?.favorites?.some(el => el.stationuuid === item.stationuuid));
            setRecentlyPlayed(storageCopy?.history?.some(el => el.stationuuid === item.stationuuid)); 
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

    const removeFromHistory = () => {
        updateFavs({ type: "delete", itemId: item.stationuuid, destination: "history" }); 
    }

    return (
        <Fragment>
            {/* modal(s) */}
            <Suspense fullback={<div>Loading...</div>}>
                {openInfoModal && <StationInfoModal wholeList={wholeList} isModalOpen={openInfoModal} setModalOpening={setInfoModal} itemObject={item} isAudioPlaying={isAudioPlaying} isPlaying={isPlaying}  />}
            </Suspense>

            <li id="stationsListItem" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className={`${isPlaying ? "active--station" : ""}`} data-item-id={item.id} data-liked={+isLiked}>
                <div className="stationsList--item--inner flex-row">
                    <div className="stationsList--item--left" data-action="togglePlaying">
                        <span className="station--number" >{ isHoveredOn ?  ((isPlaying && isAudioPlaying && !isAudioBuffering)  ? <BsFillPauseFill className="stations__item__media__btn"/> : <BsPlayFill className="stations__item__media__btn"/>) : (isPlaying && isAudioPlaying && !isAudioBuffering) ?
                            <BsSoundwave 
                                aria-label="Playing"
                                color="#fff"
                                size={20}
                            />
                            : `${index + 1}` }
                            </span>
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
                        <button data-action="toggleLiking" className="stationsList--item--like transparent_btn">
                            {
                                isLiked ?
                                    <AiFillHeart className="unlike favIcon" /> :
                                    <AiOutlineHeart className="like favIcon" />
                            }
                        </button>
                        <span className="options__btn">
                            <StationOptions
                                isRecentlyPlayed={isRecentlyPlayed}
                                isLiked={isLiked}
                                setInfoModal={setInfoModal}
                                item={item}
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
    const mainState = state[MAIN] || {};
    return {
        currentStationId: mainState.currentStationId ?? "",
        storageCopy: mainState.localStorageCopy,
        isAudioPlaying: mainState.isAudioPlaying ?? false,
        isAudioBuffering: mainState.currentBufferingAudio?.state ?? false
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateFavs: (payload) => dispatch({ type: UPDATE_MEMORY, payload }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(StationsListItem));