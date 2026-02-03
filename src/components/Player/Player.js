import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { notify, lowerString } from "../../utilities/tools"
import ReactJkMusicPlayer from "react-jinke-music-player"
import * as actionTypes from "../../store/actions/actions"
import * as consts from "../../utilities/consts"
import PropTypes from "prop-types"
import { AudioContext } from "../PlayerContext/PlayerContext"
import Locale from "react-jinke-music-player/lib/config/locale"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"

class Player extends PureComponent {
  constructor(props) {
    super(props)
    this.audioInstance = React.createRef(null)
    this.playerRef = React.createRef(null);
    this._isMounted = React.createRef(true)
    this._didInitPlayer = false
    this.sleepElTimeout = React.createRef(null)
    this._isHotKeyBound = false
    this.state = {
      currentVolumeLevel: 1,
      isCurrentSteamLiked: false,
    }
    this.onPlayerModeChange = this.onPlayerModeChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleAudioError = this.handleAudioError.bind(this)
    this.handleAudioPlaying = this.handleAudioPlaying.bind(this)
  }
  static contextType = AudioContext

  handleKeyDown(clickedKey) {
    if (document.activeElement.tagName !== "INPUT") {
      switch (clickedKey.code) {
        case "Space":
          clickedKey.preventDefault()
          this.audioInstance.current.togglePlay()
          break
        case "Minus":
          const decreaseVal = 1 / 10
          if (
            this.state.currentVolumeLevel > 0.001 &&
            this.state.currentVolumeLevel <= 1
          ) {
            clickedKey.preventDefault()
            this.setState((prevState) => {
              let newVolume = prevState.currentVolumeLevel - decreaseVal
              return {
                ...prevState,
                currentVolumeLevel: Number(
                  newVolume < 0 ? 0 : newVolume > 1 ? 1 : newVolume
                ),
              }
            })
          }
          break
        case "Equal":
          const increaseVal = 0.1 * 1
          if (this.state.currentVolumeLevel < 0.9) {
            clickedKey.preventDefault()
            this.setState((prevState) => {
              let newVolume = prevState.currentVolumeLevel + increaseVal
              return {
                ...prevState,
                currentVolumeLevel: Number(
                  newVolume < 0 ? 0 : newVolume > 1 ? 1 : newVolume
                ),
              }
            })
          }
          break
        case "KeyP":
          this.audioInstance.current.playPrev()
          break
        case "KeyN":
          this.audioInstance.current.playNext()
          break
        case "KeyR":
          this.audioInstance.current.load()
          break
        case "KeyF":
          this.toggleCurrentStationFavoriteState()
          break
        default:
      }
    }
  }

  registerHotKeyEvents() {
    if (this._isHotKeyBound) return
    document.addEventListener("keydown", this.handleKeyDown)
    this._isHotKeyBound = true
  }

  preloadAudio() {
    this.audioInstance.current?.setAttribute('preload', 'none')
  }

  hasPlayerAudio() {
    return !!(this.playerRef.current && this.playerRef.current.audio)
  }

  initPlayerIfNeeded() {
    if (this._didInitPlayer || !this.hasPlayerAudio()) return
    this.registerHotKeyEvents()
    this.preloadAudio()
    this._didInitPlayer = true
  }

  componentDidMount() {
    this.initPlayerIfNeeded()
  }
  
