import React from "react";
import "./hotKeys.scss";

const Hotkeys = () => {
    const keysList = Object.freeze([
        {id: "fhsifhous", name: "Play/pause",btnKey: "Space", desciption: "Start or pause playing the most recently selected station."},
        {id: "ow9if98nf", name: "Volume up",btnKey: "+", desciption: "Increase the volume by 10%."},
        {id: "ofiw8fowf", name: "Volume down",btnKey: "-", desciption: "Decrease the volume by 10%."},
        {id: "e7tfwojgw", name: "Previous station",btnKey: "P", desciption: "Switch to the previous station in the current list."},
        {id: "woigu9wgh", name: "Next station",btnKey: "N", desciption: "Switch to the next station in the current list."},
        {id: "948gheoij", name: "Reload",btnKey: "R", desciption: "Reload the current station."},
    ]);
    return (
        <>
        {
            keysList && keysList.length > 0 
            && keysList.map(item => item &&(
                <div key={item.id} id="hotKeys" className="flex-row">
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
        </>
    )
};
export default Hotkeys;