import React, { createContext, Component } from 'react';
import { connect } from "react-redux";
import * as consts from "../../utilities/consts";

const AudioContext = createContext();
const AudioConsumer = AudioContext.Consumer;

class PlayerContext extends Component {
   
    constructor(props){
        super(props);
        this.audioInstance = "";
        this.onAudioInstanceChange = this.onAudioInstanceChange.bind(this);
        this.playAudio = this.playAudio.bind(this);
        this.pauseAudio = this.pauseAudio.bind(this);
    }
    onAudioInstanceChange(instance) {
        this.audioInstance = instance;
    }
    playAudio() {
        const {isAudioBuffering, isPlayerOpen} = this.props;
        (!isAudioBuffering && isPlayerOpen && this.audioInstance) && this.audioInstance.play();
    }
    pauseAudio() {
        const {isAudioPlaying, isAudioBuffering, isPlayerOpen} = this.props;
        (isAudioPlaying && !isAudioBuffering && this.audioInstance && isPlayerOpen) && this.audioInstance.pause();
    }
    render() {
        return (
            <AudioContext.Provider value={{
                onAudioInstanceChange: this.onAudioInstanceChange,
                playAudio: this.playAudio,
                pauseAudio: this.pauseAudio,
            }}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}
const mapStateToProps = state => {
    return {
        isPlayerOpen: state[consts.MAIN].isPlayerOpen,
        isAudioPlaying: state[consts.MAIN].isAudioPlaying || false,
        isAudioBuffering: state[consts.MAIN].currentBufferingAudio?.state || false
    }
}
export default connect( mapStateToProps )(PlayerContext);
export {
    AudioContext,
    AudioConsumer
}