import React, { useState, useEffect, useRef } from "react";
import Modal from "./../Modal";
import PropTypes from "prop-types";
import "./StationInfo.scss";
import { trimText, hashtigify, stringifyNumber, lowerString } from "../../../utilities/tools";
import Api from "../../../services/api";
import { lastFMKey } from "../../../info/secretInfo";
import { useHistory } from "react-router-dom";
import * as Consts from "../../../utilities/consts";
import { FaRegThumbsUp } from "react-icons/fa";
import { ImHome3 } from "react-icons/im";
import { BsPlayFill, BsFillPauseFill} from "react-icons/bs";
import { AiOutlineReload } from "react-icons/ai";
import Loader from "react-loader-spinner";
import defaultImg from "../../../desgin/Assets/radio.jpg";

const StationInfo = ({ itemObject, setModalOpenning, isModalOpen, handleStationPlaying, isPlaying, isAudioPlaying }) => {
    const history = useHistory();
    // states
    const [moreInfo, setMoreInfo] = useState({});
    const [tagsList, setTagsList] = useState([]);
    const [songLyrics, setSongLyrics] = useState([]);
    const [getAvatar, setGetAvatar] = useState([]);
    const [isLoadingInfo, setLoadingInfo] = useState(true);

    // refs
    const _isMounted = useRef(true);
    const avatarImg = useRef(null)
    useEffect(() => {
        getCurrentInfo();
        if(avatarImg.current){
           avatarImg.current.addEventListener("error", () => {
            avatarImg.current.src= defaultImg;
           }); 
        }
        return () => {
            _isMounted.current = false;
        }
    }, []);
    useEffect(() => {
        if (itemObject.tags) {
            const newArr = [
                ...itemObject.tags?.replace(/#(\S*)/g, "")?.split(",")
            ]
            if (newArr) {
                itemObject.language && newArr.push(itemObject.language);
                itemObject.state && newArr.push(itemObject.state);
                setTagsList(newArr);
            }
        }
    }, [itemObject])
    const openTag = (tagName) => {
        history.push(`${Consts.CATEGORY}?tag=${tagName}&order=votes&reverse=true`);
        setModalOpenning(false);
    }
    const getCurrentInfo = ( ) => {
        Api().get(`https://service.radiolise.com/?url=${itemObject.url_resolved || itemObject.url}`).then((res) => {
            // gets artist and song titles
            if (_isMounted.current) {
                const receivedData = res?.data;
                if (receivedData && Object.keys(receivedData).length > 0) {
                    const splittedTitle = receivedData.title?.split("-");
                    const editVal = (x) => {
                        return (x && lowerString(x) !== "unknown") ? x?.trim() : "";
                    }
                    const song = editVal(splittedTitle?.[splittedTitle.length - 1]);
                    const fullArtist = editVal(splittedTitle?.[0]);
                    const artist = lowerString(fullArtist).replace(/(ft|feat|[(]|&|;).*/ig, ()=> "");
                    const newObject = {
                        artist: artist || fullArtist,
                        fullArtist,
                        song,
                        genre: receivedData.genre,
                        description: receivedData.description,
                        url: receivedData.url
                    }
                    setMoreInfo(newObject);
                    if (artist && song) {
                        setLoadingInfo(true);
                        // gets lyrics
                       const lyricsPromise =  new Promise((resolve, reject) => {
                            Api("lyricsovh").get(`/v1/${artist?.trim()}/${song?.trim()}`).then((res) => {
                                if (_isMounted?.current) {
                                    setSongLyrics(res?.data?.lyrics?.replace(/Paroles de la chanson /, "") || "");
                                    resolve();
                                }
                            }).catch(() => {
                                if (_isMounted?.current) {
                                    setSongLyrics("");
                                    reject();
                                }
                            });
                        });

                        // Get additional info
                        const avatarPromise =  new Promise((resolve, reject) => {
                                Api().get(`https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${lastFMKey}&artist=${lowerString(artist?.trim())}&track=${lowerString(song?.trim())}&format=json`).then(res => {
                                    if (_isMounted?.current) {
                                        const trackInfo = res?.data?.track;
                                        const songInfo = {
                                            artwork: trackInfo?.album?.image[3]?.["#text"] ? trackInfo?.album?.image[3]?.["#text"] : trackInfo?.album?.image[2]?.["#text"] ? trackInfo?.album?.image[2]?.["#text"] : "",
                                            songFMUrl: trackInfo?.url || "",
                                            artistFMUrl: trackInfo?.artist?.url || "",
                                            albumFMUrl: trackInfo?.album.url || "",
                                            album: trackInfo?.album?.title || "",
                                            playCountFM: trackInfo?.playcount || "",
                                            summary: trackInfo?.wiki?.summary || "",
                                            publishedDate: trackInfo?.wiki?.published || "",
                                            tags: (trackInfo?.topTags && trackInfo?.topTags?.tag?.length > 0) ? trackInfo?.topTags?.tag : []
                                        }
                                        setGetAvatar(songInfo);
                                        resolve();
                                    }

                                }).catch((e) => {
                                    if (_isMounted?.current) {
                                        setGetAvatar([]);
                                        reject();
                                    }
                                });
                        })
                        Promise.all([lyricsPromise, avatarPromise]).then(() => setLoadingInfo(false)).catch(() => setLoadingInfo(false));
                    }
                }
            }
        });
    }
    return (
        <Modal label={itemObject.name ? trimText(itemObject.name, 20) : ""} isDismissible={true} isModalOpen={isModalOpen} onModalChange={setModalOpenning}>
            <div id="stationInfoModal">
                {/* song title */}
                <div className="into--top">
                    {(moreInfo.song && moreInfo.fullArtist) && <h4 className="song__title" title={`${moreInfo.song} / ${moreInfo.fullArtist}`}> {trimText(moreInfo.song, 27)} / {trimText(moreInfo.fullArtist, 24)}</h4>}
                </div>
                {/* play/pause station */}
                <div className="info--tool--btns flex-row">
                    <span className="modal__play__pause__btns" onClick={() => handleStationPlaying()}>
                            {(isPlaying && isAudioPlaying) ? <BsFillPauseFill/> : <BsPlayFill/>}   
                    </span>
                    { <span onClick={() => getCurrentInfo()} className="modal__play__pause__btns reload__btn">
                        <AiOutlineReload />
                    </span>
                    }
                </div>

                {/* tags */}
                <ul className="info--song--tags flex-row">
                    {
                        tagsList && tagsList.length > 0 &&
                        tagsList?.slice(0, 20).map((el, idx) => {
                            return el && (
                                <span className="info__song__tag__item" onClick={() => openTag(el)} key={el || idx}>{hashtigify(el)}</span>
                            )
                        })
                    }
                </ul>
                <div className="social--box flex-column">
                    <p><a className="social__item" href={itemObject.homepage} rel="noopener noreferrer" target="_blank"><ImHome3 /> <span>Visit {trimText(itemObject.name, 24)} homepage</span></a></p>
                    <p className="social__item"><FaRegThumbsUp /> <span>{stringifyNumber(itemObject.votes)}</span></p>
                </div>
                {/* song */}
                <div className="info--current--song">
                    {
                        isLoadingInfo ? 
                            <Loader
                            type="Rings"
                            className="station__info__loader"
                            arialLabel="loading-indicator"
                            color="var(--primary-clr)"
                            height={40}
                            width={40} 
                            timeout={3500}/> 
                        :
                        (songLyrics || Object.keys(getAvatar).lenght > 0) &&
                        <>
                            <h5>Playing now</h5>
                            <div className="song--details--container">

                                {/* top info */}
                                <div className="post--song--main--info">
                                    <img src={getAvatar.artwork} style={{display: getAvatar.artwork ? "inline": "none"}} ref={avatarImg} loading="lazy" alt={getAvatar.album} />
                                    {/* {getAvatar.name && <h3 className="song--title"><a href={getAvatar.songFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(getAvatar.name, 60)}</a></h3>} */}
                                    {moreInfo.artist && <h5 className="song--artist"><a href={getAvatar.artistFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(moreInfo.artist, 30)}</a></h5>}
                                    {getAvatar.album && <h6 className="song--album--title">From "<a href={getAvatar.albumFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(getAvatar.album, 40)}</a>" album</h6>}
                                </div>
                                {/* lyrics */}
                                {songLyrics && <article className="post--song--lyrics">{songLyrics}</article>}
                                {/* bottom stats */}
                                <div className="post-song--stats">
                                    {getAvatar.publishedDate && <span className="post--song--stat--item"><strong>Release date:</strong> {getAvatar.publishedDate}</span>}
                                    {getAvatar.playCountFM && <span className="post--song--stat--item mb-3"><strong>Play count on last.fm:</strong> {/^\d+$/.test(getAvatar.playCountFM) ? Number(getAvatar.playCountFM).toLocaleString() : getAvatar.playCountFM}</span>}
                                    {getAvatar.summary && <span className="post--song--stat--item"><strong>Content: </strong>
                                        <span dangerouslySetInnerHTML={{
                                            __html: trimText(getAvatar.summary, 600),
                                        }}></span>
                                    </span>}
                                    <div className="post--song--tags flex-row">
                                        {(getAvatar.tags && getAvatar.tags.length > 0) &&
                                            getAvatar.tags?.map(((tagItem, idx) => (tagItem && tagItem.name) && <a className="link--element" rel="noopener noreferrer" target="_blank" href={tagItem.url} key={tagItem.name + idx}>#{tagItem}</a>))
                                        }
                                    </div>

                                </div>
                            </div>
                        </>
                    }   
                </div>
            </div>
        </Modal>
    )
};

StationInfo.propTypes = {
    itemObject: PropTypes.object.isRequired,
    setModalOpenning: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    handleStationPlaying: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isAudioPlaying: PropTypes.bool.isRequired,
}
export default StationInfo;