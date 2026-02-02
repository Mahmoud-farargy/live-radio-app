import React, { useEffect, useState, memo, useContext, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../UI/EmblaCarouselArrowButtons'
import { TailSpin } from "react-loader-spinner";
import SlidableListItem from "./SlidableListItem/SlidableListItem";
import PropTypes from "prop-types";
import { withStationsFetcher } from "../HOC/withStationsFetcher";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Consts from "../../utilities/consts";
import { serialize, trimText } from "../../utilities/tools";
import { AudioContext } from "../PlayerContext/PlayerContext";
import { connect } from "react-redux";

const SlidableList = ({ params = {}, fetchStations, listTitle, isAudioBuffering, storageCopy }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 5,
    containScroll: "trimSnaps",
  });
    const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)
  
  const [listName, setListName] = useState("");
  const [response, setResponse] = useState({
    list: [],
    loading: true
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { toggleStationPlaying, toggleStationLiking } = useContext( AudioContext );

  useEffect(() => {
  if (params && typeof params === "object" && params !== null) {
      setResponse((prev) => ({
        ...prev,
        loading: true,
      }));

      fetchStations({ ...params, limit: 8 })
        .then(({ data }) => {
          setResponse({
            list: data,
            loading: false,
          });
        })
        .catch(() => {
          setResponse((prev) => ({
            ...prev,
            loading: false,
          }));
        });
    }

    setListName(params?.tag ? params.tag : "");
  }, [params, fetchStations]);

  const list = useMemo(()=> response.list, [response?.list]);
  
  const directMeToCategoryPage = () => {
    navigate(`${Consts.CATEGORY}?${serialize({ ...params })}`);
  }


  const itemMap = useMemo(() => new Map(list.map(i => [i.id, i])),[list]);

  const onListClick = (event) => {
    const element = event.target.closest("[data-item-id]");
    if(!element) return;
    const elementId = element.dataset.itemId
    if(!elementId) return;
    const item = itemMap.get(elementId);
    if(!item) return;

    const actionType = event.target.closest("[data-action]")?.dataset.action;

    switch(actionType){
      case "toggleLiking": 
        const isLiked = !!+element.dataset.liked;
        toggleStationLiking({item, isLiked});

      break;
      case "togglePlaying":
        toggleStationPlaying({list, itemId: elementId});

      break;
      default: {
        return {}
      }
    }
  }
  

  return (
    <div className="fluid-container">
      {response.loading ?
        <div id="slidableListLoading">
          <TailSpin
            aria-label="loading..."
            color="var(--gray)"
            height={70}
            width={70} />
        </div>
        : response && list.length > 0 &&
        <section className="slidableList">
          <div className="slidableList--header flex-row">
            <h4 className="list--name ellipsis-x1"title={listTitle}>{trimText(listTitle || listName, 25)}</h4>
            <span className="see--all--btn" onClick={() => directMeToCategoryPage()}>{t("titles.see_all")}</span>
          </div>
          <div className="embla">
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />

              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container" onClick={onListClick}>
                  {list.map((item) => (
                    <ul className="embla__slide slidableList--ul" key={item.stationuuid}>
                      <SlidableListItem
                        isAudioBuffering={isAudioBuffering}
                        item={item}
                        wholeList={list}
                        favoritesList={storageCopy?.favorites || []}
                        historyList={storageCopy?.history || []}
                      />
                    </ul>
                  ))}
                </div>
              </div>
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </section>
      }
    </div>
  )
};

SlidableList.propTypes = {
  params: PropTypes.object.isRequired,
  fetchStations: PropTypes.func.isRequired,
  listTitle: PropTypes.string,
  storageCopy: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  const mainState = state[Consts.MAIN] || {};
  return {
    isAudioBuffering: mainState.currentBufferingAudio?.state ?? false,
    storageCopy: mainState.localStorageCopy ?? {},
  }
}

export default connect(mapStateToProps)(withStationsFetcher( memo(SlidableList)));