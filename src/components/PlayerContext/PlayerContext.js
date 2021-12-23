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
        (this.audioInstance && this.props.isPlayerOpen) && this.audioInstance.play();
    }
    pauseAudio() {
        (this.audioInstance && this.props.isPlayerOpen) && this.audioInstance.pause();
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
    }
}
export default connect( mapStateToProps )(PlayerContext);
export {
    AudioContext,
    AudioConsumer
}