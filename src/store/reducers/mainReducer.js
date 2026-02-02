import * as actionTypes from "../actions/actions";
import { locStorage } from "../../utilities/tools";
import { localStorageBasicData } from "../../info/localStorageSkeletonData";
import appConfig from "../../info/app-config"

const initialState = {
    isAudioPlaying: false,
    currentBufferingAudio: {
        state: false
    },
    isPlayerFullMode: true,
    isPlayerOpen: false,
    visitorLocation: {},
    currentStationId: "",
    currentPlaylist: [],
    currentAudio: null,
    currentPlayIndex: 0,
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
                currentBufferingAudio: actions.bufferingState || {}
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

        case actionTypes.CHANGE_CURRENT_PLAYLIST: {
            const list = actions.payload;

            return {
                ...state,
                currentPlaylist: list || []
            }
        }

        case actionTypes.CHANGE_CURRENT_AUDIO: {
            const itemIndex = actions.payload;
            const list = state.currentPlaylist;
            
            if(list.length <= 0 || itemIndex < 0) return state;
            
            const currentAudio = list[itemIndex] || {};
            const { id, name } = currentAudio;

            if (id) {
                document.title = `${name ? name + " | " : ""}${appConfig.title}`
            }

            return {
                ...state,
                ...(!state.isPlayerOpen && { isPlayerOpen: true }),
                currentBufferingAudio: {state: true},
                currentStationId: currentAudio?.id,
                currentAudio,
                currentPlayIndex: itemIndex ?? 0,
            }
        }
            
        case actionTypes.UPDATE_MEMORY: {
            const { type, itemId, item, destination, storage, newObject } = actions.payload;
            if (type === "add" && typeof item === "object" && destination && (destination === "favorites" || destination === "history") && state.localStorageCopy?.hasOwnProperty(destination)) {
                let newArr = JSON.parse(JSON.stringify(state.localStorageCopy?.[destination]));
                if (Array.isArray(newArr)) {
                    newArr.unshift(item);
                    newArr = Array.from(
                        new Set(newArr.map((x) => x.stationuuid))
                    ).map((w) => newArr.find((el) => el.stationuuid === w));
                    locStorage({ type: "set", newData: newArr, destination });
                    const newLocStorageArr = {...state.localStorageCopy,[destination] : newArr?.slice(0, 50) };
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
                        localStorageCopy: {...state.localStorageCopy,[destination] : newArr?.slice(0, 1000) },
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
        }

        case actionTypes.CHANGE_CURRENT_THEME: {
            return {
                ...state,
                currentTheme: actions.currTheme
            }
        }

        case actionTypes.TOGGLE_PLAYER_VISIBILITY: {
            return {
                ...state,
                isPlayerOpen: !state.isPlayerOpen
            }
        }

        default: return state;
    }
};