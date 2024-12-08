import React, { useState, useEffect } from 'react';
import IosButton from '../formInputs/IosButton';
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actions";
import * as Consts from "../../utilities/consts";
import { notify } from "../../utilities/tools";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { BsCheck } from 'react-icons/bs';

const Settings = ({ updateMemo, localMemory, switchToMainSlide }) => {
    const { t } = useTranslation();
    const [formState, setFormState] = useState({
        sleepTimer: false,
        sleepTimeout: 1,
        loadIcons: true,
        httpsOnly: true,
        defaultVolume: 100,
        choosenLangauge: "en",
    });
    const savedSettings = localMemory.settings;
    useEffect(() => {
       
        if(savedSettings && Object.keys(savedSettings).length >0) {
            let stateCopy = JSON.parse(JSON.stringify(formState));
            Object.keys(stateCopy).forEach((key) => (
                 stateCopy[key] = savedSettings.hasOwnProperty(key) ? savedSettings[key] : formState[key]
            ));
          setFormState(stateCopy);
        }
    },[savedSettings]);
    const onInputChange = (e) => {
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
        { id: "w9yeghike", name: "chinese", label: "Chinese", code: "cn" },
        { id: "powyighek", name: "german", label: "German", code: "de" },
        { id: "opwhgegeg", name: "italian", label: "Italian", code: "it" },
        { id: "poiegbguq", name: "indian", label: "Indian", code: "hi" },
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
            notify(`${t("alerts.saved")}.`, "success");
            switchToMainSlide();
        }
    };

    return (
        <form id="settings" onSubmit={(e) => onFormSubmission(e)}>
            <div className="settings--input--group">
                <IosButton onCheckChange={onInputChange} val={{ value: formState.sleepTimer, name: "sleepTimer", description: t("settings.sleep_timer.description") }} label={t("settings.sleep_timer.title")} />
                {
                    formState.sleepTimer &&
                    <div className="vertical--group flex-column">
                        <label htmlFor="sleepTimeout">{t("settings.sleep_timeout.description")}</label>
                        <input type="number" onChange={onInputChange} value={formState.sleepTimeout} name="sleepTimeout" placeholder={t("settings.sleep_timeout.title")} className="primary__input" min={1} max={200} />
                    </div>
                }
            </div>
            <div className="settings--input--group">
                <IosButton onCheckChange={onInputChange} val={{ value: formState.httpsOnly, name: "httpsOnly", description: t("settings.https_only.description") }} label={t("settings.https_only.title")} />
            </div>
            <div className="settings--input--group">
                <IosButton onCheckChange={onInputChange} val={{ value: formState.loadIcons, name: "loadIcons", description: t("settings.load_icons.description") }} label={t("settings.load_icons.title")} />
            </div>
            <div className="settings--input--group">
                <div className="settings--select--group flex-row">
                    <label htmlFor="choosenLangauge">{t("settings.change_langauge.title")}</label>
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
            <button type="submit" className="primary__btn flex-row flex-nowrap align-items-center">
                <BsCheck size={20}/>
                <span>{t("settings.save_button_title")}</span>
            </button>
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