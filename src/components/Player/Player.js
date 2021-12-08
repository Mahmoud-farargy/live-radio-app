import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { notify } from "../../utilities/tools";
import ReactJkMusicPlayer from 'react-jinke-music-player';
import * as actionTypes from "../../store/actions/actions";
import * as consts from "../../utilities/consts"; 
import PropTypes from "prop-types";
import appConfig from "../../info/app-config.json";

class Player extends PureComponent {
    constructor(props){
        super(props);
        this.audioInstance = null
        this._isMounted = React.createRef(true);
        this.sleepElTimeout = React.createRef(null);
        this.state = {
           currentPlayIndex: 0,
           currentVolumeLevel: 1,
        }
        this.onPlayerModeChange = this.onPlayerModeChange.bind(this);
    }
    componentDidMount(){
        document.onkeydown = (clickedKey) => {
            if(document.activeElement.tagName !== "INPUT" && ((window.innerWidth || document.documentElement.clientWidth) >= 670)){
                console.log(clickedKey);
                switch(clickedKey.code){
                    case "Space":
                        clickedKey.preventDefault();
                        this.audioInstance.togglePlay();
                    break;
                    case "Minus":
                        const decreaseVal = 1 / 10;
                        if(this.state.currentVolumeLevel > 0.001 && this.state.currentVolumeLevel <= 1){
                            clickedKey.preventDefault();
                            this.setState((prevState) => ({...this.state, currentVolumeLevel: Number(prevState.currentVolumeLevel - decreaseVal)})) ;
                        }
                    break;
                    case "Equal":
                        const increaseVal =  0.10 * 1;
                        if(this.state.currentVolumeLevel < 0.9){
                            clickedKey.preventDefault();
                            this.setState((prevState) => ({...this.state, currentVolumeLevel: Number(prevState.currentVolumeLevel + increaseVal)}));
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
        if(prevProps.currentPlaylist!== this.props.currentPlaylist){
            setTimeout(() => this.setState({currentPlayIndex:this.props.currentPlaylist?.activeIndex}),400);
        }
        if(prevProps.currentStationId !== this.props.currentStationId){
            const currIdx = this.props.currentPlaylist?.list?.map(el => el.id).indexOf(this.props.currentStationId);
          
            if(currIdx !== -1){
                // console.log(this.props.currentPlaylist?.oldList[currIdx]);
                  this.props.updateHistory({ type: "add", item: this.props.currentPlaylist?.oldList?.[currIdx], destination: "history" });
            } 
        }
        if(prevState.currentVolumeLevel !== this.state.currentVolumeLevel){
            console.log(this.state.currentVolumeLevel);
            this.audioInstance.volume = this.state.currentVolumeLevel;
        }
        if(prevProps.localMemory?.settings !== this.props.localMemory?.settings){
            const settings = this.props.localMemory?.settings
            if(settings){
                if(settings.sleepTimer && settings.sleepTimeout > 0){
                    this.sleepElTimeout.current = setTimeout(() => {
                    if(this._isMounted){
                        this.audioInstance.pause();
                        notify("Time is up.");
                        clearTimeout(this.sleepElTimeout.current);
                    }
                    }, settings.sleepTimeout * 60000);
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
            const lowerCasedMode = mode?.toLowerCase();
            this.props.changePlayerMode(lowerCasedMode === "full" ? true : false);   
        }
    }
    getCurrentPlayingStation(x) {
        console.log("test",x);
        if(x.id){
          document.title = `${x.name ? x.name + " | " : ""}${appConfig.title}`;
          this.props.changeCurrentID(x.id);  
        }
    }

    changeTheme(currTheme){
        this.props.changeCurrentTheme(currTheme);
    }

    render(){
        return (
            <Fragment>
                 <ReactJkMusicPlayer 
                    getAudioInstance={(instance) => {
                        console.log(instance);
                        this.audioInstance = instance
                    }}
                    showDownload={false}
                    showPlayMode={false}
                    onThemeChange={(e) => this.changeTheme(e)}
                    remove={false}
                    locale="en_US"
                    theme="auto"
                    mode="full"
                    responsive={true}
                    play
                    onAudioVolumeChange={(e) => this.setState({currentVolumeLevel: e})}
                    style={{display: `${!this.props.isPlayerOpen ?  "none": "block"}`}}
                    className="player--container"
                    showMiniProcessBar={true}
                    clearPriorAudioLists={true}
                    defaultVolume={this.state.currentVolumeLevel}
                    onModeChange={(e) => this.onPlayerModeChange(e)}
                    onAudioPlay={(a) => this.getCurrentPlayingStation(a)}
                    // onAudioError={(e) => notify(e?.message || "Failed to play this radio station.","error")}
                    showLyric={false}
                    onPlayIndexChange={(e) => this.setState({currentPlayIndex:e})}
                    showDestroy={false}
                    autoPlayInitLoadPlayList={true}
                    volumeFade={{ fadeIn: 500, fadeOut: 500 }}
                    playIndex={this.state.currentPlayIndex || 0}
                    glassBg={true}
                    audioLists={this.props.currentPlaylist?.list || []}
                />
            </Fragment>
        )
    }
};
Player.propTypes = {
    changePlayerMode: PropTypes.func.isRequired,
    changeCurrentTheme: PropTypes.func.isRequired,
    changeCurrentID: PropTypes.func.isRequired,
    updateHistory: PropTypes.func.isRequired,
    currentPlaylist: PropTypes.object.isRequired,
    isPlayerOpen: PropTypes.bool.isRequired,
    currentStationId: PropTypes.string.isRequired,
    localMemory: PropTypes.object.isRequired
}
const mapStateToProps = state => {
    return {
        currentPlaylist: state[consts.MAIN].currentPlaylist || {},
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
        currentStationId: state[consts.MAIN].currentStationId || "",
        localMemory: state[consts.MAIN].localStorageCopy || {}
    }
}
const mapDispatchToProps = dispatch => {
    return {
      changePlayerMode: (val) => dispatch({type: actionTypes.CHANGE_PLAYER_MODE, modeState: val}),
      changeCurrentID: (id) => dispatch({type: actionTypes.CHANGE_CURRENT_ID, id}),
      changeCurrentTheme: (val) => dispatch({type: actionTypes.CHANGE_CURRENT_THEME, currTheme: val}),
      updateHistory: (payload) => dispatch({ type: actionTypes.UPDATE_MEMORY, payload })
    };
  };
export default connect(mapStateToProps, mapDispatchToProps)(Player);