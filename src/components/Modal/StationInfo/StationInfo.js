import React, { useState, useEffect, useRef, useContext, memo } from "react";
import Modal from "./../Modal";
import PropTypes from "prop-types";
import "./StationInfo.scss";
import { trimText, hashtigify, stringifyNumber, lowerString } from "../../../utilities/tools";
import Api from "../../../services/api";
import { lastFMKey } from "../../../info/secretInfo";
import { Link } from "react-router-dom";
import * as Consts from "../../../utilities/consts";
import { FaRegThumbsUp } from "react-icons/fa";
import { ImHome3 } from "react-icons/im";
import { BsPlayFill, BsFillPauseFill} from "react-icons/bs";
import { AiOutlineReload } from "react-icons/ai";
import { Rings } from "react-loader-spinner";
import defaultImg from "../../../desgin/Assets/radio.jpg";
import appInfo from "../../../info/app-config";
import { AudioContext } from "../../PlayerContext/PlayerContext";

const StationInfo = ({ itemObject, setModalOpening, isModalOpen, isPlaying, isAudioPlaying, wholeList }) => {
    // states
    const [moreInfo, setMoreInfo] = useState({});
    const [tagsList, setTagsList] = useState([]);
    const [songLyrics, setSongLyrics] = useState("");
    const [getAvatar, setGetAvatar] = useState({});
    const [isLoadingInfo, setLoadingInfo] = useState(true);

    const { toggleStationPlaying } = useContext( AudioContext );

    // refs
    const _isMounted = useRef(true);
    const avatarImg = useRef(null)

    // side effects
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

    // functions
    const handleStationPlaying = () => {
        toggleStationPlaying({list: wholeList, itemId: itemObject.id});
    }
    const getCurrentInfo = async ( ) => {
        const { lyricsOvh } = appInfo;
        try {
            const res = await Api().get(
            `https://service.radiolise.com/?url=${encodeURIComponent(
                itemObject.musicSrc
            )}`
            )

            if (!_isMounted.current) return

            const receivedData = res?.data

            if (!receivedData) return
            const parts = receivedData.title.split("-").map(p => p.trim())

            const normalize = (val = "") =>
            val && lowerString(val) !== "unknown" ? val : ""

            const fullArtist = normalize(parts[0])
            const song = normalize(parts.at(-1))

            const artist =
            lowerString(fullArtist).replace(/(ft|feat|\(|&|;).*/gi, "").trim() ||
            fullArtist

            setMoreInfo({
            artist,
            fullArtist,
            song,
            genre: receivedData.genre,
            description: receivedData.description,
            url: receivedData.url,
            })

            if (!artist || !song) return

            setLoadingInfo(true)

            const lyricsReq = Api()
            .get(
                `${lyricsOvh}/v1/${encodeURIComponent(
                artist
                )}/${encodeURIComponent(song)}`
            )
            .then(res => {
                if (_isMounted.current) {
                const lyrics = res?.data?.lyrics?.replace(/Paroles de la chanson /, "") || "";
              
                setSongLyrics(lyrics ?? "")
                }
            })
            .catch(() => {
                if (_isMounted.current) setSongLyrics("")
            })

            const avatarReq = Api()
            .get(
                `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${lastFMKey}&artist=${encodeURIComponent(
                artist
                )}&track=${encodeURIComponent(song)}&format=json`
            )
            .then(res => {
                if (!_isMounted.current) return

                const track = res?.data?.track
                if (!track) return

                setGetAvatar({
                artwork:
                    track?.album?.image?.[3]?.["#text"] ||
                    track?.album?.image?.[2]?.["#text"] ||
                    "",
                songFMUrl: track?.url || "",
                artistFMUrl: track?.artist?.url || "",
                albumFMUrl: track?.album?.url || "",
                album: track?.album?.title || "",
                playCountFM: track?.playcount || "",
                summary: track?.wiki?.summary || "",
                publishedDate: track?.wiki?.published || "",
                tags: track?.topTags?.tag || [],
                })
            })
            .catch(() => {
                if (_isMounted.current) setGetAvatar({})
            })

            await Promise.allSettled([lyricsReq, avatarReq])
        } catch (err) {
            console.error("getCurrentInfo failed", err)
        } finally {
            if (_isMounted.current) {
            setLoadingInfo(false)
            }
        }
    }

    return (
        <Modal label={itemObject.name ? itemObject.name : ""} isDismissible={true} isModalOpen={isModalOpen} onModalChange={setModalOpening}>
            <div id="stationInfoModal">
                {/* song title */}
                {(moreInfo.song && moreInfo.fullArtist) && <div className="into--top">
                    <h4 className="song__title ellipsis-x1" title={`${moreInfo.song} / ${moreInfo.fullArtist}`}> {moreInfo.song} / {moreInfo.fullArtist} ({moreInfo.genre})</h4>
                </div>}

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
                        tagsList?.slice(0, 20).map((tagName, idx) => {
                            return tagName && (
                                <Link to={`${Consts.CATEGORY}?tag=${tagName}&order=votes&reverse=true`} className="info__song__tag__item">
                                    <span onClick={() => setModalOpening(false)} key={tagName || idx}>{hashtigify(tagName)}</span>
                                </Link>
                            )
                        })
                    }
                </ul>
                <div className="social--box flex-column">
                    <p><a className="social__item" href={itemObject.homepage} rel="noopener noreferrer" target="_blank"><ImHome3 /> <span>Visit {trimText(itemObject.name, 24)} homepage</span></a></p>
                    <p className="social__item"><FaRegThumbsUp /> <span>{stringifyNumber(itemObject.votes)}</span></p>
                </div>
                {(moreInfo.description && <p>{moreInfo.description}</p>)}
                {/* song */}
                <div className="info--current--song">
                    {
                        isLoadingInfo ? 
                            <div className="station__info__loader">
                                <Rings
                                    aria-label="loading..."
                                    color="var(--primary-clr)"
                                    height={40}
                                    width={40} 
                                    timeout={1500}
                                />  
                            </div>

                        :
                        (songLyrics || Object.keys(getAvatar).length > 0) ?
                        <>
                            <h5>Playing now</h5>
                            <div className="song--details--container">

                                {/* top info */}
                                <div className="post--song--main--info">
                                    {getAvatar.artwork && <img src={getAvatar.artwork} ref={avatarImg} loading="lazy" alt={getAvatar.album} />}
                                    {/* {getAvatar.name && <h3 className="song--title"><a href={getAvatar.songFMUrl || "#"} rel="noopener noreferrer" target="_blank">{trimText(getAvatar.name, 60)}</a></h3>} */}
                                    {moreInfo.artist && <h5 className="song--artist"><a className="ellipsis-x1" href={getAvatar.artistFMUrl || "#"} rel="noopener noreferrer" target="_blank">{moreInfo.artist}</a></h5>}
                                    {getAvatar.album && <h5 className="song--album--title">From "<a className="ellipsis-x1" href={getAvatar.albumFMUrl || "#"} rel="noopener noreferrer" target="_blank">{getAvatar.album}</a>" album</h5>}
                                </div>

                                {/* lyrics */}
                                {songLyrics && <article className="post--song--lyrics">{songLyrics}</article>}

                                {/* bottom stats */}
                                {getAvatar && <div className="post-song--stats">
                                    {getAvatar.publishedDate && <span className="post--song--stat--item"><strong>Release date:</strong> {getAvatar.publishedDate}</span>}
                                    {getAvatar.playCountFM && <span className="post--song--stat--item mb-3"><strong>Play count on last.fm:</strong> {/^\d+$/.test(getAvatar.playCountFM) ? Number(getAvatar.playCountFM).toLocaleString() : getAvatar.playCountFM}</span>}
                                    {getAvatar.summary && <span className="post--song--stat--item"><strong>Content: </strong>
                                        <span dangerouslySetInnerHTML={{
                                            __html: trimText(getAvatar.summary, 600),
                                        }}></span>
                                    </span>}
                                    {getAvatar.tags && <div className="post--song--tags flex-row">
                                        {(getAvatar.tags.length > 0) &&
                                            getAvatar.tags?.map(((tagItem, idx) => (tagItem && tagItem.name) && <a className="link--element" rel="noopener noreferrer" target="_blank" href={tagItem.url} key={tagItem.name + idx}>#{tagItem}</a>))
                                        }
                                    </div>}

                                </div>}
                            </div>
                        </>
                        :
                        <small>No specific information for this station at this time.</small>
                    }   
                </div>
            </div>
        </Modal>
    )
};

StationInfo.propTypes = {
    itemObject: PropTypes.object.isRequired,
    setModalOpening: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isAudioPlaying: PropTypes.bool.isRequired,
    wholeList: PropTypes.array.isRequired,
}
export default memo(StationInfo);