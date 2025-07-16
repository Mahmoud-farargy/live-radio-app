import React, { Fragment, useEffect, useState, memo } from "react";
import Carousel from "react-items-carousel";
import Loader from "react-loader-spinner";
import SlidableListItem from "./SlidableListItem/SlidableListItem";
import PropTypes from "prop-types";
import { withStationsFetcher } from "../../components/HOC/withStationsFetcher";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Consts from "../../utilities/consts";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { serialize, trimText } from "../../utilities/tools";
import { connect } from "react-redux";

const SlidableList = ({ params, fetchStations, listTitle, currentBufferingAudio }) => {
  const [itemsPerSide, setItemsPerSlide] = useState(6);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [listName, setListName] = useState("");
  const [response, setResponse] = useState({
    list: [],
    loading: true
  });
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
  if (params && typeof params === "object" && params !== null) {
      setActiveItemIndex(0);
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

  useEffect(() => {
    const ITEM_GUTTER = 12;
    const MIN_ITEMS = 1;
    const MAX_ITEMS = 9;

    const handleResize = () => {
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;
        const ITEM_WIDTH = viewportWidth <= 540 ? 140 : 200;

        const availableWidth = viewportWidth - 40;
        const calculatedItems = Math.floor(
          availableWidth / (ITEM_WIDTH + ITEM_GUTTER)
        );

        const itemsToShow = Math.max(
          MIN_ITEMS,
          Math.min(MAX_ITEMS, calculatedItems)
        );
        setItemsPerSlide(itemsToShow);
      };

      let timeout;
      const debouncedResize = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          handleResize();
        }, 150);
      };

      handleResize();
      window.addEventListener("resize", debouncedResize);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener("resize", debouncedResize);
      };

  }, []);

  const directMeToCategoryPage = () => {
    history.push(`${Consts.CATEGORY}?${serialize({ ...params })}`);
  }
  return (
    <Fragment>
      {response.loading ?
        <div id="slidableListLoading">
          <Loader
            type="TailSpin"
            arialLabel="loading-indicator"
            color="var(--gray)"
            height={70}
            width={70} />
        </div>
        : response && response.list.length > 0 &&
        <section id="slidableList">
          <div className="slidableList--header flex-row">
            <h4 className="list--name"title={listTitle}>{trimText(listTitle || listName, 25)}</h4>
            <span className="see--all--btn" onClick={() => directMeToCategoryPage()}>{t("titles.see_all")}</span>
          </div>
          <ul className="slidableList--ul">
            <Carousel
              requestToChangeActive={setActiveItemIndex}
              activeItemIndex={activeItemIndex}
              numberOfCards={itemsPerSide}
              infiniteLoop={false}
              firstAndLastGutter={true}
              enablePlaceholder={true}
              gutter={4}
              outsideChevron={false}
              slidesToScroll={3}
              chevronWidth={25}
              placeholderItem={
                <Loader
                  type="TailSpin"
                  arialLabel="loading-indicator"
                  color="var(--light-black)"
                  height={60}
                  width={60} />
              }
              classes={{ wrapper: "wrapper", itemsWrapper: "items--wrapper", itemsInnerWrapper: "items--inner--wrapper" }}
              rightChevron={<button aria-label="Scroll right" className="slidablelist--right--arrow">
                <IoIosArrowDroprightCircle />
              </button>}
              leftChevron={<button aria-label="Scroll left" className="slidablelist--left--arrow">
                <IoIosArrowDropleftCircle />
              </button>}
            >
              {response.list?.map((item, i) => {
                return item && (<SlidableListItem key={item.stationuuid || i} isAudioBuffering={currentBufferingAudio?.state && currentBufferingAudio?.id && (currentBufferingAudio?.id === item.stationuuid)} item={item} wholeList={response.list} />)
              })}
            </Carousel>

          </ul>
        </section>
      }
    </Fragment>
  )
};
SlidableList.propTypes = {
  params: PropTypes.object.isRequired,
  fetchStations: PropTypes.func.isRequired,
  listTitle: PropTypes.string,
}
SlidableList.defaultProps = {
  params: {}
}
const mapStateToProps = state => {
  return {
    currentBufferingAudio: state[Consts.MAIN].currentBufferingAudio || {}
  }
}
export default connect(mapStateToProps)(withStationsFetcher( memo(SlidableList)));