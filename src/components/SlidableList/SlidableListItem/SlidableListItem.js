import React, { useRef, useEffect } from "react";
import Auxiliary from "../../HOC/Auxiliary";
import "./SlidableListItem.scss";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import { connect } from "react-redux";
import * as actionTypes from "../../../store/actions/actions";
import PropTypes from "prop-types";
import { trimText } from "../../../utilities/tools";

const SlidableListItem = ({ item, changeCurrentPlaylist, wholeList }) => {
    const imgRef = useRef(null);
    const stationLocation = `${(item.state && item.country) ? item.state+", ": item.state}${item.country}`;
    
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
    const handleStationPlaying = () => {
        changeCurrentPlaylist({list: wholeList, currentStationId: item.stationuuid});
    }
    return(
        <Auxiliary>
            <li onClick={() => handleStationPlaying()} id="slidableListItem">
                <div className="picture--container">
                    <img
                        src={item.favicon}
                        alt={item.name || "station"}
                        ref={imgRef}
                        loading="lazy"
                    />
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
    changeCurrentPlaylist: PropTypes.func.isRequired
}
SlidableListItem.defaultProps = {
    item: {},
    wholeList: [],
}
const mapDispatchToProps = dispatch => {
    return {
        changeCurrentPlaylist: (payload) => dispatch({type: actionTypes.CHANGE_CURRENT_PLAYLIST, payload})
    }
}
export default connect(null, mapDispatchToProps)(SlidableListItem);