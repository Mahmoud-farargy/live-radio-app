import React from 'react';
import { trimText } from "../../utilities/tools";
import { useTranslation } from "react-i18next";

const StationOptions = ({isRecentlyPlayed, isLiked, setInfoModal,item, onLikingUnlikingStation, removeFromHistory, btnIcon}) => {
    const { t } = useTranslation();
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
                <optgroup label={`${t("station_options.options_for")}"${trimText(item.name, 10)}"`}>
                    <option value="hiddenoption" hidden="hidden" disabled="disabled">{t("station_options.default_option")}..</option>
                    <option value="more_info">{t("station_options.more_about")}{trimText(item.name, 10)}</option>
                    {isRecentlyPlayed && <option value="remove_from_history">{t("station_options.remove_from_history")}</option>}
                    <option value="visit_homepage">{t("station_options.visit_homepage")}</option>
                    <option value="like_unlike">{isLiked? t("station_options.liking.unlike"): t("station_options.liking.like")}</option>
                </optgroup>
                <option>{t("station_options.cancel")}</option>
            </select>
            {btnIcon}
        </span>
    )
}

export default StationOptions;