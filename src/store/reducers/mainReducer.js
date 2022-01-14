import * as actionTypes from "../actions/actions";
import defaultImg from "../../desgin/Assets/radio.jpg";
import { locStorage } from "../../utilities/tools";
import { localStorageBasicData } from "../../info/localStorageSkeletonData";

const initialState = {
    isAudioPlaying: false,
    isAudioBuffering: true,
    isPlayerFullMode: true,
    isPlayerOpen: false,
    visitorLocation: {},
    currentStationId: "",
    currentPlaylist: {
        list: [],
        activeIndex: 0
    },
    localStorageCopy: {
        favorites: [],
        history: [],
        settings: {}
    },
    settings: [],
    currentTheme: "light",

};

export const mainReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case actionTypes.CHANGE_AUDIO_PLAYING:
            return {
                ...state,
                isAudioPlaying: actions.playingState
            }
        case actionTypes.CHANGE_AUDIO_BUFFERING:
            return {
                ...state,
                isAudioBuffering: actions.bufferingState
            }
        case actionTypes.CHANGE_PLAYER_MODE:
            return {
                ...state,
                isPlayerFullMode: actions.modeState
            }
        case actionTypes.CHANGE_VISITOR_LOCATION:
            return {
                ...state,
                visitorLocation: actions.visitorInfo
            }
        case actionTypes.CHANGE_CURRENT_PLAYLIST:
            const { list, currentStationId } = actions.payload;
            if (list && list.length > 0 && Array.isArray(list) && currentStationId) {
                const activeIndex = list.map((el) => el.stationuuid).indexOf(currentStationId);
                const newList = list.map((item) => {
                    return {
                        name: item.name,
                        musicSrc: (item.urlResolved || item.url),
                        cover: item.favicon || defaultImg,
                        duration: 7200,
                        singer: item.country,
                        id: item.stationuuid
                    }
                });
                return {
                    ...state,
                    currentPlaylist: { list: newList, activeIndex: activeIndex >= 0 ? activeIndex : 0, oldList: list },
                    ...(!state.isPlayerOpen && { isPlayerOpen: true })
                }

            } else {
                return state;
            }
        case actionTypes.CHANGE_CURRENT_ID:
            const ID = actions.id;
            if (ID) {
                return {
                    ...state,
                    currentStationId: ID
                }
            } else {
                return state;
            }
        case actionTypes.UPDATE_MEMORY:
            const { type, itemId, item, destination, storage, newObject } = actions.payload;
            if (type === "add" && typeof item === "object" && destination && (destination === "favorites" || destination === "history") && state.localStorageCopy?.hasOwnProperty(destination)) {
                let newArr = JSON.parse(JSON.stringify(state.localStorageCopy?.[destination]));
                if (Array.isArray(newArr)) {
                    newArr.unshift(item);
                    newArr = Array.from(
                        new Set(newArr.map((x) => x.stationuuid))
                    ).map((w) => newArr.find((el) => el.stationuuid === w));
                    locStorage({ type: "set", newData: newArr, destination });
                    const newLocStorageArr = {...state.localStorageCopy,[destination] : newArr?.slice(0, 1000) };
                    Object.keys(localStorageBasicData).forEach(key => {
                        if(!newLocStorageArr.hasOwnProperty(key)){
                            newLocStorageArr[key] = localStorageBasicData[key];
                        }
                    });
                    return {
                        ...state,
                        localStorageCopy: newLocStorageArr
                    }
                } else {
                    return state;
                }
            } else if (type === "delete" && itemId && destination && (destination === "favorites" || destination === "history") && state.localStorageCopy?.hasOwnProperty(destination)) {
                let newArr = JSON.parse(JSON.stringify(state.localStorageCopy?.[destination]));
                if (Array.isArray(newArr)) {
                    const delIndex = newArr.map(item => item.stationuuid).indexOf(itemId);
                    if (delIndex !== -1) {
                        newArr.splice(delIndex, 1);
                        locStorage({ type: "set", newData: newArr, destination });
                    }
                    return {
                        ...state,
                        localStorageCopy: {...state.localStorageCopy,[destination] : newArr?.slice(0, 1000) }
                    }
                } else {
                    return state;
                }
            } else if(type === "set" && (destination === "settings")){
                if(typeof newObject === "object" && Object.keys(newObject).length > 0){
                     locStorage({ type: "set", newData: newObject, destination });
                     return {
                        ...state,
                        localStorageCopy: {
                            ...state.localStorageCopy,
                            [destination]: newObject
                        }
                     }
                }else{
                    return state;
                }
               
            } else if (type === "update" && typeof storage === "object") {
                return {
                    ...state,
                    localStorageCopy: {
                        favorites: storage.favorites || [],
                        history: storage.history || [],
                        settings: storage.settings || {},
                    }
                }
            } else {
                return state;
            }

        case actionTypes.CHANGE_CURRENT_THEME: {
            return {
                ...state,
                currentTheme: actions.currTheme
            }
        }
        case actionTypes.TOGGLE_PLAYER_VISIBILITY:
            return {
                ...state,
                isPlayerOpen: !state.isPlayerOpen
            }
        default: return state;
    }
};