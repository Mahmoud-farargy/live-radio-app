import React, { useState, useEffect } from 'react';
import IosButton from '../formInputs/IosButton';
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actions";
import * as Consts from "../../utilities/consts";
import { notify } from "../../utilities/tools";
import PropTypes from "prop-types";

const Settings = ({ updateMemo, localMemory, switchToMainSlide }) => {
    const [formState, setFormState] = useState({
        sleepTimer: false,
        sleepTimeout: 1,
        loadIcons: true,
        httpsOnly: false,
        defaultVolume: 100,
        choosenLangauge: "en",
    });
    useEffect(() => {
        const savedSettings = localMemory.settings;
        if(savedSettings && Object.keys(savedSettings).length >0) {
            console.log(savedSettings);
            let stateCopy = JSON.parse(JSON.stringify(formState));
            Object.keys(stateCopy).forEach((key) => (
                 stateCopy[key] = savedSettings.hasOwnProperty(key) ? savedSettings[key] : formState[key]
            ));
          setFormState(stateCopy);
        }
    },[]);
    const onInputChange = (e) => {
        console.log(e.target.name)
        const target = e.target;
        const name = target.name;
        const type = target.type;
        const val = type === "checkbox" || type === "radio" ? target.checked : target.value;
        if (target && name && typeof val !== "undefined") {
            setFormState({
                ...formState,
                [name]: val
            });
        }

    }
    const languageOptions = Object.freeze([
        { id: "fu09ef0fw", name: "english", label: "English", code: "en" },
        { id: "ifuwfwgwh", name: "spanish", label: "Spanish", code: "es" },
        { id: "pgwug9pwr", name: "french", label: "French", code: "fr" },
    ])
    const onFormSubmission = (e) => {
        e.preventDefault();
         
        if(formState && Object.keys(formState).length > 0){
         
            const newObject = {
                sleepTimer: formState.sleepTimer,
                sleepTimeout: +formState.sleepTimeout > 0 ? parseInt(formState.sleepTimeout) : 1,
                loadIcons: formState.loadIcons,
                httpsOnly: formState.httpsOnly,
                choosenLangauge: formState.choosenLangauge
            }
            updateMemo({type: "set", newObject, destination: "settings"});
            notify("Saved.", "success");
            switchToMainSlide();
        }
    };

    return (
        <form id="settings" onSubmit={(e) => onFormSubmission(e)}>
            <div className="settings--input--group">
                <IosButton onCheckChange={onInputChange} val={{ value: formState.sleepTimer, name: "sleepTimer", description: "Stops the current stream automatically after a certain number of minutes." }} label="Sleep timer" />
                {
                    formState.sleepTimer &&
                    <div className="vertical--group flex-column">
                        <label htmlFor="sleepTimeout">Stop stream after (min)</label>
                        <input type="number" onChange={onInputChange} value={formState.sleepTimeout} name="sleepTimeout" placeholder="Sleep timeout" className="primary__input" min={1} max={200} />
                    </div>
                }
            </div>
            <div className="settings--input--group">
                <IosButton onCheckChange={onInputChange} val={{ value: formState.httpsOnly, name: "httpsOnly", description: "Load https requests only (more secure, less results)." }} label="HTTPS requests only" />
            </div>
            <div className="settings--input--group">
                <IosButton onCheckChange={onInputChange} val={{ value: formState.loadIcons, name: "loadIcons", description: "Load station icons (if turned off, the app will load faster)." }} label="Load icons" />
            </div>
            <div className="settings--input--group">
                <div className="settings--select--group flex-row">
                    <label htmlFor="choosenLangauge">Change language</label>
                    <select onChange={onInputChange}  value={formState.choosenLangauge} name="choosenLangauge" id="choosenLangauge">
                        {
                            languageOptions && languageOptions.length > 0 &&
                            languageOptions.map((item) => {
                                return (
                                    <option key={item.id} value={item.code}>{item.label}</option>
                                )
                            })
                        }
                    </select>
                </div>

            </div>
            <input type="submit" value="Save" className="primary__btn" />
        </form>
    )
}
Settings.propTypes = {
    updateMemo: PropTypes.func.isRequired,
    localMemory: PropTypes.object.isRequired,
    switchToMainSlide: PropTypes.func.isRequired,
}
const mapStateToProps = state => {
    return {
         localMemory: state[Consts.MAIN].localStorageCopy
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateMemo: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);