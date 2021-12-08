import React, { useState, useCallback, useEffect, memo, useRef } from "react";
import { MdFilterAlt } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import MultiInputSelect from "../../components/formInputs/MultiTextInput";
import CreatableSelect from 'react-select/creatable';
import { IoMdPricetag } from "react-icons/io";
import { BiStation } from "react-icons/bi";
import { selectTheme } from "../../utilities/tools";
import api from "../../services/api";
import * as consts from "../../utilities/consts";
import { useHistory } from "react-router-dom";
import countriesListJSON from "../../info/countriesList.json";
import { serialize } from "../../utilities/tools";
import PropTypes from "prop-types";
import IosButton from "../../components/formInputs/IosButton";
import "./AdvancedSearch.scss";

const AdvancedSearch = ({closeSidebarOnMobile}) => {
    const history = useHistory();
    const _isMounted = useRef(true);
    // selected option
    const [formState, setFormState] = useState({
        tags: [],
        country: { value: "all countries", label: "All countries", name: "country" },
        state: { value: "all states", label: "All states", name: "state" },
        language: { value: "all languages", label: "All languages", name: "language" },
        order: { value: "normal", label: "Normal", name: "order" },
        reverse: true,
        stationName: ""
    });
    // options
    const [languageOptions, setLanguagesOption] = useState(
        { list: [{ value: "all countries", label: "All languages", name: "language" }], isLoading: false }
        );
    const [countriesOptions, setCountriesOption] = useState(
        { list: [{ value: "all countries", label: "All countries", name: "country" }], isLoading: false }
        );
    const [statesOptions, setStatesOption]= useState(
        { list: [{ value: "all states", label: "All states", name: "state" }], isLoading: false }
        );
    const ordersOptions = {
            list: [{ value: "normal", label: "Normal", name: "order" },
            { value: "votes", label: "Votes", name: "order" },
            { value: "name", label: "Names", name: "order" },
            { value: "tag", label: "Tags", name: "order" },
            { value: "country", label: "Countries", name: "order" },
            { value: "state", label: "States", name: "order" },
            { value: "language", label: "Languages", name: "order" },
            { value: "codec", label: "Codecs", name: "order" },
            { value: "bitrate", label: "Bitrates", name: "order" },
            { value: "lastcheckok", label: "Last Check Ok", name: "order" },
            { value: "lastchecktime", label: "Last Check Times", name: "order" },
            { value: "clickcount", label: "Click Counts", name: "order" },
            { value: "random", label: "random", name: "order" }]
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
        console.log(res);
        if (!Array.isArray(res) || !typeof keyName === "string") return;
        return res && res.length > 0 &&
            res.map((item) => {
                if (item && item.hasOwnProperty("name") && typeof item.name === "string") {
                    if(keyName === "countries"){
                        console.log("counties ?>>>")
                        return {
                            value: item.name,
                            label: countriesListJSON.filter(el => el.code === item.name).pop()?.name || item.name,
                            name: getSingular(keyName)
                        }   
                    }else{
                        return {
                            value: item.name,
                            label: item.name,
                            name: getSingular(keyName)
                        }   
                    }
                  
                } else {
                    return "";
                }
            });
    }
    const handleResponse = ({ res, keyName }) => {
        console.log(keyName);
        if (res.data) {
            const formattedResponse = reformatData(res.data, keyName);
            if (formattedResponse && typeof formattedResponse === "object") {
                
                switch(keyName){
                    case "countries":
                        console.log(keyName,"221", formattedResponse);
                        setCountriesOption({list: [{ value: `all ${keyName}`, label: `All ${keyName}`, name: getSingular(keyName) }, ...formattedResponse.sort((a,b) => b.value - a.value )], isLoading: false});
                    break;
                    case "languages":
                        console.log(keyName,"22");
                        
                        setLanguagesOption({list: [{ value: `all ${keyName}`, label: `All ${keyName}`, name: getSingular(keyName) }, ...formattedResponse], isLoading: false});
                    break;
                    case "states":
                        setStatesOption({list: [{ value: `all ${keyName}`, label: `All ${keyName}`, name: getSingular(keyName) }, ...formattedResponse], isLoading: false});
                    break;
                    default:
                        setCountriesOption({list: [{ value: `all ${keyName}`, label: `All ${keyName}`, name: getSingular(keyName) }, ...formattedResponse], isLoading: false});
                }
            }
        }
    }
    const getOptions = ({path, name}) => {
        console.log(path)
        if(path){
            api().get(path).then((res) => {
                if(_isMounted.current){
                    handleResponse({ res, keyName: name });
                }
            }).catch(() => {
                if(_isMounted.current){
                    // changeOptions({ key: "countries", overridekey: { list: [], isLoading: false } });
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
            console.log(formState);
                if(typeof formState !== "object") return ;
                const newVal = (val) => {
                    const newValue = typeof val === "string" ? val?.toLowerCase() : val;
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
                    history.push(`${consts.SEARCH}?${serialize(newObject)}`);
                }
                
                closeSidebarOnMobile();
        }
    }
    const getTags = useCallback((arr) => {
        console.log(arr);
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
                        <span className="input--label flex-row"><BiStation /> <h5>Station Name:</h5></span>
                        <input type="text" onChange={(e) => onInputChange({name: "stationName", value: e.target.value, type: "text"})} name="stationName" value={formState.stationName} className="primary__input" placeholder="Stations by name" />
                    </div>
                    <div className="search--input--group">
                        <span className="input--label flex-row"><IoMdPricetag /> <h5>Tags:</h5></span>
                        <MultiInputSelect getTags={getTags} />
                    </div>
                    <div className="search--input--group search--filters">
                        <span className="input--label flex-row"><MdFilterAlt /> <h5>Filters:</h5></span>
                        <div className="search--select--input">
                            <CreatableSelect
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
                        <span className="input--label flex-row"><FaSort /> <h5>Sort by:</h5></span>
                        <div className="search--select--input">
                            <CreatableSelect
                                isClearable={false}
                                name="order"
                                onChange={onInputChange}
                                theme={selectTheme}
                                value={formState.order}
                                placeholder="Sort by"
                                defaultValue="Normal"
                                isLoading={ordersOptions.isLoading}
                                options={ordersOptions.list}
                            />
                        </div>
                        <IosButton onIOSChange={onInputChange} val={{value: formState.reverse, name: "reverse"}} label="Show results in reverse order" />
                    </div>
                    <button className="primary__btn" type="submit">
                        Search
                    </button>
                </form>
        </div>
    )
};

AdvancedSearch.propTypes = {
    closeSidebarOnMobile: PropTypes.func.isRequired
}
export default memo(AdvancedSearch);