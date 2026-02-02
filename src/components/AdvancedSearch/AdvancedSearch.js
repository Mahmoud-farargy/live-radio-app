import React, { useState, useCallback, useEffect, memo, useRef } from "react";
import { MdFilterAlt } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import MultiInputSelect from "../../components/formInputs/MultiTextInput";
import CreatableSelect from 'react-select/creatable';
import { IoMdPricetag } from "react-icons/io";
import { BiStation, BiSearch } from "react-icons/bi";
import { selectTheme, lowerString, upperString } from "../../utilities/tools";
import api from "../../services/api";
import * as consts from "../../utilities/consts";
import { useNavigate } from "react-router-dom";
import countriesListJSON from "../../info/countriesList.json";
import { serialize } from "../../utilities/tools";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IosButton from "../../components/formInputs/IosButton";
import "./AdvancedSearch.scss";

const AdvancedSearch = ({closeSidebarOnMobile}) => {
    const navigate = useNavigate();
    const _isMounted = useRef(true);
    const { t } = useTranslation();
    // selected option
    const [formState, setFormState] = useState({
        tags: [],
        country: { value: "all countries", label: t("advanced_search.filter_default_labels.all_countries"), name: "country" },
        state: { value: "all states", label: t("advanced_search.filter_default_labels.all_states"), name: "state" },
        language: { value: "all languages", label: t("advanced_search.filter_default_labels.all_languages"), name: "language" },
        order: { value: "normal", label: t("advanced_search.sort_by_options.defaultLabel"), name: "order" },
        reverse: true,
        stationName: ""
    });
    // options
    const [languageOptions, setLanguagesOption] = useState(
        { list: [{ value: "all languages", label: t("advanced_search.filter_default_labels.all_languages"), name: "language" }], isLoading: false }
        );
    const [countriesOptions, setCountriesOption] = useState(
        { list: [{ value: "all countries", label: t("advanced_search.filter_default_labels.all_countries"), name: "country" }], isLoading: false }
        );
    const [statesOptions, setStatesOption]= useState(
        { list: [{ value: "all states", label: t("advanced_search.filter_default_labels.all_states"), name: "state" }], isLoading: false }
        );
    const ordersOptions = {
            list: [{ value: "normal", label: t("advanced_search.sort_by_options.defaultLabel"), name: "order" },
            { value: "votes", label: t("advanced_search.sort_by_options.votes"), name: "order"},
            { value: "name", label: t("advanced_search.sort_by_options.name"), name: "order"},
            { value: "tag", label: t("advanced_search.sort_by_options.tag"), name: "order"},
            { value: "country", label: t("advanced_search.sort_by_options.country"), name: "order"},
            { value: "state", label: t("advanced_search.sort_by_options.state"), name: "order"},
            { value: "language", label: t("advanced_search.sort_by_options.language"), name: "order"},
            { value: "codec", label: t("advanced_search.sort_by_options.codec"), name: "order"},
            { value: "bitrate", label: t("advanced_search.sort_by_options.bitrate"), name: "order"},
            { value: "lastcheckok", label: t("advanced_search.sort_by_options.last_check_ok"), name: "order"},
            { value: "lastchecktime", label:  t("advanced_search.sort_by_options.last_check_time"), name: "order"},
            { value: "clickcount", label: t("advanced_search.sort_by_options.click_count"), name: "order"},
            { value: "random", label: t("advanced_search.sort_by_options.random"), name: "order"}]
            , isLoading: false
        };
    const getSingular = (plural) => {
        switch (plural) {
            case "countries":
                return "country";
            case "states":
                return "state";
            case "languages":
                return "language";
            default: return "countries";
        }
    }
    const reformatData = (res, keyName) => {
        if (!Array.isArray(res) || !typeof keyName === "string") return;
        return res && res.length > 0 &&
            res.map((item) => {
                if (item && item.hasOwnProperty("name") && typeof item.name === "string") {
                    return {
                        value: item.name,
                        label: keyName === "countries" ? (countriesListJSON.filter(el => upperString(el.code) === upperString(item.name)).pop()?.name || item.name) : item.name,
                        name: getSingular(keyName)
                    }
                } else {
                    return {};
                }
            });
    }
    const handleResponse = ({ res, keyName }) => {
        if (res.data) {
            const formattedResponse = reformatData(res.data, keyName);
            if (formattedResponse && typeof formattedResponse === "object") {
                
                switch(keyName){
                    case "countries":
                        setCountriesOption({list: [{ value: `all ${keyName}`, label: t("advanced_search.filter_default_labels.all_countries"), name: getSingular(keyName) }, ...formattedResponse.sort((a,b) => b.value - a.value )], isLoading: false});
                    break;
                    case "languages":                        
                        setLanguagesOption({list: [{ value: `all ${keyName}`, label: t("advanced_search.filter_default_labels.all_languages"), name: getSingular(keyName) }, ...formattedResponse], isLoading: false});
                    break;
                    case "states":
                        setStatesOption({list: [{ value: `all ${keyName}`, label: t("advanced_search.filter_default_labels.all_states"), name: getSingular(keyName) }, ...formattedResponse], isLoading: false});
                    break;
                    default:
                        setCountriesOption({list: [{ value: `all ${keyName}`, label: t("advanced_search.filter_default_labels.all_countries"), name: getSingular(keyName) }, ...formattedResponse], isLoading: false});
                }
            }
        }
    }
    const getOptions = ({path, name}) => {
        if(path){
            api().get(path).then((res) => {
                if(_isMounted.current){
                    handleResponse({ res, keyName: name });
                }
            }).catch(() => {
                if(_isMounted.current){
                    console.error();
                }
            });    
        }

    }
    useEffect(() => {
        const fetchOptions = Object.freeze(["languages", "countries"]);
        fetchOptions && fetchOptions.length > 0 &&
            fetchOptions.forEach(item => {
                if (item === "countries") {

                    getOptions({path: "countrycodes", name: item});

                }else if(item === "languages"){
                     getOptions({path: item, name: item});
                }
            });
        return () => {
            _isMounted.current = false;
        }
    }, []); 
    useEffect(() => {
        if (formState.country.value && formState.country.value !== "all countries") {
            getOptions({path: `/states/${formState.country?.value}`, name: "states"});
        }
    }, [formState.country]);
    const onFormSubmission = (x) => {
        x.preventDefault();

        if(Object.values(formState).some(el => el !== undefined)){
                if(typeof formState !== "object") return ;
                const newVal = (val) => {
                    const newValue = typeof val === "string" ? lowerString(val) : val;
                    return (newValue === undefined || newValue === "all countries" || newValue === "all states" || newValue === "all languages" || newValue === "normal") ? "" : newValue;
                }
               
                const newObject = {
                    ...((formState.tags && formState.tags.length > 0) && {tagList: formState.tags.join(", ")}),
                    ...(newVal(formState.country.value) && {countrycode: newVal(formState.country.value)}),
                    ...(newVal(formState.state.value) && {state: newVal(formState.state.value)}),
                    ...(newVal(formState.language.value) && {language: newVal(formState.language.value)}),
                    ...(newVal(formState.order.value) && {order: newVal(formState.order.value)}),
                    ...(formState.reverse === true && {reverse: formState.reverse}),
                    ...(formState.stationName && {name: formState.stationName})
                }
                if(Object.keys(newObject).length > 0){
                    navigate(`${consts.SEARCH}?${serialize(newObject)}`);
                }
                
                closeSidebarOnMobile();
        }
    }
    const getTags = useCallback((arr) => {
        if (Array.isArray(arr)) {
            setFormState({
                ...formState,
                tags: arr
            });
        }
    }, [formState]);
    const onInputChange = (val) => {
        if (!val?.name) return;
        setFormState({
            ...formState,
            [val.name]: val?.type === "checkbox" || val.type === "text" ? val?.value : val
        })
    };

    return (
        <div id="advancedSearch">
                <form className="advanced--search--form" onSubmit={(k) => onFormSubmission(k)}>
                    <div className="search--input--group">
                        <span className="input--label flex-row"><BiStation /> <h5>{t("advanced_search.station_name.title")}:</h5></span>
                        <input type="text" onChange={(e) => onInputChange({name: "stationName", value: e.target.value, type: "text"})} name="stationName" value={formState.stationName} className="primary__input" placeholder={t("advanced_search.station_name.placeholder")} />
                    </div>
                    <div className="search--input--group">
                        <span className="input--label flex-row"><IoMdPricetag /> <h5>{t("advanced_search.tags.title")}:</h5></span>
                        <MultiInputSelect getTags={getTags} placeholder={t("advanced_search.tags.placeholder")} translate={t} />
                    </div>
                    <div className="search--input--group search--filters">
                        <span className="input--label flex-row"><MdFilterAlt /> <h5>{t("advanced_search.filters.title")}:</h5></span>
                        <div className="search--select--input">
                            <CreatableSelect
                                classNamePrefix="app-select"
                                isClearable={false}
                                name="country"
                                onChange={onInputChange}
                                theme={selectTheme}
                                value={formState.country}
                                placeholder="Countries"
                                isLoading={countriesOptions?.isLoading}
                                options={countriesOptions?.list}
                            />
                        </div>
                        <div className="search--select--input">
                            <CreatableSelect
                                classNamePrefix="app-select"
                                isClearable={false}
                                name="state"
                                onChange={onInputChange}
                                theme={selectTheme}
                                value={formState.state}
                                placeholder="States"
                                isLoading={statesOptions?.isLoading}
                                isDisabled={!formState.country.value || formState.country.value === "all countries"}
                                options={statesOptions?.list}
                            />
                        </div>
                        <div className="search--select--input">
                            <CreatableSelect
                                classNamePrefix="app-select"
                                isClearable={false}
                                name="language"
                                onChange={onInputChange}
                                theme={selectTheme}
                                value={formState.language}
                                placeholder="Languages"
                                isLoading={languageOptions?.isLoading}
                                options={languageOptions?.list}
                            />
                        </div>
                    </div>
                    <div className="search--input--group">
                        <span className="input--label flex-row"><FaSort /> <h5>{t("advanced_search.sort_by.title")}:</h5></span>
                        <div className="search--select--input">
                            <CreatableSelect
                                classNamePrefix="app-select"
                                isClearable={false}
                                name="order"
                                onChange={onInputChange}
                                theme={selectTheme}
                                value={formState.order}
                                placeholder={t("advanced_search.sort_by.placeholder")}
                                defaultValue="Normal"
                                isLoading={ordersOptions.isLoading}
                                options={ordersOptions.list}
                                menuPlacement="top"
                            />
                        </div>
                        <IosButton onIOSChange={onInputChange} val={{value: formState.reverse, name: "reverse"}} label={t("advanced_search.reverse_order_label")} />
                    </div>
                    <button className="primary__btn flex-row flex-nowrap align-items-center" type="submit">
                        <BiSearch size={20}/>
                        {t("advanced_search.search_button_title")}
                    </button>
                </form>
        </div>
    )
};

AdvancedSearch.propTypes = {
    closeSidebarOnMobile: PropTypes.func.isRequired
}
export default memo(AdvancedSearch);