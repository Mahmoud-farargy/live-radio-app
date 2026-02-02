import React, { createContext, PureComponent } from 'react';
import { connect } from "react-redux";
import { MAIN } from "../../utilities/consts";
import { CHANGE_CURRENT_AUDIO, UPDATE_MEMORY, CHANGE_CURRENT_PLAYLIST } from "../../store/actions/actions";
import { arraysMatchById } from '../../utilities/tools';

const AudioContext = createContext();
const AudioConsumer = AudioContext.Consumer;

class PlayerContext extends PureComponent {
   
    constructor(props){
        super(props);
        this.audioInstance = null;
        this.onAudioInstanceChange = this.onAudioInstanceChange.bind(this);
        this.toggleStationPlaying = this.toggleStationPlaying.bind(this);
        this.toggleStationLiking = this.toggleStationLiking.bind(this);
    }

    onAudioInstanceChange(instance) {
        this.audioInstance = instance;
    }

    toggleStationPlaying = ({list = [], itemId}) => {
        const { isAudioBuffering, currentStationId, currentPlaylist } = this.props;

        const hasListChanged = !arraysMatchById(list, currentPlaylist);

        const newIndex = list?.map(el => el.id).indexOf(itemId);
        if(newIndex < 0) return;
       
        if(hasListChanged){
          this.props.changeCurrentPlaylist(list);
          this.props.changeCurrentAudio(newIndex);

          setTimeout(() => {
            this.audioInstance.updatePlayIndex(newIndex);
            this.audioInstance.togglePlay();
          }, 300);
        }else{
            const isCurrentAudio = itemId === currentStationId;
            if(isCurrentAudio && isAudioBuffering) return;
            this.audioInstance.updatePlayIndex(newIndex);
            this.audioInstance.togglePlay();
        }
    };

    toggleStationLiking = ({item, isLiked}) => {
        if(isLiked){
            this.props.updateFavs({ type: "delete", itemId: item.id, destination: "favorites" });   
        }else{
            this.props.updateFavs({ type: "add", item, destination: "favorites" });
        }
    }

    render() {
        return (
            <AudioContext.Provider value={{
                onAudioInstanceChange: this.onAudioInstanceChange,
                toggleStationPlaying: this.toggleStationPlaying,
                toggleStationLiking: this.toggleStationLiking,
            }}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}
const mapStateToProps = state => {
    const mainState = state[MAIN];
    return {
        isAudioBuffering: mainState.currentBufferingAudio?.state ?? false,
        currentPlaylist: mainState.currentPlaylist ?? [],
        currentStationId: mainState.currentStationId ?? false,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateFavs: (payload) => dispatch({ type: UPDATE_MEMORY, payload }),
        changeCurrentPlaylist: (payload) => dispatch({type: CHANGE_CURRENT_PLAYLIST, payload}),
        changeCurrentAudio: (payload) =>
              dispatch({type: CHANGE_CURRENT_AUDIO, payload })
    }
}
export default connect( mapStateToProps, mapDispatchToProps )(PlayerContext);
export {
    AudioContext,
    AudioConsumer
}