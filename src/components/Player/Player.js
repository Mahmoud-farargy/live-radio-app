import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { notify, lowerString } from "../../utilities/tools";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import * as actionTypes from "../../store/actions/actions";
import * as consts from "../../utilities/consts"; 
import PropTypes from "prop-types";
import appConfig from "../../info/app-config.json";
import { AudioContext } from "../PlayerContext/PlayerContext";
import Locale from "react-jinke-music-player/lib/config/locale";

class Player extends PureComponent {
    constructor(props){
        super(props);
        this.audioInstance = null
        this._isMounted = React.createRef(true);
        this.sleepElTimeout = React.createRef(null);
        this.state = {
           currentPlayIndex: 0,
           currentVolumeLevel: 1,
           currentAudioObj: {}
        }
        this.onPlayerModeChange = this.onPlayerModeChange.bind(this);
    }
    static contextType = AudioContext;
    componentDidMount(){
        document.onkeydown = (clickedKey) => {
            if(document.activeElement.tagName !== "INPUT" && ((window.innerWidth || document.documentElement.clientWidth) >= 670)){
                switch(clickedKey.code){
                    case "Space":
                        clickedKey.preventDefault();
                        this.audioInstance.togglePlay();
                    break;
                    case "Minus":
                        const decreaseVal = 1 / 10;
                        if(this.state.currentVolumeLevel > 0.001 && this.state.currentVolumeLevel <= 1){
                            clickedKey.preventDefault();
                            this.setState((prevState) => {
                                let newVolume = prevState.currentVolumeLevel - decreaseVal;
                               return ({...this.state, currentVolumeLevel: Number(newVolume < 0 ? 0 : newVolume > 1 ? 1 : newVolume)});
                            });
                        }
                    break;
                    case "Equal":
                        const increaseVal =  0.10 * 1;
                        if(this.state.currentVolumeLevel < 0.9){
                            clickedKey.preventDefault();
                            this.setState((prevState) => {
                               let newVolume = prevState.currentVolumeLevel + increaseVal;
                               return ( {...this.state, currentVolumeLevel: Number( newVolume < 0 ? 0 : newVolume > 1 ? 1 : newVolume )});
                            });
                        }
                    break;
                    case "KeyP":
                        this.audioInstance.playPrev();
                    break;
                    case "KeyN":
                        this.audioInstance.playNext();
                    break;
                    case "KeyR":
                        this.audioInstance.load();
                    break;
                    default:
                    }
                };    
            }

    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.currentPlaylist !== this.props.currentPlaylist){
            setTimeout(() => this.setState({currentPlayIndex:this.props.currentPlaylist?.activeIndex}),400);
        }
        if(prevProps.currentStationId !== this.props.currentStationId){
            const currIdx = this.props.currentPlaylist?.list?.map(el => el.id).indexOf(this.props.currentStationId);
          
            if(currIdx !== -1){
                const currItem = this.props.currentPlaylist?.oldList?.[currIdx];
                this.props.updateMemo({ type: "add", item: currItem, destination: "history" });
            } 
        }
        if(prevState.currentVolumeLevel !== this.state.currentVolumeLevel){
            this.audioInstance.volume = this.state.currentVolumeLevel;
        }
        if((prevProps.localMemory?.settings !== this.props.localMemory?.settings) || (prevProps.isAudioPlaying !== this.props.isAudioPlaying)){
            const settings = this.props.localMemory?.settings
            if(settings){
                if(settings.sleepTimer && settings.sleepTimeout > 0){
                    if(this.props.isAudioPlaying){
                        this.sleepElTimeout.current = setTimeout(() => {
                        if(this._isMounted){
                            if(this.props.isAudioPlaying){
                                this.audioInstance.pause();
                                notify(`${settings.sleepTimeout} ${settings.sleepTimeout > 1 ? "mins are" : " min is"} over. The stream has been stopped.`); 
                                const newObject = {...settings, sleepTimer: false};
                                this.props.updateMemo({type: "set", newObject, destination: "settings"});
                            }
                            clearTimeout(this.sleepElTimeout.current);
                        }
                        }, settings.sleepTimeout * 60000); 
                    }else{
                        clearTimeout(this.sleepElTimeout.current);
                    }

                } 
            }
        }
    }
    componentWillUnmount(){
        this._isMounted.current = false;
        this.sleepElTimeout.current && clearTimeout(this.sleepElTimeout.current);
    }
    onPlayerModeChange(mode){
        if(mode){
            const isFullMode = lowerString(mode) === "full";
            isFullMode && this.blinkingDotOnTheTitle('auto');
            this.props.changePlayerMode(isFullMode ? true : false);   
        }
    }
    getCurrentPlayingStation(x) {
        if(x.id){
          document.title = `${x.name ? x.name + " | " : ""}${appConfig.title}`;
          this.props.changeCurrentID(x.id);  
        }
    }

    blinkingDotOnTheTitle(operation){
        const titleEl = document.querySelector('.audio-title');
        if(!this.state.currentAudioObj || !titleEl){
            return;
        }
        const currTitle = `${this.state.currentAudioObj.name} ${this.state.currentAudioObj.singer ? `- ${this.state.currentAudioObj.singer}` : ''}`
        titleEl.innerHTML = `
            <span class="player_title-lg">           
                <span>${currTitle || ""}</span>
                ${operation === 'add' || (operation === 'auto' && this.props.isAudioPlaying) ? `<span>
                <span class="ring-container">
                    <span class="ringring"></span>
                    <span class="circle"></span>
                </span>
                </span>` : ''}
            </span>

            `.trim();
    }
    changeTheme(currTheme){
        this.props.changeCurrentTheme(currTheme);
    }
    onPlaying(audioInfo){       
        this.setState({
            currentAudioObj: audioInfo
        }, () => {
            this.blinkingDotOnTheTitle('add');
        })
        this.getCurrentPlayingStation(audioInfo);
        this.props.changePlayingState(true);
        if(this.props.isAudioBuffering){
            this.props.changeBufferingState({state: false, id: ""}); 
        }
    }
    onPausing(audioInfo){
        this.setState({
            currentAudioObj: audioInfo
        }, () => {
            this.blinkingDotOnTheTitle('remove');
        })
        this.props.changePlayingState(false);
    }
    render(){
        const { localMemory, currentPlaylist, isPlayerOpen } = this.props;
        return (
            <Fragment>
                 <ReactJkMusicPlayer 
                    getAudioInstance={(instance) => {
                        this.audioInstance = instance;
                        this.audioInstance.addEventListener('waiting', () => {
                            this.props.changePlayingState(false);
                            this.props.changeBufferingState({state: false, id: ""}); 
                        });
                        this.audioInstance.addEventListener("loadstart", () => {
                            this.props.changeBufferingState({state: true, id: this.props.currentPlaylist?.list[this.state.currentPlayIndex]?.id});
                        });
                        this.audioInstance.addEventListener("loadedmetadata", () => {
                            this.props.changeBufferingState({state: false, id: ""});
                        });
                        this.audioInstance.addEventListener("error" , () => {
                            if(this.props.isPlayerOpen){
                                notify("Sorry, this station is not available. Try again later!","error")
                            }
                        })
                        this.context.onAudioInstanceChange(instance);
                    }}
                    showDownload={false}
                    showPlayMode={false}
                    onThemeChange={(e) => this.changeTheme(e)}
                    remove={false}
                    locale={localMemory?.settings.choosenLangauge === "cn" ? Locale.zh_CN : Locale.en_US}
                    theme="auto"
                    mode="full"
                    responsive={true}
                    showMediaSession={true}
                    play
                    onAudioVolumeChange={(e) => this.setState({currentVolumeLevel: e})}
                    style={{display: `${!isPlayerOpen ?  "none": "block"}`}}
                    className="player--container live__mode"
                    defaultPlayMode="singleLoop"
                    showMiniProcessBar={true}
                    clearPriorAudioLists={true}
                    defaultVolume={this.state.currentVolumeLevel}
                    onModeChange={(e) => this.onPlayerModeChange(e)}
                    onAudioPlay={(audioInfo) => this.onPlaying(audioInfo)}
                    onAudioEnded={(audioInfo) => this.onPausing(audioInfo)}
                    onAudioPause={(audioInfo) => this.onPausing(audioInfo)}
                    loadAudioErrorPlayNext={false}
                    showLyric={false}
                    onPlayIndexChange={(e) => this.setState({currentPlayIndex:e})}
                    showDestroy={false}
                    autoPlayInitLoadPlayList={true}
                    volumeFade={{ fadeIn: 500, fadeOut: 500 }}
                    playIndex={this.state.currentPlayIndex || 0}
                    glassBg={true}
                    audioLists={currentPlaylist?.list || []}
                />
            </Fragment>
        )
    }
};
Player.propTypes = {
    changePlayerMode: PropTypes.func.isRequired,
    changeCurrentTheme: PropTypes.func.isRequired,
    changeCurrentID: PropTypes.func.isRequired,
    updateMemo: PropTypes.func.isRequired,
    changeBufferingState: PropTypes.func.isRequired,
    currentPlaylist: PropTypes.object.isRequired,
    isPlayerOpen: PropTypes.bool.isRequired,
    currentStationId: PropTypes.string.isRequired,
    localMemory: PropTypes.object.isRequired,
    isAudioPlaying: PropTypes.bool.isRequired,
    isAudioBuffering: PropTypes.bool.isRequired
}
const mapStateToProps = state => {
    return {
        currentPlaylist: state[consts.MAIN].currentPlaylist || {},
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
        currentStationId: state[consts.MAIN].currentStationId || "",
        localMemory: state[consts.MAIN].localStorageCopy || {},
        isAudioPlaying: state[consts.MAIN].isAudioPlaying || false,
        isAudioBuffering: state[consts.MAIN].currentBufferingAudio?.state || false
    }
}
const mapDispatchToProps = dispatch => {
    return {
      changePlayerMode: (val) => dispatch({type: actionTypes.CHANGE_PLAYER_MODE, modeState: val}),
      changeCurrentID: (id) => dispatch({type: actionTypes.CHANGE_CURRENT_ID, id}),
      changeCurrentTheme: (val) => dispatch({type: actionTypes.CHANGE_CURRENT_THEME, currTheme: val}),
      updateMemo: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
      changePlayingState: (playingState) => dispatch({type: actionTypes.CHANGE_AUDIO_PLAYING, playingState}),
      changeBufferingState: (bufferingState) => dispatch({type: actionTypes.CHANGE_AUDIO_BUFFERING, bufferingState})
    };
  };
export default connect(mapStateToProps, mapDispatchToProps)(Player);