  componentDidUpdate(prevProps, prevState) {
    this.initPlayerIfNeeded()
    if(!this.hasPlayerAudio()) return;

    const isIndexDiff = prevProps.currentPlayIndex !== this.props.currentPlayIndex;
    const isPlaylistDiff = prevProps.currentPlaylist !== this.props.currentPlaylist;
    const isFavoritesDiff = prevProps.localMemory?.favorites !== this.props.localMemory?.favorites;
    const isVolumeDiff = prevState.currentVolumeLevel !== this.state.currentVolumeLevel;
    const isCurrentStationIdDiff = prevProps.currentStationId !== this.props.currentStationId;
    const isSettingsDiff = prevProps.localMemory?.settings !== this.props.localMemory?.settings;
    const isPlayingStateDiff =  prevProps.isAudioPlaying !== this.props.isAudioPlaying;

    
    if (isIndexDiff || isCurrentStationIdDiff || isPlaylistDiff || isFavoritesDiff) {
      const checkCurrentAudioFavoriteState = () => {
        return this.props.localMemory?.favorites?.some(el => el.id === this.props.currentAudio?.id);
      }

      this.setState((prev) => ({
        ...prev,
        isCurrentSteamLiked: checkCurrentAudioFavoriteState(),
      }))
    }

    if (isCurrentStationIdDiff) {
        const currItem = this.props.currentAudio;
        if (currItem && (currItem.id || currItem.stationuuid)) {
          this.props.updateMemo({
            type: "add",
            item: currItem,
            destination: "history",
          })
        }
    }

    if (isVolumeDiff) {
      this.audioInstance.current.volume = this.state.currentVolumeLevel
    }

    if (
      isSettingsDiff ||
      isPlayingStateDiff
    ) {
      const settings = this.props.localMemory?.settings
      // todos: avoid nested if cases
      if (settings?.sleepTimer && settings.sleepTimeout > 0) {
        if (this.sleepElTimeout.current) {
          clearTimeout(this.sleepElTimeout.current)
        }
        if (this.props.isAudioPlaying) {
          this.sleepElTimeout.current = setTimeout(() => {
            if (this._isMounted) {
              if (this.props.isAudioPlaying) {
                this.audioInstance.current.pause()
                notify(
                  `${settings.sleepTimeout} ${
                    settings.sleepTimeout > 1 ? "mins are" : " min is"
                  } over. The stream has been stopped.`
                )
                const newObject = { ...settings, sleepTimer: false }
                this.props.updateMemo({
                  type: "set",
                  newObject,
                  destination: "settings",
                })
              }
              clearTimeout(this.sleepElTimeout.current)
            }
          }, settings.sleepTimeout * 60000)
        } else {
          clearTimeout(this.sleepElTimeout.current)
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted.current = false
    if (this._isHotKeyBound) {
      document.removeEventListener("keydown", this.handleKeyDown)
      this._isHotKeyBound = false
    }
    this.sleepElTimeout.current && clearTimeout(this.sleepElTimeout.current)
    if (this.audioInstance.current) {
      this.audioInstance.current.removeEventListener("error", this.handleAudioError)
      this.audioInstance.current.removeEventListener("playing", this.handleAudioPlaying)
    }
  }

  onPlayerModeChange(mode) {
    if (mode) {
      const isFullMode = lowerString(mode) === "full"
      isFullMode && this.blinkingDotOnTheTitle("auto")
      this.props.changePlayerMode(isFullMode ? true : false)
    }
  }

  toggleCurrentStationFavoriteState() {
    const item = this.props.currentAudio;
    const isLiked = this.state.isCurrentSteamLiked;
    
    this.context.toggleStationLiking({item, isLiked});
  }

  renderLikeButton() {
    return <button onClick={() => this.toggleCurrentStationFavoriteState()} type="button" className="transparent_btn fav__btn--player">{
                this.state.isCurrentSteamLiked ?
                  <AiFillHeart className="unlike favIcon" /> :
                  <AiOutlineHeart className="like favIcon" />
                }
          </button>
  }

  blinkingDotOnTheTitle(operation) {
    const titleEl = document.querySelector(".audio-title")
    if (!this.props.currentAudio || !titleEl) {
      return
    }
    const currTitle = `${this.props.currentAudio.name} ${
      this.props.currentAudio.singer
        ? `- ${this.props.currentAudio.singer}`
        : ""
    }`
    const wrapper = document.createElement("span")
    wrapper.className = "player_title-lg"
    const textSpan = document.createElement("span")
    textSpan.textContent = currTitle || ""
    wrapper.appendChild(textSpan)

    if (
      operation === "add" ||
      (operation === "auto" && this.props.isAudioPlaying)
    ) {
      const outer = document.createElement("span")
      const ringContainer = document.createElement("span")
      ringContainer.className = "ring-container"
      const ringring = document.createElement("span")
      ringring.className = "ringring"
      const circle = document.createElement("span")
      circle.className = "circle"
      ringContainer.appendChild(ringring)
      ringContainer.appendChild(circle)
      outer.appendChild(ringContainer)
      wrapper.appendChild(outer)
    }

    titleEl.textContent = ""
    titleEl.appendChild(wrapper)
  }

  changeTheme(currTheme) {
    this.props.changeCurrentTheme(currTheme)
  }

  onPlaying() {
    this.blinkingDotOnTheTitle("add")
    this.props.changePlayingState(true)
    if (this.props.isAudioBuffering) {
      this.props.changeBufferingState({ state: false })
    }
  }

  onPausing() {
    this.blinkingDotOnTheTitle("remove")
    this.props.changePlayingState(false)
  }

  handleAudioError() {
    const { isPlayerOpen } = this.props
    if (!isPlayerOpen) return;
    notify(
      "Sorry, this station is not available. Try again later!",
      "error"
    )
    this.props.changeBufferingState({ state: false })
    this.props.changePlayingState(false)
  }

  handleAudioPlaying() {
    this.onPlaying()
  }

  render() {
    const { localMemory, currentPlaylist, isPlayerOpen } = this.props
    const hasPlaylist = Array.isArray(currentPlaylist) && currentPlaylist.length > 0
    if (!hasPlaylist) {
      return null
    }
    return (
        <ReactJkMusicPlayer
          getAudioInstance={(instance) => {
            if (this.audioInstance.current) {
              this.audioInstance.current.removeEventListener("error", this.handleAudioError)
              this.audioInstance.current.removeEventListener("playing", this.handleAudioPlaying)
            }
            this.audioInstance.current = instance
            this.audioInstance.current.addEventListener("error", this.handleAudioError)
            this.audioInstance.current.addEventListener("playing", this.handleAudioPlaying)

            this.context.onAudioInstanceChange(this.audioInstance.current)
          }}
          ref={this.playerRef}
          showDownload={false}
          showPlayMode={false}
          showReload
          onThemeChange={(e) => this.changeTheme(e)}
          remove={false}
          locale={
            localMemory?.settings.chosenLanguage === "cn"
              ? Locale.zh_CN
              : Locale.en_US
          }
          theme="auto"
          mode="full"
          responsive
          showMediaSession
          toggleMode
          glassBg
          clearPriorAudioLists
          quietUpdate
          onAudioVolumeChange={(e) => this.setState((prevState) => ({...prevState, currentVolumeLevel: e }))}
          style={{ display: `${!isPlayerOpen ? "none" : "block"}` }}
          className="player--container live__mode"
          defaultPlayMode="singleLoop"
          autoPlay={false}
          autoPlayInitLoadPlayList={false}
          showMiniProcessBar={false}
          spaceBar={false}
          seeked={false}
          preload={false}
          extendsContent={this.renderLikeButton()}
          defaultVolume={this.state.currentVolumeLevel || 0}
          onModeChange={(e) => this.onPlayerModeChange(e)}
          onAudioEnded={(audioInfo) => this.onPausing(audioInfo)}
          onAudioPause={(audioInfo) => this.onPausing(audioInfo)}
          onPlayIndexChange={(newIndex) => this.props.changeCurrentAudio(newIndex)}
          loadAudioErrorPlayNext={false}
          showProgressLoadBar={false}
          showLyric={false}
          showDestroy={false}
          volumeFade={{ fadeIn: 500, fadeOut: 500 }}
          audioLists={currentPlaylist}
        />
    )
  }
}

Player.propTypes = {
  changePlayerMode: PropTypes.func.isRequired,
  changeCurrentTheme: PropTypes.func.isRequired,
  updateMemo: PropTypes.func.isRequired,
  changeBufferingState: PropTypes.func.isRequired,
  currentPlaylist: PropTypes.array.isRequired,
  currentPlayIndex: PropTypes.number.isRequired,
  isPlayerOpen: PropTypes.bool.isRequired,
  currentStationId: PropTypes.string.isRequired,
  localMemory: PropTypes.object.isRequired,
  isAudioPlaying: PropTypes.bool.isRequired,
  isAudioBuffering: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
  const mainState = state[consts.MAIN];

  return {
    currentPlaylist: mainState.currentPlaylist ?? [],
    currentPlayIndex: mainState.currentPlayIndex ?? 0,
    isPlayerOpen: mainState.isPlayerOpen,
    currentStationId: mainState.currentStationId ?? "",
    localMemory: mainState.localStorageCopy ?? {},
    isAudioPlaying: mainState.isAudioPlaying ?? false,
    isAudioBuffering: mainState.currentBufferingAudio?.state ?? false,
    currentAudio: mainState.currentAudio ?? {},
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changePlayerMode: (val) =>
      dispatch({ type: actionTypes.CHANGE_PLAYER_MODE, modeState: val }),
    changeCurrentTheme: (val) =>
      dispatch({ type: actionTypes.CHANGE_CURRENT_THEME, currTheme: val }),
    updateMemo: (payload) =>
      dispatch({ type: actionTypes.UPDATE_MEMORY, payload }),
    changePlayingState: (playingState) =>
      dispatch({ type: actionTypes.CHANGE_AUDIO_PLAYING, playingState }),
    changeBufferingState: (bufferingState) =>
      dispatch({ type: actionTypes.CHANGE_AUDIO_BUFFERING, bufferingState }),
    changeCurrentAudio: (payload) =>
      dispatch({type: actionTypes.CHANGE_CURRENT_AUDIO, payload })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
