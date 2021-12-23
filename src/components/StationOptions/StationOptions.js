import React from 'react';
import { trimText } from "../../utilities/tools";

const StationOptions = ({isRecentlyPlayed, isLiked, setInfoModal,item, onLikingUnlikingStation, removeFromHistory, btnIcon}) => {
    const onOptionsChange = (e) => {
        const val = e.target.value;
        switch(val){
            case "more_info":
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
        <span className="stationsList--item--select">
            <select value={"hiddenoption"} onChange={(e) => onOptionsChange(e)}>
                <optgroup label={`Options for "${trimText(item.name, 10)}"`}>
                    <option value="hiddenoption" hidden="hidden" disabled="disabled">Please select..</option>
                    <option value="more_info">More Info about {trimText(item.name, 10)}</option>
                    {isRecentlyPlayed && <option value="remove_from_history">Remove from play history</option>}
                    <option value="visit_homepage">Visit Homepage</option>
                    <option value="like_unlike">{isLiked? "Unlike" : "Like"}</option>
                </optgroup>
                <option>Cancel</option>
            </select>
            {btnIcon}
        </span>
    )
}

export default StationOptions;