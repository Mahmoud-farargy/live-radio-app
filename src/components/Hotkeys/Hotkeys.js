import React from "react";
import { useTranslation } from "react-i18next";
import "./hotKeys.scss";

const Hotkeys = () => {
    const { t } = useTranslation();
    const keysList = Object.freeze([
        {id: "fhsifhous", name: t("hotkeys.play_pause.title"), btnKey: "Space", desciption: t("hotkeys.play_pause.description")},
        {id: "ow9if98nf", name: t("hotkeys.volume_up.title"), btnKey: "+", desciption: t("hotkeys.volume_up.description")},
        {id: "ofiw8fowf", name: t("hotkeys.volume_down.title"), btnKey: "-", desciption: t("hotkeys.volume_down.description")},
        {id: "e7tfwojgw", name: t("hotkeys.prev_station.title"), btnKey: "P", desciption: t("hotkeys.prev_station.description")},
        {id: "woigu9wgh", name: t("hotkeys.nxt_station.title"), btnKey: "N", desciption: t("hotkeys.nxt_station.description")},
        {id: "woigu9wgh", name: t("hotkeys.nxt_station.title"), btnKey: "N", desciption: t("hotkeys.nxt_station.description")},
        {id: "hiepoweff", name: t("hotkeys.favorite_unfavorite.title"), btnKey: "F", desciption: t("hotkeys.favorite_unfavorite.description")},
    ]);
    return (
        <div id="hotKeys">
        {
            keysList && keysList.length > 0 
            && keysList.map(item => item &&(
                <div key={item.id} className="flex-row hotkey--inner">
                    <div className={`${item.id === 'fhsifhous' ? "space__hotkey" : ""} key__item`}>
                        <span>{item.btnKey}</span>
                    </div>
                    <div className="hotkey--info flex-column">
                        <h4>{item.name}</h4>
                        <small>{item.desciption}</small>
                    </div>
                </div>
            ))
        }
        </div>
    )
};
export default Hotkeys;