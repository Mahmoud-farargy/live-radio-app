import React, { useState, useEffect } from 'react';
import IosButton from '../formInputs/IosButton';
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actions";
import * as Consts from "../../utilities/consts";
import { notify } from "../../utilities/tools";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { BsCheck } from 'react-icons/bs';
import { selectTheme } from "../../utilities/tools";
import CreatableSelect from 'react-select/creatable';

const Settings = ({ updateMemo, localMemory, switchToMainSlide }) => {
    const { t } = useTranslation();
    const [formState, setFormState] = useState({
        sleepTimer: false,
        sleepTimeout: 1,
        loadIcons: false,
        httpsOnly: true,
        defaultVolume: 100,
        chosenLanguage: { name: "english", label: "English", value: "en" },
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
        { name: "english", label: "English", value: "en" },
        { name: "spanish", label: "Spanish", value: "es" },
        { name: "french", label: "French", value: "fr" },
        { name: "chinese", label: "Chinese", value: "cn" },
        { name: "german", label: "German", value: "de" },
        { name: "italian", label: "Italian", value: "it" },
        { name: "indian", label: "Indian", value: "hi" },
    ])
    const onFormSubmission = (e) => {
        e.preventDefault();
         
        if(formState && Object.keys(formState).length > 0){
         
            const newObject = {
                sleepTimer: formState.sleepTimer,
                sleepTimeout: +formState.sleepTimeout > 0 ? parseInt(formState.sleepTimeout) : 1,
                loadIcons: formState.loadIcons,
                httpsOnly: formState.httpsOnly,
                chosenLanguage: formState.chosenLanguage
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
                <IosButton onCheckChange={onInputChange} disabled val={{ value: formState.loadIcons, name: "loadIcons", description: t("settings.load_icons.description") }} label={t("settings.load_icons.title")} />
            </div>
            <div className="settings--input--group">
                <CreatableSelect
                    classNamePrefix="app-select"
                    isClearable={false}
                    name="chosenLanguage"
                    onChange={(e) => onInputChange({target: {value: e, type: "", name: "chosenLanguage"}})}
                    theme={selectTheme}
                    value={formState.chosenLanguage}
                    placeholder={t("settings.change_langauge.title")}
                    defaultValue={formState.chosenLanguage}
                    menuPlacement="top"
                    options={languageOptions}
                />

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